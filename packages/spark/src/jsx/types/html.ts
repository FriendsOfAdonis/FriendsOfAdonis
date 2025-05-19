import { SparkNode } from './jsx.js'
import { AlpineEventAttributes, AlpineFormAttributes, AlpineInputAttributes } from './alpine.js'
import type * as Aria from './aria.js'

export namespace HTML {
  type CrossOrigin = 'anonymous' | 'use-credentials'
  type Target = '_blank' | '_self' | '_parent' | '_top'
  type ReferrerPolicy =
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url'
  type InputType =
    | 'button'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'image'
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    | 'range'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week'

  /** Global HTML attributes from https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes */
  export interface GlobalAttributes<T extends EventTarget>
    extends EventAttributes<T>,
      Aria.Attributes,
      AlpineEventAttributes {
    /** Defines a unique identifier (ID) which must be unique in the whole document. Its purpose is to identify the element when linking (using a fragment identifier), scripting, or styling (with CSS). */
    id?: string
    /** A space-separated list of the classes of the element. Classes allow CSS and JavaScript to select and access specific elements via the [class selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors) or functions like the method [`Document.getElementsByClassName()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName). */
    className?: string
    /** Contains [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) styling declarations to be applied to the element. Note that it is recommended for styles to be defined in a separate file or files. This attribute and the [`<style>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) element have mainly the purpose of allowing for quick styling, for example for testing purposes. */
    style?: string
    /** An enumerated attribute indicating that the element is not yet, or is no longer, relevant. For example, it can be used to hide elements of the page that can't be used until the login process has been completed. The browser won't render such elements. This attribute must not be used to hide content that could legitimately be shown. */
    hidden?: boolean | 'hidden' | 'until-found'
    /** An enumerated attribute indicating whether the element can be dragged, using the Drag and Drop API. */
    draggable?: boolean
    /**
     * An enumerated attribute indicating if the element should be editable by the user. If so, the browser modifies its widget to allow editing. The attribute must take one of the following values:
     * - `true` or the empty string, which indicates that the element must be editable;
     * - `false`, which indicates that the element must not be editable.
     */
    contentEditable?: boolean
    /** Indicates that an element is to be focused on page load, or as soon as the `<dialog>` it is part of is displayed. **/
    autoFocus?: boolean
    /** Helps define the language of an element: the language that non-editable elements are in, or the language that editable elements should be written in by the user. The attribute contains one "language tag" (made of hyphen-separated "language subtags") in the format defined in [RFC 5646](https://datatracker.ietf.org/doc/html/rfc5646). */
    lang?: string
    /** Roles define the semantic meaning of content, allowing screen readers and other tools to present and support interaction with an object in a way that is consistent with user expectations of that type of object.  */
    role?: Aria.Role
    /** Provides a hint for generating a keyboard shortcut for the current element. This attribute consists of a space-separated list of characters. The browser should use the first one that exists on the computer keyboard layout. */
    accesskey?: string
    /**
     * An enumerated attribute indicating the directionality of the element's text. It can have the following values:
     * - `ltr`, which means left to right and is to be used for languages that are written from the left to the right (like English);
     * - `rtl`, which means right to left and is to be used for languages that are written from the right to the left (like Arabic);
     * - `auto`, which lets the user agent decide. It uses a basic algorithm as it parses the characters inside the element until it finds a character with a strong directionality, then it applies that directionality to the whole element.
     */
    dir?: 'auto' | 'rtl' | 'ltr'
    /**
     * An integer attribute indicating if the element can take input focus (is focusable), if it should participate to sequential keyboard navigation, and if so, at what position. It can take several values:
     * - a negative value means that the element should be focusable, but should not be reachable via sequential keyboard navigation;
     * - `0` means that the element should be focusable and reachable via sequential keyboard navigation, but its relative order is defined by the platform convention;
     * - a positive value which means should be focusable and reachable via sequential keyboard navigation; its relative order is defined by the value of the attribute: the sequential follow the increasing number of the `tabindex`. If several elements share the same tabindex, their relative order follows their relative position in the document).
     */
    tabIndex?: number
    /** Contains a text representing advisory information related to the element it belongs to. Such information can typically, but not necessarily, be presented to the user as a tooltip. */
    title?: string
    /**
     * An enumerated attribute that is used to specify whether an element's attribute values and the values of its Text node children are to be translated when the page is localized, or whether to leave them unchanged. It can have the following values:
     * - empty string or yes, which indicates that the element will be translated.
     * - `no`, which indicates that the element will not be translated.
     */
    translate?: 'yes' | 'no'
    /**
     * Turns an element into a popover element; takes a popover state ("auto" or "manual") as its value.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
     */
    popover?: boolean | 'auto' | 'manual'
    /** A space-separated list of the part names of the element. Part names allows CSS to select and style specific elements in a shadow tree via the [`::part`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) pseudo-element. */
    part?: string
    /** The `slot` attribute assigns a slot in a [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) shadow tree to an element: An element with a `slot` attribute is assigned to the slot created by the `<slot>` element whose name attribute's value matches that slot attribute's value. */
    slot?: string
    /** Allows you to specify that a standard HTML element should behave like a registered custom built-in element (see [Using custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) for more details). */
    is?: string
    /** A boolean value that makes the browser disregard user input events for the element. Useful when click events are present. */
    inert?: boolean

    children?: SparkNode | undefined
  }

  interface HtmlAttributes<T extends EventTarget> extends GlobalAttributes<T> {}

  interface AnchorAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    download?: string | true
    href?: string
    hrefLang?: string
    media?: string
    ping?: string
    referrerPolicy?: ReferrerPolicy
    rel?: string
    target?: Target
    type?: string

    $link?: true
  }

  interface ImgAttributes<T extends EventTarget>
    extends GlobalAttributes<T>,
      LoaderElementAttributes<T> {
    alt?: string
    crossOrigin?: CrossOrigin
    decoding?: 'async' | 'auto' | 'sync'
    height?: number | string
    isMap?: boolean
    loading?: 'eager' | 'lazy'
    referRerpolicy?: ReferrerPolicy
    sizes?: string
    src?: string
    srcSet?: string
    useMap?: string
    width?: number | string
  }

  interface FormAttributes<T extends EventTarget>
    extends GlobalAttributes<T>,
      AlpineFormAttributes {
    'accept-charset'?: string
    'autoComplete'?: 'on' | 'off'
    'encType'?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain'
    'method'?: 'GET' | 'POST' | 'dialog'
    'name'?: string
    'noValidate'?: boolean
    'target'?: Target
  }

  export interface InputAttributes<T extends EventTarget>
    extends GlobalAttributes<T>,
      InputElementAttributes<T>,
      AlpineInputAttributes {
    accept?: string
    alt?: string
    autoComplete?: string
    capture?: boolean | 'user' | 'environment'
    checked?: boolean
    disabled?: boolean
    enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'
    form?: string
    formEncType?: FormAttributes<T>['encType']
    formMethod?: FormAttributes<T>['method']
    formNoValidate?: boolean
    formTarget?: Target
    height?: number | string
    list?: string
    max?: number | string
    maxLength?: number
    min?: number | string
    minLength?: number
    multiple?: boolean
    name?: string
    pattern?: string
    placeholder?: string
    readOnly?: boolean
    required?: boolean
    size?: number
    src?: string
    step?: number | string
    type?: InputType
    value?: string | ReadonlyArray<string> | number
    width?: number | string
    /**
     * Turns a <button> or <input> element into a popover control button; takes the ID of the popover element to control as its value.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
     */
    popovertarget?: string
    /**
     * Specifies the action to be performed ("hide", "show", or "toggle") on the popover element being controlled by a control <button> or <input>.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
     */
    popovertargetaction?: 'hide' | 'show' | 'toggle'
  }

  export interface OptionAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    disabled?: boolean
    label?: string
    selected?: boolean
    value?: string | number
  }

  export interface SelectAttributes<T extends EventTarget>
    extends GlobalAttributes<T>,
      InputElementAttributes<T> {
    autoComplete?: string
    disabled?: boolean
    form?: string
    multiple?: boolean
    name?: string
    required?: boolean
    size?: number
    value?: string | ReadonlyArray<string> | number
  }

  export interface TextareaAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    autoComplete?: string
    cols?: number
    dirName?: string
    disabled?: boolean
    form?: string
    maxLength?: number
    minLength?: number
    name?: string
    placeholder?: string
    readOnly?: boolean
    required?: boolean
    rows?: number
    value?: string
    wrap?: string
  }

  export interface ButtonAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    name?: string
    type?: 'submit' | 'reset' | 'button'
    value?: string
    disabled?: boolean
    form?: string
    formEncType?: FormAttributes<T>['encType']
    formMethod?: FormAttributes<T>['method']
    formNoValidate?: boolean
    formTarget?: string
    /**
     * Turns a <button> or <input> element into a popover control button; takes the ID of the popover element to control as its value.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
     */
    popovertarget?: string
    /**
     * Specifies the action to be performed ("hide", "show", or "toggle") on the popover element being controlled by a control <button> or <input>.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
     */
    popovertargetaction?: 'hide' | 'show' | 'toggle'
  }

  interface DialogAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    open?: boolean
  }

  interface AreaAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    alt?: string
    coords?: string
    download?: string
    href?: string
    hrefLang?: string
    media?: string
    referrerPolicy?: ReferrerPolicy
    shape?: string
    target?: string
  }

  interface BaseAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    href?: string
    target?: string
  }

  interface BlockquoteAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    cite?: string
  }

  interface CanvasAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    height?: number | string
    width?: number | string
  }

  interface ColAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    span?: number
    width?: number | string
  }

  interface ColgroupAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    span?: number
  }

  interface DataAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    value?: string | ReadonlyArray<string> | number
  }

  interface DetailsAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    open?: boolean
  }

  interface DelAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    cite?: string
    dateTime?: string
  }

  interface EmbedAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    height?: number | string
    src?: string
    type?: string
    width?: number | string
  }

  interface FieldsetAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    disabled?: boolean
    form?: string
    name?: string
  }

  interface IframeAttributes<T extends EventTarget>
    extends GlobalAttributes<T>,
      LoaderElementAttributes<T> {
    allow?: string
    allowFullScreen?: boolean
    allowTransparency?: boolean
    height?: number | string
    loading?: 'eager' | 'lazy'
    name?: string
    referrerPolicy?: ReferrerPolicy
    sandbox?: string
    seamless?: boolean
    src?: string
    srcDoc?: string
    width?: number | string
  }

  interface InsAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    cite?: string
    dateTime?: string
  }

  interface KeygenAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    challenge?: string
    disabled?: boolean
    form?: string
    keyType?: string
    keyParams?: string
    name?: string
  }

  interface LabelAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    form?: string
    for?: string
  }

  interface LiAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    value?: string | ReadonlyArray<string> | number
  }

  interface LinkAttributes<T extends EventTarget>
    extends GlobalAttributes<T>,
      LoaderElementAttributes<T> {
    as?: string
    crossOrigin?: CrossOrigin
    fetchPriority?: 'high' | 'low' | 'auto'
    href?: string
    hrefLang?: string
    integrity?: string
    media?: string
    imageSrcSet?: string
    imageSizes?: string
    referrerPolicy?: ReferrerPolicy
    sizes?: string
    type?: string
    rel?: string
  }

  interface MapAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    name?: string
  }

  interface MenuAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    type?: string
  }

  interface AudioAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    autoPlay?: boolean
    controls?: boolean
    controlsList?: string
    crossOrigin?: CrossOrigin
    loop?: boolean
    mediaGroup?: string
    muted?: boolean
    playsInline?: boolean
    preload?: string
    src?: string
  }

  interface MetaAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    charset?: string
    content?: string
    httpEquiv?: string
    name?: string
    media?: string
  }

  interface MeterAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    form?: string
    high?: number
    low?: number
    max?: number | string
    min?: number | string
    optimum?: number
    value?: string | ReadonlyArray<string> | number
  }

  interface QuoteAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    cite?: string
  }

  interface ObjectAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    classID?: string
    data?: string
    form?: string
    height?: number | string
    name?: string
    type?: string
    useMap?: string
    width?: number | string
    wmode?: string
  }

  interface OlAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    reversed?: boolean
    start?: number
    type?: '1' | 'a' | 'A' | 'i' | 'I'
  }

  interface OptgroupAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    disabled?: boolean
    label?: string
  }

  interface OutputAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    form?: string
    for?: string
    name?: string
  }

  interface ProgressAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    max?: number | string
    value?: string | ReadonlyArray<string> | number
  }

  interface SlotAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    name?: string
  }

  interface ScriptAttributes<T extends EventTarget>
    extends GlobalAttributes<T>,
      LoaderElementAttributes<T> {
    async?: boolean
    crossOrigin?: CrossOrigin
    defer?: boolean
    integrity?: string
    noModule?: boolean
    referrerPolicy?: ReferrerPolicy
    src?: string
    type?: string
  }

  interface StyleAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    media?: string
    scoped?: boolean
    type?: string
  }

  interface SourceAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    height?: number | string
    media?: string
    sizes?: string
    src?: string
    srcSet?: string
    type?: string
    width?: number | string
  }

  interface TableAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    align?: 'left' | 'center' | 'right'
    bgcolor?: string
    border?: number
    cellPadding?: number | string
    cellSpacing?: number | string
    frame?: boolean
    rules?: 'none' | 'groups' | 'rows' | 'columns' | 'all'
    summary?: string
    width?: number | string
  }

  interface TdAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    colSpan?: number
    headers?: string
    rowSpan?: number
  }

  interface ThAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    colSpan?: number
    headers?: string
    rowSpan?: number
    scope?: string
    abbr?: string
  }

  interface TimeAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    dateTime?: string
  }

  interface TrackAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    default?: boolean
    kind?: string
    label?: string
    src?: string
    srcLang?: string
  }

  interface VideoAttributes<T extends EventTarget> extends AudioAttributes<T> {
    height?: number | string
    playsInline?: boolean
    poster?: string
    width?: number | string
    disablePictureInPicture?: boolean
    disableRemotePlayback?: boolean
  }

  interface SVGAttributes<T extends EventTarget> extends GlobalAttributes<T> {
    accentHeight?: number | string
    accumulate?: 'none' | 'sum'
    additive?: 'replace' | 'sum'
    alignmentBaseline?:
      | 'auto'
      | 'baseline'
      | 'before-edge'
      | 'text-before-edge'
      | 'middle'
      | 'central'
      | 'after-edge'
      | 'text-after-edge'
      | 'ideographic'
      | 'alphabetic'
      | 'hanging'
      | 'mathematical'
      | 'inherit'
    allowReorder?: 'no' | 'yes'
    alphabetic?: number | string
    amplitude?: number | string
    arabicForm?: 'initial' | 'medial' | 'terminal' | 'isolated'
    ascent?: number | string
    attributeName?: string
    attributeType?: string
    autoReverse?: number | string
    azimuth?: number | string
    baseFrequency?: number | string
    baselineShift?: number | string
    baseProfile?: number | string
    bbox?: number | string
    begin?: number | string
    bias?: number | string
    by?: number | string
    calcMode?: number | string
    capHeight?: number | string
    clip?: number | string
    clipPath?: string
    clipPathUnits?: number | string
    clipRule?: number | string
    colorInterpolation?: number | string
    colorInterpolationFilters?: 'auto' | 'sRGB' | 'linearRGB' | 'inherit'
    colorProfile?: number | string
    colorRendering?: number | string
    contentScriptType?: number | string
    contentStyleType?: number | string
    cursor?: number | string
    cx?: number | string
    cy?: number | string
    d?: string
    decelerate?: number | string
    descent?: number | string
    diffuseConstant?: number | string
    direction?: number | string
    display?: number | string
    divisor?: number | string
    dominantBaseline?: number | string
    dur?: number | string
    dx?: number | string
    dy?: number | string
    edgeMode?: number | string
    elevation?: number | string
    enableBackground?: number | string
    end?: number | string
    exponent?: number | string
    externalResourcesRequired?: number | string
    fill?: string
    fillOpacity?: number | string
    fillRule?: 'nonzero' | 'evenodd' | 'inherit'
    filter?: string
    filterRes?: number | string
    filterUnits?: number | string
    floodColor?: number | string
    floodOpacity?: number | string
    focusable?: number | string
    fontFamily?: string
    fontSize?: number | string
    fontSizeAdjust?: number | string
    fontStretch?: number | string
    fontStyle?: number | string
    fontVariant?: number | string
    fontWeight?: number | string
    format?: number | string
    from?: number | string
    fx?: number | string
    fy?: number | string
    g1?: number | string
    g2?: number | string
    glyphName?: number | string
    glyphOrientationHorizontal?: number | string
    glyphOrientationVertical?: number | string
    glyphRef?: number | string
    gradientTransform?: string
    gradientUnits?: string
    hanging?: number | string
    height?: number | string
    horizAdvX?: number | string
    horizOriginX?: number | string
    ideographic?: number | string
    imageRendering?: number | string
    in?: string
    in2?: number | string
    intercept?: number | string
    k?: number | string
    k1?: number | string
    k2?: number | string
    k3?: number | string
    k4?: number | string
    kernelMatrix?: number | string
    kernelUnitLength?: number | string
    kerning?: number | string
    keyPoints?: number | string
    keySplines?: number | string
    keyTimes?: number | string
    lengthAdjust?: number | string
    letterSpacing?: number | string
    lightingColor?: number | string
    limitingConeAngle?: number | string
    local?: number | string
    markerEnd?: string
    markerHeight?: number | string
    markerMid?: string
    markerStart?: string
    markerUnits?: number | string
    markerWidth?: number | string
    mask?: string
    maskContentUnits?: number | string
    maskUnits?: number | string
    mathematical?: number | string
    mode?: number | string
    numOctaves?: number | string
    offset?: number | string
    opacity?: number | string
    operator?: number | string
    order?: number | string
    orient?: number | string
    orientation?: number | string
    origin?: number | string
    overflow?: number | string
    overlinePosition?: number | string
    overlineThickness?: number | string
    paintOrder?: number | string
    panose1?: number | string
    pathLength?: number | string
    patternContentUnits?: string
    patternTransform?: number | string
    patternUnits?: string
    pointerEvents?: number | string
    points?: string
    pointsAtX?: number | string
    pointsAtY?: number | string
    pointsAtZ?: number | string
    preserveAlpha?: number | string
    preserveAspectRatio?: string
    primitiveUnits?: number | string
    r?: number | string
    radius?: number | string
    refX?: number | string
    refY?: number | string
    renderingIntent?: number | string
    repeatCount?: number | string
    repeatDur?: number | string
    requiredExtensions?: number | string
    requiredFeatures?: number | string
    restart?: number | string
    result?: string
    rotate?: number | string
    rx?: number | string
    ry?: number | string
    scale?: number | string
    seed?: number | string
    shapeRendering?: number | string
    slope?: number | string
    spacing?: number | string
    specularConstant?: number | string
    specularExponent?: number | string
    speed?: number | string
    spreadMethod?: string
    startOffset?: number | string
    stdDeviation?: number | string
    stemh?: number | string
    stemv?: number | string
    stitchTiles?: number | string
    stopColor?: string
    stopOpacity?: number | string
    strikethroughPosition?: number | string
    strikethroughThickness?: number | string
    string?: number | string
    stroke?: string
    strokeDasharray?: string | number
    strokeDashoffset?: string | number
    strokeLinecap?: 'butt' | 'round' | 'square' | 'inherit'
    strokeLinejoin?: 'miter' | 'round' | 'bevel' | 'inherit'
    strokeMiterlimit?: string | number
    strokeOpacity?: number | string
    strokeWidth?: number | string
    surfaceScale?: number | string
    systemLanguage?: number | string
    tableValues?: number | string
    targetX?: number | string
    targetY?: number | string
    textAnchor?: string
    textDecoration?: number | string
    textLength?: number | string
    textRendering?: number | string
    to?: number | string
    transform?: string
    u1?: number | string
    u2?: number | string
    underlinePosition?: number | string
    underlineThickness?: number | string
    unicode?: number | string
    unicodeBidi?: number | string
    unicodeRange?: number | string
    unitsPerEm?: number | string
    vAlphabetic?: number | string
    values?: string
    vectorEffect?: number | string
    version?: string
    vertAdvY?: number | string
    vertOriginX?: number | string
    vertOriginY?: number | string
    vHanging?: number | string
    vIdeographic?: number | string
    viewBox?: string
    viewTarget?: number | string
    visibility?: number | string
    vMathematical?: number | string
    width?: number | string
    widths?: number | string
    wordSpacing?: number | string
    writingMode?: number | string
    x?: number | string
    x1?: number | string
    x2?: number | string
    xChannelSelector?: string
    xHeight?: number | string
    xlinkActuate?: string
    xlinkArcrole?: string
    xlinkHref?: string
    xlinkRole?: string
    xlinkShow?: string
    xlinkTitle?: string
    xlinkType?: string
    xmlBase?: string
    xmlLang?: string
    xmlns?: string
    xmlnsXlink?: string
    xmlSpace?: string
    y?: number | string
    y1?: number | string
    y2?: number | string
    yChannelSelector?: string
    z?: number | string
    zoomAndPan?: string
  }

  // @ts-expect-error -- For future use
  interface InputElementAttributes<T extends EventTarget> {}

  // @ts-expect-error -- For future use
  interface LoaderElementAttributes<T extends EventTarget> {
    // TODO: Add loader events
  }

  // @ts-expect-error -- For future use
  interface EventAttributes<T extends EventTarget> {}

  export interface Elements {
    // custom elements
    [key: `${string}-${string}`]: GlobalAttributes<HTMLElement>
    a: AnchorAttributes<HTMLAnchorElement>
    abbr: GlobalAttributes<HTMLElement>
    address: GlobalAttributes<HTMLElement>
    area: AreaAttributes<HTMLAreaElement>
    article: GlobalAttributes<HTMLElement>
    aside: GlobalAttributes<HTMLElement>
    audio: AudioAttributes<HTMLAudioElement>
    b: GlobalAttributes<HTMLElement>
    base: BaseAttributes<HTMLBaseElement>
    bdi: GlobalAttributes<HTMLElement>
    bdo: GlobalAttributes<HTMLElement>
    big: GlobalAttributes<HTMLElement>
    blockquote: BlockquoteAttributes<HTMLQuoteElement>
    body: GlobalAttributes<HTMLBodyElement>
    br: GlobalAttributes<HTMLBRElement>
    button: ButtonAttributes<HTMLButtonElement>
    canvas: CanvasAttributes<HTMLCanvasElement>
    caption: GlobalAttributes<HTMLElement>
    center: GlobalAttributes<HTMLElement>
    cite: GlobalAttributes<HTMLElement>
    code: GlobalAttributes<HTMLElement>
    col: ColAttributes<HTMLTableColElement>
    colgroup: ColgroupAttributes<HTMLTableColElement>
    data: DataAttributes<HTMLDataElement>
    datalist: GlobalAttributes<HTMLDataListElement>
    dd: GlobalAttributes<HTMLElement>
    del: DelAttributes<HTMLModElement>
    details: DetailsAttributes<HTMLDetailsElement>
    dfn: GlobalAttributes<HTMLElement>
    dialog: DialogAttributes<HTMLDialogElement>
    div: GlobalAttributes<HTMLDivElement>
    dl: GlobalAttributes<HTMLDListElement>
    dt: GlobalAttributes<HTMLElement>
    em: GlobalAttributes<HTMLElement>
    embed: EmbedAttributes<HTMLEmbedElement>
    fieldset: FieldsetAttributes<HTMLFieldSetElement>
    figcaption: GlobalAttributes<HTMLElement>
    figure: GlobalAttributes<HTMLElement>
    footer: GlobalAttributes<HTMLElement>
    form: FormAttributes<HTMLFormElement>
    h1: GlobalAttributes<HTMLHeadingElement>
    h2: GlobalAttributes<HTMLHeadingElement>
    h3: GlobalAttributes<HTMLHeadingElement>
    h4: GlobalAttributes<HTMLHeadingElement>
    h5: GlobalAttributes<HTMLHeadingElement>
    h6: GlobalAttributes<HTMLHeadingElement>
    head: GlobalAttributes<HTMLHeadElement>
    header: GlobalAttributes<HTMLElement>
    hgroup: GlobalAttributes<HTMLElement>
    hr: GlobalAttributes<HTMLHRElement>
    html: HtmlAttributes<HTMLHtmlElement>
    i: GlobalAttributes<HTMLElement>
    iframe: IframeAttributes<HTMLIFrameElement>
    img: ImgAttributes<HTMLImageElement>
    input: InputAttributes<HTMLInputElement>
    ins: InsAttributes<HTMLModElement>
    kbd: GlobalAttributes<HTMLElement>
    keygen: KeygenAttributes<HTMLElement>
    label: LabelAttributes<HTMLLabelElement>
    legend: GlobalAttributes<HTMLLegendElement>
    li: LiAttributes<HTMLLIElement>
    link: LinkAttributes<HTMLLinkElement>
    main: GlobalAttributes<HTMLElement>
    map: MapAttributes<HTMLMapElement>
    mark: GlobalAttributes<HTMLElement>
    menu: MenuAttributes<HTMLElement>
    meta: MetaAttributes<HTMLMetaElement>
    meter: MeterAttributes<HTMLMeterElement>
    nav: GlobalAttributes<HTMLElement>
    noindex: GlobalAttributes<HTMLElement>
    noscript: GlobalAttributes<HTMLElement>
    object: ObjectAttributes<HTMLObjectElement>
    ol: OlAttributes<HTMLOListElement>
    optgroup: OptgroupAttributes<HTMLOptGroupElement>
    option: OptionAttributes<HTMLOptionElement>
    output: OutputAttributes<HTMLOutputElement>
    p: GlobalAttributes<HTMLParagraphElement>
    picture: GlobalAttributes<HTMLElement>
    pre: GlobalAttributes<HTMLPreElement>
    progress: ProgressAttributes<HTMLProgressElement>
    q: QuoteAttributes<HTMLQuoteElement>
    rp: GlobalAttributes<HTMLElement>
    rt: GlobalAttributes<HTMLElement>
    ruby: GlobalAttributes<HTMLElement>
    s: GlobalAttributes<HTMLElement>
    samp: GlobalAttributes<HTMLElement>
    search: GlobalAttributes<HTMLElement>
    slot: SlotAttributes<HTMLSlotElement>
    script: ScriptAttributes<HTMLScriptElement>
    section: GlobalAttributes<HTMLElement>
    select: SelectAttributes<HTMLSelectElement>
    small: GlobalAttributes<HTMLElement>
    source: SourceAttributes<HTMLSourceElement>
    span: GlobalAttributes<HTMLSpanElement>
    strong: GlobalAttributes<HTMLElement>
    style: StyleAttributes<HTMLStyleElement>
    sub: GlobalAttributes<HTMLElement>
    summary: GlobalAttributes<HTMLElement>
    sup: GlobalAttributes<HTMLElement>
    table: TableAttributes<HTMLTableElement>
    template: GlobalAttributes<HTMLTemplateElement>
    tbody: GlobalAttributes<HTMLTableSectionElement>
    td: TdAttributes<HTMLTableCellElement>
    textarea: TextareaAttributes<HTMLTextAreaElement>
    tfoot: GlobalAttributes<HTMLTableSectionElement>
    th: ThAttributes<HTMLTableCellElement>
    thead: GlobalAttributes<HTMLTableSectionElement>
    time: TimeAttributes<HTMLTimeElement>
    title: GlobalAttributes<HTMLTitleElement>
    tr: GlobalAttributes<HTMLTableRowElement>
    track: TrackAttributes<HTMLTrackElement>
    u: GlobalAttributes<HTMLElement>
    ul: GlobalAttributes<HTMLUListElement>
    var: GlobalAttributes<HTMLElement>
    video: VideoAttributes<HTMLVideoElement>
    wbr: GlobalAttributes<HTMLElement>
  }

  export interface SVGElements {
    svg: SVGAttributes<SVGSVGElement>
    animate: SVGAttributes<SVGAnimateElement>
    circle: SVGAttributes<SVGCircleElement>
    animateMotion: SVGAttributes<SVGAnimateMotionElement>
    animateTransform: SVGAttributes<SVGAnimateTransformElement>
    clipPath: SVGAttributes<SVGClipPathElement>
    defs: SVGAttributes<SVGDefsElement>
    desc: SVGAttributes<SVGDescElement>
    ellipse: SVGAttributes<SVGEllipseElement>
    feBlend: SVGAttributes<SVGFEBlendElement>
    feColorMatrix: SVGAttributes<SVGFEColorMatrixElement>
    feComponentTransfer: SVGAttributes<SVGFEComponentTransferElement>
    feComposite: SVGAttributes<SVGFECompositeElement>
    feConvolveMatrix: SVGAttributes<SVGFEConvolveMatrixElement>
    feDiffuseLighting: SVGAttributes<SVGFEDiffuseLightingElement>
    feDisplacementMap: SVGAttributes<SVGFEDisplacementMapElement>
    feDistantLight: SVGAttributes<SVGFEDistantLightElement>
    feDropShadow: SVGAttributes<SVGFEDropShadowElement>
    feFlood: SVGAttributes<SVGFEFloodElement>
    feFuncA: SVGAttributes<SVGFEFuncAElement>
    feFuncB: SVGAttributes<SVGFEFuncBElement>
    feFuncG: SVGAttributes<SVGFEFuncGElement>
    feFuncR: SVGAttributes<SVGFEFuncRElement>
    feGaussianBlur: SVGAttributes<SVGFEGaussianBlurElement>
    feImage: SVGAttributes<SVGFEImageElement>
    feMerge: SVGAttributes<SVGFEMergeElement>
    feMergeNode: SVGAttributes<SVGFEMergeNodeElement>
    feMorphology: SVGAttributes<SVGFEMorphologyElement>
    feOffset: SVGAttributes<SVGFEOffsetElement>
    fePointLight: SVGAttributes<SVGFEPointLightElement>
    feSpecularLighting: SVGAttributes<SVGFESpecularLightingElement>
    feSpotLight: SVGAttributes<SVGFESpotLightElement>
    feTile: SVGAttributes<SVGFETileElement>
    feTurbulence: SVGAttributes<SVGFETurbulenceElement>
    filter: SVGAttributes<SVGFilterElement>
    foreignObject: SVGAttributes<SVGForeignObjectElement>
    g: SVGAttributes<SVGGElement>
    image: SVGAttributes<SVGImageElement>
    line: SVGAttributes<SVGLineElement>
    linearGradient: SVGAttributes<SVGLinearGradientElement>
    marker: SVGAttributes<SVGMarkerElement>
    mask: SVGAttributes<SVGMaskElement>
    metadata: SVGAttributes<SVGMetadataElement>
    mpath: SVGAttributes<SVGMPathElement>
    path: SVGAttributes<SVGPathElement>
    pattern: SVGAttributes<SVGPatternElement>
    polygon: SVGAttributes<SVGPolygonElement>
    polyline: SVGAttributes<SVGPolylineElement>
    radialGradient: SVGAttributes<SVGRadialGradientElement>
    rect: SVGAttributes<SVGRectElement>
    set: SVGAttributes<SVGSetElement>
    stop: SVGAttributes<SVGStopElement>
    // switch: SVGAttributes<SVGSwitchElement>;
    symbol: SVGAttributes<SVGSymbolElement>
    text: SVGAttributes<SVGTextElement>
    textPath: SVGAttributes<SVGTextPathElement>
    tspan: SVGAttributes<SVGTSpanElement>
    use: SVGAttributes<SVGUseElement>
    view: SVGAttributes<SVGViewElement>
  }
}
