import { ComponentProps } from '@foadonis/spark/jsx'
import { cn } from '../../utils/cn.js'

export const Table = ({ className, ...props }: ComponentProps<'table'>) => (
  <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-200">
    <table className={cn('table table-pin-rows', className)} {...props} />
  </div>
)

Table.Header = ({ ...props }: ComponentProps<'thead'>) => <thead {...props} />

Table.Body = ({ ...props }: ComponentProps<'thead'>) => <tbody {...props} />

Table.Footer = ({ ...props }: ComponentProps<'tfoot'>) => <thead {...props} />

Table.Row = ({ ...props }: ComponentProps<'tr'>) => <tr {...props} />

Table.Head = ({ ...props }: ComponentProps<'th'>) => <th {...props} />

Table.Cell = ({ ...props }: ComponentProps<'td'>) => <td {...props} />

Table.Caption = ({ ...props }: ComponentProps<'caption'>) => <caption {...props} />
