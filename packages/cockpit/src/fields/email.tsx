import { Icon } from '../components/ui/icon.js'
import { FieldIndexProps } from './base.js'
import { TextField } from './text.js'

export class EmailField extends TextField {
  constructor(name: string) {
    super(name)
    this.type('email')
  }

  $indexComponent = ({ value }: FieldIndexProps) => {
    return (
      <div className="group flex gap-2 items-center cursor-pointer">
        {value}
        <Icon name="Mail" className="size-4 opacity-0 group-hover:opacity-100" />
      </div>
    )
  }
}
