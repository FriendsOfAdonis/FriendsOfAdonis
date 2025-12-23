import { EdgeDefinition } from 'flowcraft'
import { FLOW_STEP_ID } from './symbols.js'
import { StepFunction } from './types.js'

export class WorkflowBuilder<
  Context extends Record<string, any> = Record<string, any>,
  Output = any,
> {
  edges: EdgeDefinition[] = []

  #lastNode?: string

  edge(source: string, target: string | Function): WorkflowBuilder<Context, Output> {
    const sourceId = this.#getStepId(source)
    const targetId = this.#getStepId(target)

    this.edges.push({
      source: sourceId,
      target: targetId,
    })

    return this
  }

  then(target: string): WorkflowBuilder
  then<TInput extends Output, TOutput, TAction extends string>(
    target: StepFunction<TInput, TOutput, TAction>
  ): WorkflowBuilder<Context, TOutput>
  then(target: any): WorkflowBuilder<Context, Output> {
    const targetId = this.#getStepId(target)

    if (this.#lastNode) {
      this.edge(this.#lastNode, targetId)
    }

    this.#lastNode = targetId

    return this
  }

  #getStepId(value: string | Function) {
    if (typeof value === 'string') return value

    if (FLOW_STEP_ID in value) {
      return value[FLOW_STEP_ID] as string
    }

    throw new Error(`Could not find step id, did you forget the '@Step' decorator?`)
  }
}
