import SignInPage from '#spark/pages/signin_page'
import SignUpPage from '#spark/pages/signup_page'

export default class AuthController {
  signin() {
    return <SignInPage />
  }

  signup() {
    return <SignUpPage />
  }
}
