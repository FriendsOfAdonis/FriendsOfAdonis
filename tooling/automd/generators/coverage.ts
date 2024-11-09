import { defineGenerator } from 'automd'
import { readFile } from 'node:fs/promises'

export default defineGenerator({
  name: 'coverage',
  async generate({ config, args, block, url }) {
    const path = new URL('./coverage/coverage-summary.json', url)

    const content = await readFile(path).then((r) => JSON.parse(r.toString()))

    const from: string[] = (args.from ?? 'lines,statements,branches,functions').split(',')

    const percentages = from.map((f) => content.total[f].pct)

    const percentage = Math.round(
      percentages.reduce((acc, pct) => acc + pct, 0) / percentages.length
    )

    const colors = {
      30: 'red',
      70: 'orange',
      100: 'brightgreen',
    }

    const color = Object.entries(colors).find(([pct]) => percentage < +pct)[1] ?? 'red'

    const badgeContent = encodeURIComponent(`coverage-${percentage}%-${color}`)

    return {
      contents: `![Coverage](https://img.shields.io/badge/${badgeContent})`,
    }
  },
})
