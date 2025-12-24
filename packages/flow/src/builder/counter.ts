/**
 * This is a utility class used for tracking workflow steps usage.
 */
export class Counter {
  #counts = new Map<string, number>()

  /**
   * Increments usage of the step and returns the unique id.
   */
  use(step: string): string {
    let count = this.#counts.get(step) ?? -1
    const id = `${step}_${count}`
    count++
    return id
  }
}
