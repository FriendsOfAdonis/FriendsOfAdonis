Set up password reset in this AdonisJS application, using the @foadonis/sentinel package.

Read the documentation first and follow it over your own assumptions:

- <https://friendsofadonis.com/docs/sentinel/getting-started.md>
- <https://friendsofadonis.com/docs/sentinel/features/password.md>

Before writing any code, study how this project is organized and follow its conventions rather than the defaults of the documentation: where the request handling logic lives (controllers, actions, services), how input is validated, how responses are produced (server-rendered pages, JSON API, Inertia), which auth guard is in use (session, access tokens), how emails are sent and templated, and how errors are handled. If anything is unclear, such as which model represents the users, what URL the reset link should point to, or where the frontend lives, ask me before proceeding.

Then implement the flow:

1. Install the package with "node ace add @foadonis/sentinel" if it is not installed yet, and add the migration of the "sentinel_tokens" table.
2. Compose the "withPassword" mixin from "@foadonis/sentinel/services/password" into the users model. If the model composes "withAuthFinder" from "@adonisjs/auth", remove it: "withPassword" is a drop-in replacement, and composing both would hash the passwords twice.
3. Add an endpoint that finds the user by email, generates a token with "generatePasswordResetToken" and emails it as a link to the reset form, responding the same way whether or not the user exists.
4. Add the page rendering the reset form, holding the token from the query string in a hidden field. Do not verify the token when rendering the page, verification consumes it.
5. Add an endpoint that validates the new password the way the project validates forms, hands the token and the password to "User.resetPassword", authenticates the user with the guard of the project and responds the way the project does after a login.
6. Handle the E_INVALID_TOKEN exception from "@foadonis/sentinel/errors" the way the project handles authentication errors.

Do not change the existing login flow without asking me first. When you are done, list the files you created or changed and explain how to test the flow.
