import User from '#models/user'

declare module '@adonisjs/core/types' {
  interface EventsList {
    'user:registered': User
  }
}
