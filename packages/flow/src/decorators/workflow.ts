export function workflow(id?: string) {
  return (target: Function) => {
    console.log('workflow', target)
  }
}
