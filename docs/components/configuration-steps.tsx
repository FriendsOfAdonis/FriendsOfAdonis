import { Accordion, Accordions } from 'fumadocs-ui/components/accordion'
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'
import { Heading } from 'fumadocs-ui/components/heading'
import { Step, Steps } from 'fumadocs-ui/components/steps'

export type ConfigurationSteps = {
  readonly commands?: boolean
  readonly config?: string
  readonly pkg: string
  readonly providers?: string[]
}

export const ConfigurationSteps = ({
  pkg,
  providers,
  commands = false,
  config,
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
      </Steps>
    </Accordion>
  </Accordions>
)
