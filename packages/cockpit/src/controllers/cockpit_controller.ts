import { jsx } from '@foadonis/spark/jsx-runtime'
import HomePage from '../components/pages/home_page.js'

export default class CockpitController {
  index() {
    return jsx(HomePage, {})
  }
}
