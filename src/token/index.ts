type value = any
export default class DiToken {
  private static map = new Map<value, DiToken>()
  static GetOrCreate(value: value) {
    if (value === Object || value === undefined) {
      value = Symbol('anonymous')
    }
    if (this.map.has(value)) {
      return this.map.get(value)!
    } else {
      const token = new this(value)
      this.map.set(value, token)
      return token
    }
  }
  private constructor(public value: value) { }
}