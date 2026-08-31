Set up passwordless sign-in with one-time password codes in this AdonisJS application, using the @foadonis/sentinel package.

Read the documentation first and follow it over your own assumptions:

- <https://friendsofadonis.com/docs/sentinel/getting-started.md>
- <https://friendsofadonis.com/docs/sentinel/features/otp.md>

Before writing any code, study how this project is organized and follow its conventions rather than the defaults of the documentation: where the request handling logic lives (controllers, actions, services), how input is validated, how responses are produced (server-rendered pages, JSON API, Inertia), which auth guard is in use (session, access tokens), how emails are sent and templated, and how errors are handled. If anything is unclear, such as which model represents the users or where the frontend lives, ask me before proceeding.

Then implement the flow:

1. Install the package with "node ace add @foadonis/sentinel" if it is not installed yet, and add the migration of the "sentinel_tokens" table.
2. Compose the "withOTP" mixin from "@foadonis/sentinel/services/otp" into the users model.
3. Add an endpoint that finds the user by email, generates a code with "generateOTP" and emails it, responding the same way whether or not the user exists, and remembers the address for the verification step, in the session for example.
4. Add the pages of the flow: a form asking for the address, unless a page of the project already collects it, and a form where the user types the code they received.
5. Add an endpoint that finds the user back from the remembered address, verifies the code with "User.verifyOTP", authenticates the user with the guard of the project and responds the way the project does after a login. Respond to an unknown or missing address the same way as to a wrong code.
6. Handle the E_INVALID_TOKEN and E_TOO_MANY_ATTEMPTS exceptions from "@foadonis/sentinel/errors" the way the project handles authentication errors, with a distinct message when the code was locked after too many wrong attempts.

Do not change the existing login flow without asking me first. When you are done, list the files you created or changed and explain how to test the flow.
