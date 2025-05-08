import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#osmos/components/card'
import SignUpForm from '#osmos/components/forms/signup_form'
import { Component, Link } from '@foadonis/osmos'

export default class SignUpPage extends Component {
  render() {
    return (
      <main className="h-full flex justify-center items-center bg-muted">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome to Osmos</CardTitle>
            <CardDescription>You can access the demo using admin / password</CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/signin" className="underline underline-offset-4">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }
}
