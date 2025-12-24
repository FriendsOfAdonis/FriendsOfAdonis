import {
  EdgeDefinition,
  NodeContext,
  NodeDefinition,
  WorkflowBlueprint,
  FlowRuntime,
  RuntimeOptions,
} from 'flowcraft'
import { Flow } from './flow.js'
import { WorkflowBuilder } from './builder.js'
import { BaseWorkflow } from './mixins/workflow.js'

export interface FlowService extends Flow {}

export type FlowConfig = Omit<RuntimeOptions, 'logger'>

export interface WorkflowContract {
  edges: EdgeDefinition[]
  nodes: NodeDefinition[]

  toBlueprint(): WorkflowBlueprint
}

export type ExtractWorkflowContext<T extends BaseWorkflow> = T['$type']

export type StepFunction<TInput = any, TOutput = any, TAction extends string = string> = (
  input: Workflow.Context<TInput>
) => Promise<Workflow.Output<TOutput, TAction>>

export interface AdapterContract {
  start(): Promise<void>
  stop(): Promise<void>
  enqueue(blueprint: WorkflowBlueprint, registry: any): Promise<void>
}
export type AdapterFactory<T extends AdapterContract = AdapterContract> = (
  runtime: FlowRuntime<any, any>
) => T

export namespace Workflow {
  export interface Builder extends WorkflowBuilder {}

  export type Context<TInput = any> = NodeContext<any, any, TInput>

  export type Output<TOutput = any, TAction extends string = string> = {
    output?: TOutput
    action?: TAction
  }
}
