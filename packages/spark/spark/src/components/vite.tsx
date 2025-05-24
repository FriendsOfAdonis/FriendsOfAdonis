export async function Vite(props: { entrypoints: string[] }) {
  const { default: vite } = await import('@adonisjs/vite/services/main')
  const tags = await vite.generateEntryPointsTags(props.entrypoints)

  return (
    <>
      {tags.map((tag) => {
        const Comp = tag.tag
        return <Comp {...tag.attributes} />
      })}
    </>
  )
}
