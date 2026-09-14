Install and configure the @foadonis/sentinel package in this AdonisJS application.

Read the documentation first and follow it over your own assumptions:

- <https://friendsofadonis.com/docs/sentinel/getting-started.md>

Before writing any code, study how this project is organized and follow its conventions rather than the defaults of the documentation: which model represents the users, how the existing authentication is set up and how migrations are managed. If anything is unclear, ask me before proceeding.

Then set the package up:

1. Install the package with "node ace add @foadonis/sentinel" if it is not installed yet. The command registers the provider, creates config/sentinel.ts and publishes the migrations.
2. Review the published migrations and run them: "sentinel_tokens" stores the magic link, OTP and password reset tokens, and "totp_authenticators" stores the enrolled authenticator apps.
3. Ask me which building blocks I want, magic links, one-time passwords, TOTP two-factor or password management, and compose their mixins into the users model as described in the documentation of each one:
   - <https://friendsofadonis.com/docs/sentinel/features/magic-link.md>
   - <https://friendsofadonis.com/docs/sentinel/features/otp.md>
   - <https://friendsofadonis.com/docs/sentinel/features/totp.md>
   - <https://friendsofadonis.com/docs/sentinel/features/password.md>

Stop there: do not build controllers, routes or emails until I ask for a specific flow. When I ask for one, fetch the workbook of that flow and follow it:

- Magic links: <https://friendsofadonis.com/workbooks/sentinel/setup-magic-link>
- One-time passwords: <https://friendsofadonis.com/workbooks/sentinel/setup-otp>
- Password reset: <https://friendsofadonis.com/workbooks/sentinel/setup-password>

When you are done, list the files you created or changed.
