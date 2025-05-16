import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#spark/components/card'
import SignInForm from '#spark/components/forms/signin_form'
import { Component, Link } from '@foadonis/spark'

export default class SignInPage extends Component {
  render() {
    return (
      <main className="h-full flex justify-center items-center bg-muted">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription>You can access the demo using admin / password</CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm />
            <div className="mt-4 text-center text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="underline underline-offset-4">
                Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }
}
