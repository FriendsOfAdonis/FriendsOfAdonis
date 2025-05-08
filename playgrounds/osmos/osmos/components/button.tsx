import { ComponentProps } from '@foadonis/osmos/jsx-runtime'

export const Button = ({ ...props }: ComponentProps<'button'>) => {
  return <button className="bg-black text-white px-4 py-2 text-sm rounded-md" {...props} />
}
