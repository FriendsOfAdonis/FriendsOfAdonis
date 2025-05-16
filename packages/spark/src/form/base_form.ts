import { errors, VineValidator } from '@vinejs/vine'
import type { Infer, InferInput } from '@vinejs/vine/types'
import { Synthetizable } from '../contracts/synthetizable.js'

export type FormInstance<TObject extends Object> = {
  validate(): Promise<TObject>

  error(key: keyof TObject): ValidationError | undefined

  reset(): void

  isDirty(): boolean
}

export type FormNormalized<T extends Object> = {
  [key in keyof T]: T[key]
} & FormInstance<T>

type ValidationError = {
  message: string
  rule: string
  field: string
  meta?: Record<string, any>
}

class FormImpl<
    TValidator extends VineValidator<any, any>,
    TObject extends object = InferInput<TValidator>,
  >
  implements Synthetizable, FormInstance<TObject>
{
  $validator: TValidator

  $errors: ValidationError[] = []
  $initial: Infer<TValidator> = {}

  $dirty: InferInput<TValidator> = {}
  $data?: Infer<TValidator>

  constructor(schema: TValidator, initialValues?: InferInput<TValidator>) {
    this.$validator = schema
    this.$initial = initialValues
  }

  /**
   * Validates the form using the provided validator.
   */
  async validate(): Promise<Infer<TValidator>> {
    try {
      const data = await this.$validator.validate(this.$dirty)
      this.$dirty = {}
      this.$data = data
      return data
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        this.$errors = error.messages
      }

      throw error
    }
  }

  /**
   * Resets the form with initial values.
   */
  reset() {
    this.$dirty = {}
    this.$data = undefined
  }

  synthetize(): Record<string, any> {
    return this.$dirty || this.$initial || {}
  }

  /**
   * Gets a form validation error.
   * Must call `validate()` first.
   */
  error(field: keyof TObject): ValidationError | undefined {
    return this.$errors.find((error) => {
      return error.field === field
    })
  }

  /**
   * Returns if the form is dirty.
   *
   * TODO: Currently this is more a `isTouched`. Instead we should compare values to initialValues.
   */
  isDirty(): boolean {
    return Object.keys(this.$dirty).length > 0
  }

  /**
   * Returns if the form has been touched.
   */
  isTouched(): boolean {
    return Object.keys(this.$dirty).length > 0
  }
}

export function Form<TValidator extends VineValidator<any, any>>(
  schema: TValidator,
  initialValues?: InferInput<TValidator>
) {
  const form = new FormImpl(schema, initialValues)

  return new Proxy(form, proxyHandler) as FormNormalized<InferInput<TValidator>>
}

const proxyHandler = {
  get(target: any, key: string | symbol) {
    if (typeof key === 'symbol' || target[key]) {
      return Reflect.get(target, key)
    }

    if (target.$data) {
      return Reflect.get(target.$data, key)
    }

    if (target.$dirty[key]) {
      return Reflect.get(target.$dirty, key)
    }

    if (target.$initial) {
      return Reflect.get(target.$initial, key)
    }

    return undefined
  },
  set(target: any, key: string | symbol, value: any) {
    if (typeof key === 'symbol' || key.startsWith('$')) {
      return Reflect.set(target, key, value)
    }

    return Reflect.set(target.$dirty, key, value)
  },
}
