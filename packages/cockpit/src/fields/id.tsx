import { FieldIndexProps } from './base.js'
import { TextField } from './text.js'

export class IdField extends TextField {
  constructor(name: string) {
    super(name)
    this.hideOnCreate().readonly().disabled()
  }

  $indexComponent = ({ value }: FieldIndexProps) => {
    const isString = typeof value === 'string'
    return <span className="text-muted-foreground">{isString ? value : `#${value}`}</span>
  }
}
