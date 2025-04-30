import { VineValidator } from '@vinejs/vine'
import { Infer, InferInput } from '@vinejs/vine/types'
import { ref } from '../ref.js'

export type FormNormalized<T extends Object> = {
  [key in keyof T]: T[key]
}

export type FormInstance<T extends Object> = {
  [key in keyof T]: T[key]
}

export interface FormClass<T extends Object> {
  new (...args: any[]): FormInstance<T>
}

export function BaseForm<TValidator extends VineValidator<any, any>>(schema: TValidator) {
  return class BaseFormImpl {
    validator = schema

    $initial?: InferInput<TValidator>
    $raw?: InferInput<TValidator>
    $data?: Infer<TValidator>

    constructor(initialValues?: InferInput<TValidator>) {
      this.$initial = initialValues
      return propertyAccessProxy(this) as unknown
    }

    $boot() {}

    async validate(): Promise<TValidator> {
      const data = await this.validator.validate(this.$raw)
      this.$data = data
      return data
    }

    reset() {
      this.$raw = undefined
      this.$data = undefined
    }
  } as unknown as FormClass<Infer<TValidator>>
}

function propertyAccessProxy(target: Object) {
  return new Proxy(target, {
    get(t, p, r) {
      if (typeof p === 'symbol') throw new Error('Cannot be used with symbol')

      return ref(p, t.$initial[p])
    },
  })
}
