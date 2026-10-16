/**
 * OpenTelemetry initialization file.
 *
 * IMPORTANT: This file must be imported FIRST in bin/server.ts
 * for auto-instrumentation to work correctly.
 */
import { init } from '@adonisjs/otel/init'

await init(import.meta.dirname)
