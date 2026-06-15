import { Accordion, Accordions } from 'fumadocs-ui/components/accordion'
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'
import { Heading } from 'fumadocs-ui/components/heading'
import { Step, Steps } from 'fumadocs-ui/components/steps'

export type AssemblerHook = {
  readonly hook: string
  readonly import: string
}

export type PackageJsonImport = {
  readonly alias: string
  readonly path: string
}

export type ConfigurationSteps = {
  readonly assemblerHooks?: AssemblerHook[]
  readonly commands?: boolean
  readonly config?: string
  readonly packageJsonImports?: PackageJsonImport[]
  readonly pkg: string
  readonly providers?: string[]
}

export const ConfigurationSteps = ({
  pkg,
  providers,
  commands = false,
  config,
  assemblerHooks,
  packageJsonImports,
}: ConfigurationSteps) => (
  <Accordions type="single">
    <Accordion title="See steps performed by this command">
      <Steps>
        <Step>
          <Heading as="h4">Installs {pkg}</Heading>
          <p>
            Installs the <code>{pkg}</code> package using the detected package manager.
          </p>
        </Step>
        {providers && (
          <Step>
            <Heading as="h4">Registers providers</Heading>
            <p>
              Registers the following service providers inside the <code>adonisrc.ts</code> file
            </p>
            <DynamicCodeBlock
              code={`{
  providers: [
    // ...other providers
    ${providers.map((provider) => `() => import("${pkg}/providers/${provider}")`).join(',\n')}
  ]
}`}
              lang="ts"
            />
          </Step>
        )}
        {commands && (
          <Step>
            <Heading as="h4">Registers commands</Heading>
            <p>
              Registers the following commands inside the <code>adonisrc.ts</code> file
            </p>
            <DynamicCodeBlock
              code={`{
  commands: [
    // ...other commands
    () => import("${pkg}/commands")
  ]
}`}
              lang="ts"
            />
          </Step>
        )}
        {config && (
          <Step>
            <Heading as="h4">Generates configuration</Heading>
            <p>
              A configuration file <code>config/{config}.ts</code> is generated containing the
              default configuration.
            </p>
          </Step>
        )}
        {assemblerHooks && assemblerHooks.length > 0 && (
          <Step>
            <Heading as="h4">Registers assembler hooks</Heading>
            <p>
              Registers the following assembler hooks inside the <code>adonisrc.ts</code> file
            </p>
            <DynamicCodeBlock
              code={`import { defineConfig } from '@adonisjs/core/app'
${assemblerHooks.map((hook) => `import { ${hook.import} } from '${pkg}'`).join('\n')}

export default defineConfig({
  // ...other config
  hooks: {
    init: [
      ${assemblerHooks.map((hook) => hook.hook).join(',\n      ')}
    ],
  },
})`}
              lang="ts"
            />
          </Step>
        )}
        {packageJsonImports && packageJsonImports.length > 0 && (
          <Step>
            <Heading as="h4">Updates package.json imports</Heading>
            <p>
              Adds the following import aliases to your <code>package.json</code> file
            </p>
            <DynamicCodeBlock
              code={`{
  "imports": {
    ${packageJsonImports.map((imp) => `"${imp.alias}": "${imp.path}"`).join(',\n    ')}
  }
}`}
              lang="json"
            />
          </Step>
        )}
      </Steps>
    </Accordion>
  </Accordions>
)
