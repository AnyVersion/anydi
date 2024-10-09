export function getPrototypeChain(prototype: Object) {
  const chain = []
  let proto = prototype
  while (proto) {
    if (proto === Object.prototype) {
      break
    }
    chain.push(proto)
    proto = Object.getPrototypeOf(proto)
  }
  return chain
}

export type Constructor = new (...args: any[]) => any
export type AbstractConstructor<T = any> = abstract new (...args: any[]) => T
export type AllConstructors = Constructor | AbstractConstructor

export function isConstructor(value: unknown): value is Constructor {
  return typeof value === 'function' && value !== Object
}