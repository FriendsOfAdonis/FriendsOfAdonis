import { type CommandOptions } from '@adonisjs/core/types/ace'
import BaseMakeMigration from '@adonisjs/lucid/commands/make_migration'
import { type Database } from '@adonisjs/lucid/database'
import { type LucidModel } from '@adonisjs/lucid/types/model'
import { globby } from 'globby'
import { ModelsIntrospector } from '../src/ddl/models_introspector.ts'
import { MigrationGenerator } from '../src/ddl/migration_generator.ts'
import { DatabaseIntrospector } from '../src/ddl/introspection/database_introspector.ts'
import { flags } from '@adonisjs/core/ace'
import { analyseDatabaseDrift } from '../src/ddl/drift.ts'
import { prettyPrintDrift } from '../src/utils.ts'

export default class MakeMigration extends BaseMakeMigration {
  static commandName = 'make:migration'
  static description = 'Make a new migration file'

  static options: CommandOptions = {
    startApp: true,
    allowUnknownFlags: true,
  }

  @flags.boolean({ description: 'Print the resulted migration code', alias: 'dr' })
  declare dryRun: boolean

  @flags.boolean({ description: 'Skip drift detection and generate empty migraiton', alias: 'e' })
  declare empty: boolean

  async run() {
    if (this.empty) return this.runEmpty()
    else return this.runNonEmpty()
  }

  async runEmpty() {}

  async runNonEmpty(): Promise<any> {
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

    this.logger.info('Introspecting database for drift detection...')
    const [databaseSchema, modelsSchema] = await Promise.all([
      introspectors.database.introspect(),
      introspectors.models.introspect(),
    ])

    const codemods = await this.createCodemods()
    const project = await codemods.getTsMorphProject()
    const path = this.app.migrationsPath(this.filename())

    const drifts = analyseDatabaseDrift(databaseSchema, modelsSchema)

    if (!drifts) {
      this.logger.success('No drift detected between your models and your database!')
      return
    }

    prettyPrintDrift(this.ui, drifts)

    if (this.dryRun) {
      return
    }

    const generator = new MigrationGenerator(drifts, project!, path)

    const migration = await generator.generate()

    await migration.save()
  }

  async loadModels(): Promise<LucidModel[]> {
    const models: LucidModel[] = []

    const paths = await globby([this.app.rcFile.directories.models], {
      cwd: this.app.appRoot,
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
