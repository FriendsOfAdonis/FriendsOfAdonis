import SignInPage from '#osmos/pages/signin_page'
import SignUpPage from '#osmos/pages/signup_page'

export default class AuthController {
  signin() {
    return <SignInPage />
  }

  signup() {
    return <SignUpPage />
  }
}
