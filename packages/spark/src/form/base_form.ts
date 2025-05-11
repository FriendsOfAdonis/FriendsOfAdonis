import { VineValidator } from '@vinejs/vine'
import type { Infer, InferInput } from '@vinejs/vine/types'
import { Synthetizable } from '../contracts/synthetizable.js'

export type FormInstance<TObject extends Object> = {
  validate(): Promise<TObject>
  error(key: keyof TObject): ValidationError | undefined
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
> implements Synthetizable
{
  $validator: TValidator

  $errors: ValidationError[] = []
  $initial: Infer<TValidator> = {}
  $raw: InferInput<TValidator> = {}
  $data?: Infer<TValidator>

  constructor(schema: TValidator, initialValues?: InferInput<TValidator>) {
    this.$validator = schema
    this.$initial = initialValues
    this.$raw = initialValues
  }

  /**
   * Validates the form using the provided validator.
   */
  async validate(): Promise<Infer<TValidator>> {
    const [error, data] = await this.$validator.tryValidate(this.$raw)

    if (error) {
      this.$errors = error.messages
      return
    }

    this.$data = data
    return data
  }

  /**
   * Resets the form with initial values.
   */
  reset() {
    this.$raw = this.$initial
    this.$data = undefined
  }

  synthetize(): Record<string, any> {
    return this.$raw || this.$initial || {}
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
      return target[key]
    }

    if (target.$raw[key]) {
      return target.$raw[key]
    }

    if (target.$initial) {
      return target.$initial[key]
    }

    return undefined
  },
  set(target: any, key: string | symbol, value: any) {
    if (typeof key === 'symbol' || key.startsWith('$')) {
      target[key] = value
      return true
    }

    target.$raw[key] = value
    return true
  },
}
