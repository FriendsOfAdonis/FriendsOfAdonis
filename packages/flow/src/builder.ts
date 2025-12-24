import { EdgeDefinition, NodeConfig, NodeDefinition, WorkflowBlueprint } from 'flowcraft'
import { FLOW_STEP_ID } from './symbols.js'
import { StepFunction } from './types.js'
import { Counter } from './builder/counter.js'
import { step } from './decorators/step.js'

export class WorkflowBuilder<
  Context extends Record<string, any> = Record<string, any>,
  Output = any,
> {
  edges: EdgeDefinition[] = []
  nodes: NodeDefinition[] = []

  /** Nodes that are not wired yet */
  #pending?: { nodes: NodeDefinition[]; joinStrategy: 'any' | 'all' }

  /** Keep track of each step usage */
  #counter = new Map<string, number>()

  constructor(private workflowId: string) {}

  /**
   * Pushes a new node to the graph.
   *
   * TODO: Handle static params
   * TODO: Handle context to input mapping
   */
  node(target: string, config?: NodeConfig) {
    this.#node(target, config)
    return this
  }

  /**
   * Pushes a new edge to the graph.
   *
   * TODO: Handle condition
   * TODO: Handle action
   * TODO: Handle transform
   */
  edge(source: string, target: string) {
    this.#edge(source, target)
    return this
  }

  then(target: string): WorkflowBuilder
  then<TInput extends Output, TOutput, TAction extends string>(
    target: StepFunction<TInput, TOutput, TAction>
  ): WorkflowBuilder<Context, TOutput>
  then(target: any): WorkflowBuilder<Context, Output> {
    const node = this.#node(target, {
      joinStrategy: this.#pending?.joinStrategy,
    })

    if (this.#pending) {
      for (const pendingNode of this.#pending.nodes) {
        this.#edge(pendingNode.id, node.id)
      }
    }

    this.#pending = { nodes: [node], joinStrategy: 'any' }

    return this
  }

  parallel(targets: any[]) {
    const nodes = targets.map((target) =>
      this.#node(target, {
        joinStrategy: this.#pending?.joinStrategy,
      })
    )

    if (this.#pending) {
      for (const node of nodes) {
        for (const pendingNode of this.#pending.nodes) {
          this.edge(pendingNode.id, node.id)
        }
      }
    }

    this.#pending = { nodes: nodes, joinStrategy: 'all' }

    return this
  }

  #getStepId(value: string | Function) {
    if (typeof value === 'string') return value

    if (FLOW_STEP_ID in value) {
      return value[FLOW_STEP_ID] as string
    }

    throw new Error(`Could not find step id, did you forget the '@Step' decorator?`)
  }

  /**
   * Increments count for given id and return nodeId
   */
  #use(stepId: string) {
    let count = this.#counter.get(stepId) ?? -1
    count++
    const id = `${stepId}_${count}`

    this.#counter.set(stepId, count)

    return id
  }

  /**
   * Pushes a new node to the graph.
   *
   * TODO: Handle static params
   * TODO: Handle context to input mapping
   */
  #node(target: string | Function, config?: NodeConfig) {
    const stepId = this.#getStepId(target)
    const id = this.#use(stepId)
    const node: NodeDefinition = {
      id,
      uses: stepId,
      config,
    }

    this.nodes.push(node)
    return node
  }

  /**
   * Pushes a new edge to the graph.
   *
   * TODO: Handle condition
   * TODO: Handle action
   * TODO: Handle transform
   */
  #edge(source: string, target: string) {
    const sourceId = this.#getStepId(source)
    const targetId = this.#getStepId(target)

    const edge: EdgeDefinition = {
      source: sourceId,
      target: targetId,
    }

    this.edges.push(edge)
    return edge
  }

  toBlueprint(): WorkflowBlueprint {
    return {
      id: this.workflowId,
      nodes: this.nodes,
      edges: this.edges,
      metadata: {
        version: 'v1',
      },
    }
  }
}
