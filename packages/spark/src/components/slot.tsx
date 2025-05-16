export function Slot({ children, ...props }: any) {
  if (!children || Array.isArray(children)) {
    throw new Error('Using a Slot without a single children element is forbidden')
  }

  const mergedProps = { ...props, ...children.props }

  children.props = mergedProps

  return children
}
