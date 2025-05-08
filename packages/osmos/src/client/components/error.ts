const STYLE = `
.wrapper {
  position: relative;
  width: 80%;
  height: 80%;
  border: solid 1px oklch(57.7% 0.245 27.325);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}

.header {
  background-color: oklch(57.7% 0.245 27.325);
  color: white;
  padding: 8px;
}

.backdrop {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: black;
  z-index: -1;
  opacity: 0.2;
  cursor: pointer;
}

iframe {
  border: none;
  background-color: white;
}
`

export class HTMLErrorElement extends HTMLElement {
  header: HTMLDivElement
  iframe: HTMLIFrameElement
  backdrop: HTMLDivElement
  wrapper: HTMLDivElement
  shadow: ShadowRoot

  constructor() {
    super()

    this.iframe = document.createElement('iframe')
    this.iframe.width = '100%'
    this.iframe.height = '100%'

    this.header = document.createElement('div')
    this.header.className = 'header'

    this.wrapper = document.createElement('div')
    this.wrapper.className = 'wrapper'
    this.wrapper.appendChild(this.header)
    this.wrapper.appendChild(this.iframe)

    const style = document.createElement('style')
    style.textContent = STYLE

    this.backdrop = document.createElement('div')
    this.backdrop.className = 'backdrop'

    this.shadow = this.attachShadow({ mode: 'open' })
    this.shadow.appendChild(this.wrapper)
    this.shadow.appendChild(this.backdrop)
    this.shadow.appendChild(style)
  }

  #handleClick(event: MouseEvent) {
    console.log(event)
    this.remove()
  }

  connectedCallback() {
    this.backdrop.addEventListener('click', this.#handleClick.bind(this))

    this.style.position = 'fixed'
    this.style.width = '100vw'
    this.style.height = '100vh'
    this.style.top = '0'
    this.style.left = '0'
    this.style.display = 'flex'
    this.style.justifyContent = 'center'
    this.style.alignItems = 'center'
  }

  disconnectedCallback() {
    this.backdrop.removeEventListener('click', this.#handleClick.bind(this))
  }

  setError(message: string) {
    this.header.innerText = message
  }

  setHTML(content: string) {
    this.iframe.srcdoc = content
  }

  /**
   * Displays error modal from fetch Response.
   */
  static async fromResponse(response: Response) {
    const html = await response.text()

    const element = document.createElement('osmos-error') as HTMLErrorElement

    element.setHTML(html)
    element.setError(`FetchError: ${response.url} - ${response.status}`)

    document.body.append(element)
  }
}
