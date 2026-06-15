import type { PluginFn } from 'edge.js/types'
import type { TagContract } from 'edge.js/types'
import type { FlickService } from '../types.ts'

/**
 * Builds a block tag that renders its children when `method` resolves to `true`
 * for the given scope.
 *
 * Usage in templates: `@feature('new_checkout', user)`. The tag reorders the
 * arguments into the flick API (`flick.for(scope).isActive(feature)`) at compile
 * time and forwards an optional `@else` branch by processing its children.
 */
function featureTag(tagName: string, method: 'isActive' | 'isInactive'): TagContract {
  return {
    tagName,
    seekable: true,
    block: true,
    compile(parser, buffer, token) {
      const ast = parser.utils.transformAst(
        parser.utils.generateAST(token.properties.jsArg, token.loc, token.filename),
        token.filename,
        parser
      )

      const args = ast.type === 'SequenceExpression' ? ast.expressions : [ast]
      if (args.length !== 2) {
        throw new Error(
          `@${tagName} expects exactly two arguments "(feature, scope)" in ${token.filename}:${token.loc.start.line}`
        )
      }

      const feature = parser.utils.stringify(args[0])
      const scope = parser.utils.stringify(args[1])

      buffer.writeStatement(
        `if (await state.flick.for(${scope}).${method}(${feature})) {`,
        token.filename,
        token.loc.start.line
      )
      token.children.forEach((child) => parser.processToken(child, buffer))
      buffer.writeStatement(`}`, token.filename, token.loc.start.line)
    },
  }
}

/**
 * Edge plugin for Flick. Exposes the `flick` service as a template global and
 * registers the `@feature` / `@featureInactive` block tags for conditionally
 * rendering markup based on feature state.
 *
 * It is registered automatically by the Flick provider when Edge.js is
 * configured. Register it manually with `edge.use(edgePluginFlick(flick))`.
 *
 * @example
 * ```edge
 * @feature('new_checkout', user)
 *   @include('checkout/new')
 * @else
 *   @include('checkout/legacy')
 * @end
 *
 * @featureInactive('beta', user)
 *   <a href="/beta/join">Join the beta</a>
 * @end
 *
 * {{ await flick.for(user).value('theme') }}
 * ```
 */
export function edgePluginFlick(flick: FlickService): PluginFn<undefined> {
  return (edge) => {
    edge.global('flick', flick)
    edge.registerTag(featureTag('feature', 'isActive'))
    edge.registerTag(featureTag('featureInactive', 'isInactive'))
  }
}
