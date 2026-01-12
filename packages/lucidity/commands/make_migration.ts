import { type CommandOptions } from '@adonisjs/core/types/ace'
import BaseMakeMigration from '@adonisjs/lucid/commands/make_migration'
import { type Database } from '@adonisjs/lucid/database'
import { type LucidModel } from '@adonisjs/lucid/types/model'
import { globby } from 'globby'
import { ModelsIntrospector } from '../src/ddl/models_introspector.ts'
import { MigrationGenerator } from '../src/ddl/migration_generator.ts'
import { DatabaseIntrospector } from '../src/ddl/introspection/database_introspector.ts'
import { flags } from '@adonisjs/core/ace'
import { highlight } from 'cli-highlight'
import { analyseDatabaseDrift } from '../src/ddl/drift.ts'

export default class MakeMigration extends BaseMakeMigration {
  static commandName = 'make:migration'
  static description = 'Make a new migration file'

  static options: CommandOptions = {
    startApp: true,
    allowUnknownFlags: true,
  }

  @flags.boolean({ description: 'Print the resulted migration code', alias: 'dr' })
  declare dryRun: boolean

  async run(): Promise<any> {
    const db: Database = await this.app.container.make('lucid.db')
    this.connection = this.connection || db.primaryConnectionName

    const connection = db.getRawConnection(this.connection || db.primaryConnectionName)

    if (!connection) {
      this.logger.error(
        `"${connection}" is not a valid connection name. Double check "config/database" file`
      )
      this.exitCode = 1
      return
    }

    const models = await this.loadModels()

    const introspectors = {
      database: new DatabaseIntrospector(db),
      models: new ModelsIntrospector(models),
    }

    this.logger.info('Introspecting database for drift detection')
    const [databaseSchema, modelsSchema] = await Promise.all([
      introspectors.database.introspect(),
      introspectors.models.introspect(),
    ])

    const codemods = await this.createCodemods()
    const project = await codemods.getTsMorphProject()
    const filename = this.filename()
    const path = this.app.migrationsPath(this.filename())

    const drifts = analyseDatabaseDrift(databaseSchema, modelsSchema)

    if (!drifts) {
      this.logger.success('No drift detected between your models and your database!')
      return
    }

    const generator = new MigrationGenerator(databaseSchema, modelsSchema, drifts, project!, path)

    const migration = await generator.generate()

    if (!migration) {
      this.logger.success('No drift detected between your models and your database!')
      return
    }

    if (this.dryRun) {
      const output = migration.text()
      console.log(filename)
      console.log(highlight(output, { language: 'ts', ignoreIllegals: true }))
      return
    }

    await migration.save()
  }

  async loadModels(): Promise<LucidModel[]> {
    const models: LucidModel[] = []
    const paths = await globby(['.'], {
      cwd: this.app.modelsPath(),
      absolute: true,
      expandDirectories: {
        extensions: ['js', 'ts'],
      },
    })

    for (const path of paths) {
      const { default: Model } = await import(path)
      if (!Model) continue
      models.push(Model)
    }

    return models
  }

  filename() {
    const entity = this.app.generators.createEntity(this.name)
    const tableName = this.app.generators.tableName(entity.name)
    const prefix = new Date().getTime()
    return `${prefix}_${tableName}_table.ts`
  }
}
