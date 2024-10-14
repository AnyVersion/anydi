import "reflect-metadata"
import { Constructor, isConstructor } from "../utils"
import DiToken from "../token"

type value = any
type options = ({
  ref: () => value
} | {
  token: value
}) & {
  resolver?: () => value
  optional?: boolean
  lazy?: boolean
}

export default class DiInjection {
  optional: boolean
  lazy: boolean
  constructor(private options: options) {
    this.optional = options.optional === true
    this.lazy = options.lazy === true
  }

  private token?: DiToken
  getToken() {
    if (!this.token) {
      this.token = DiToken.GetOrCreate(
        'ref' in this.options ? this.options.ref() : this.options.token
      )
    }
    return this.token
  }

  factory() {
    if ('resolver' in this.options && this.options.resolver) {
      return this.options.resolver()
    }
    let Ctor: Constructor | undefined
    if ('ref' in this.options) {
      Ctor = this.options.ref()
    } else {
      if (isConstructor(this.options.token)) {
        Ctor = this.options.token
      }
    }
    if (Ctor) {
      return new Ctor
    }
    console.log(this.options)
    throw new Error('Injection does not have Resolver')
  }
}
