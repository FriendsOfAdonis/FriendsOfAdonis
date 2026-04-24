import { test } from '@japa/runner'
import { indexActions } from '../../src/hooks/index_actions.ts'

type CapturedConfig = {
  source: string
  glob: string[]
  output: string
  importAlias: string
  as: (vfs: any, buffer: any, _: any, helpers: any) => void
}

/**
 * Captures the config passed to indexGenerator.add(...) and runs the
 * `as` callback with a fake vfs/buffer/helpers, returning the rendered string.
 */
function render(options: Parameters<typeof indexActions>[0], tree: any): string {
  const hook = indexActions(options) as { run: (...args: any[]) => any }
  let captured: CapturedConfig | undefined

  const indexGenerator = {
    add(_name: string, config: CapturedConfig) {
      captured = config
    },
  }

  hook.run(undefined as any, undefined as any, indexGenerator as any)

  if (!captured) throw new Error('indexGenerator.add was not called')

  let output = ''
  let indent = 0
  const writePrefix = () => '  '.repeat(indent)
  const buffer = {
    write(line: string) {
      output += writePrefix() + line + '\n'
      return buffer
    },
    writeLine(line: string) {
      output += writePrefix() + line + '\n'
      return buffer
    },
    indent() {
      indent++
      return buffer
    },
    dedent() {
      indent = Math.max(0, indent - 1)
      return buffer
    },
  }
  const vfs = { asTree: () => tree }
  const helpers = { toImportPath: (path: string) => path }

  captured.as(vfs, buffer, undefined, helpers)

  return output
}

test.group('indexActions — defaults', () => {
  test('uses default source / importAlias / output / glob', ({ assert }) => {
    const hook = indexActions() as { run: (...args: any[]) => any }
    let captured: any

    const indexGenerator = {
      add(name: string, config: any) {
        captured = { name, ...config }
      },
    }

    hook.run(undefined as any, undefined as any, indexGenerator as any)

    assert.equal(captured.name, 'actions')
    assert.equal(captured.source, 'app/actions')
    assert.equal(captured.importAlias, '#actions')
    assert.equal(captured.output, '.adonisjs/server/actions.ts')
    assert.deepEqual(captured.glob, ['**/*_action.ts'])
  })

  test('forwards custom source / importAlias / glob through', ({ assert }) => {
    const hook = indexActions({
      source: 'src/actions',
      importAlias: '#custom',
      glob: ['**/*.action.ts'],
    }) as { run: (...args: any[]) => any }
    let captured: any
    hook.run(undefined as any, undefined as any, {
      add(_: string, config: any) {
        captured = config
      },
    } as any)

    assert.equal(captured.source, 'src/actions')
    assert.equal(captured.importAlias, '#custom')
    assert.deepEqual(captured.glob, ['**/*.action.ts'])
  })
})

test.group('indexActions — barrel rendering', () => {
  test('emits a flat tree with PascalCase keys and stripped Action suffix', ({ assert }) => {
    const output = render(undefined, {
      login_action: 'login_action.ts',
      register_action: 'register_action.ts',
    })

    assert.match(output, /import \{ loader \} from '@foadonis\/actions'/)
    assert.match(output, /Login: loader\(\(\) => import\('login_action\.ts'\)\)/)
    assert.match(output, /Register: loader\(\(\) => import\('register_action\.ts'\)\)/)
  })

  test('walks nested folders and emits nested object literals', ({ assert }) => {
    const output = render(
      { skipSegments: [] },
      {
        auth: {
          login_action: 'auth/login_action.ts',
        },
      }
    )

    assert.match(output, /Auth: \{/)
    assert.match(output, /Login: loader\(\(\) => import\('auth\/login_action\.ts'\)\)/)
  })

  test('default skipSegments=["actions"] flattens "actions" folders', ({ assert }) => {
    const output = render(undefined, {
      auth: {
        actions: {
          login_action: 'auth/actions/login_action.ts',
        },
      },
    })

    assert.match(output, /Auth: \{/)
    assert.match(output, /Login: loader\(\(\) => import\('auth\/actions\/login_action\.ts'\)\)/)
    // The "Actions" segment must NOT appear as a nested key
    assert.notMatch(output, /Actions: \{/)
  })

  test('skipSegments=[] preserves every directory segment', ({ assert }) => {
    const output = render(
      { skipSegments: [] },
      {
        auth: {
          actions: {
            login_action: 'auth/actions/login_action.ts',
          },
        },
      }
    )

    assert.match(output, /Auth: \{/)
    assert.match(output, /Actions: \{/)
    assert.match(output, /Login: loader\(\(\) => import\('auth\/actions\/login_action\.ts'\)\)/)
  })

  test('custom skipSegments flattens the given segments only', ({ assert }) => {
    const output = render(
      { skipSegments: ['use_cases'] },
      {
        billing: {
          use_cases: {
            charge_action: 'billing/use_cases/charge_action.ts',
          },
        },
      }
    )

    assert.match(output, /Billing: \{/)
    assert.match(output, /Charge: loader/)
    assert.notMatch(output, /UseCases: \{/)
  })
})
