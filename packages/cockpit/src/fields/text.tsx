import { ComponentProps } from '@foadonis/spark/jsx'
import { BaseField, FieldFormProps, FieldIndexProps } from './base.js'
import { Input } from '../components/ui/input.js'
import { Fieldset } from '../components/ui/fieldset.js'
import stringHelpers from '@adonisjs/core/helpers/string'

export class TextField extends BaseField {
  props: ComponentProps<typeof Input> = {}

  protected $label: string
  protected $hint?: string

  constructor(name: string) {
    super(name)
    this.$label = stringHelpers.sentenceCase(name)
  }

  $formComponent = ({ ref, value }: FieldFormProps) => {
    return (
      <Fieldset>
        <Fieldset.Label>{this.$label}</Fieldset.Label>
        <Input $model={ref} value={value} {...this.props} />
        <Fieldset.Message>{this.$hint}</Fieldset.Message>
      </Fieldset>
    )
  }

  $indexComponent = ({ value }: FieldIndexProps) => {
    return value
  }

  label(label: string) {
    this.$label = label
    return this
  }

  placeholder(placeholder: string) {
    this.props.placeholder = placeholder
    return this
  }

  type(type: ComponentProps<typeof Input>['type']) {
    this.props.type = type
    return this
  }

  readonly(readonly = true) {
    this.props.readOnly = readonly
    return this
  }

  disabled(disabled = true) {
    this.props.disabled = disabled
    return this
  }

  required(required = true) {
    this.props.required = required
    return this
  }

  hint(hint: string) {
    this.$hint = hint
    return this
  }
}
