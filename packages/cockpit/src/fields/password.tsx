import { Fieldset } from '../components/ui/fieldset.js'
import { Input } from '../components/ui/input.js'
import { FieldFormProps } from './base.js'
import { TextField } from './text.js'

export class PasswordField extends TextField {
  constructor(name: string) {
    super(name)

    this.type('password').hideOnPeek().hideOnIndex()
  }

  $formComponent = ({ ref }: FieldFormProps) => {
    return (
      <Fieldset>
        <Fieldset.Label>{this.$label}</Fieldset.Label>
        <Input $model={ref} autoComplete="password" {...this.props} />
        <Fieldset.Message>{this.$hint}</Fieldset.Message>
      </Fieldset>
    )
  }
}
