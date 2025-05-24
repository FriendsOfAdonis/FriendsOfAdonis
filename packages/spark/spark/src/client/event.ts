type EventMap = Record<string, any>

export class TypedEventTarget<Events extends EventMap> extends EventTarget {
  on<K extends keyof Events>(
    type: K,
    listener: (event: CustomEvent<Events[K]>) => void,
    options?: boolean | AddEventListenerOptions
  ): void {
    super.addEventListener(type as string, listener as EventListener, options)
  }

  off<K extends keyof Events>(
    type: K,
    listener: (event: CustomEvent<Events[K]>) => void,
    options?: boolean | EventListenerOptions
  ): void {
    super.removeEventListener(type as string, listener as EventListener, options)
  }

  emit<K extends keyof Events>(type: K, detail: Events[K]): CustomEvent<Events[K]> {
    const event = new CustomEvent<Events[K]>(type as string, { detail, cancelable: true })
    super.dispatchEvent(event)
    return event
  }
}
