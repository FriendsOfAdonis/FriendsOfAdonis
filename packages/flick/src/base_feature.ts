export abstract class BaseFeature<Scope = unknown> {
  before?(scope: Scope): Promise<unknown>

  abstract resolve(scope: Scope): Promise<unknown>
}
