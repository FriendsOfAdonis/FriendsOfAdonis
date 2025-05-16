import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#spark/components/card'
import SignUpForm from '#spark/components/forms/signup_form'
import { Component, Link } from '@foadonis/spark'

export default class SignUpPage extends Component {
  render() {
    return (
      <main className="h-full flex justify-center items-center bg-muted">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome to Spark</CardTitle>
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
