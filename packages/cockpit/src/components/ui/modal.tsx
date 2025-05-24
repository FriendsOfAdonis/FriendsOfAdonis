import { ComponentProps } from '@foadonis/spark/jsx'

export const Modal = ({ className, ...props }: ComponentProps<'dialog'>) => (
  <dialog className="modal" {...props} />
)

Modal.Content = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className="modal-box" {...props} />
)
