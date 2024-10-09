import 'reflect-metadata'
import DiContainer from "../container"
import DiInjection from '../injection'
import DiInfo from '../info'

const symbol = {
  container: Symbol('container'),
  injection: Symbol('injection'),
  service: Symbol('service'),
  destroy: Symbol('destroy')
}
type ContainerOptions = ConstructorParameters<typeof DiContainer>

export default class DiMetadata {
  static defineContainerOptions(prototype: Object, options: ContainerOptions) {
    Reflect.defineMetadata(symbol.container, options, prototype)
  }
  static getContainerOptions(prototype: Object | Object[]) {
    const properties = Array.isArray(prototype) ? prototype : [prototype]
    for (const property of properties) {
      const options: ContainerOptions = Reflect.getOwnMetadata(symbol.container, property)
      if (options) {
        return options
      }
    }
  }
  static defineService(prototype: Object) {
    Reflect.defineMetadata(symbol.service, true, prototype)
  }

  static isService(prototype: Object | Object[]) {
    const properties = Array.isArray(prototype) ? prototype : [prototype]
    return properties.some(property => Reflect.getOwnMetadata(symbol.service, property) === true)
  }

  static defineInjection(prototype: Object, key: string, injection: DiInjection) {
    const injections: {
      key: string
      injection: DiInjection
    }[] = Reflect.getOwnMetadata(symbol.injection, prototype) || []
    injections.push({ key, injection })
    Reflect.defineMetadata(symbol.injection, injections, prototype)
    Object.defineProperty(prototype, key, {
      enumerable: true,
      configurable: true,
      get() {
        return this[key] = DiInfo.GetOrCreate(this).getData(key)
      },
      set(value) {
        Object.defineProperty(this, key, {
          value,
          writable: true,
          configurable: true,
          enumerable: true
        })
      },
    })
  }
  static getInjections(prototype: Object | Object[]) {
    const properties = Array.isArray(prototype) ? prototype : [prototype]
    const injections: {
      key: string
      injection: DiInjection
    }[] = []
    for (const property of properties) {
      const propertyInjections: {
        key: string
        injection: DiInjection
      }[] = Reflect.getOwnMetadata(symbol.injection, property) || []
      injections.push(...propertyInjections)
    }
    return injections
  }

  static defineDestroyCallback(prototype: Object, callback: Function) {
    const callbacks: Function[] = Reflect.getOwnMetadata(symbol.destroy, prototype) || []
    callbacks.push(callback)
    Reflect.defineMetadata(symbol.destroy, callbacks, prototype)
  }

  static getDestroyCallbacks(prototype: Object | Object[]) {
    const properties = Array.isArray(prototype) ? prototype : [prototype]
    const callbacks: Function[] = []
    for (const property of properties) {
      const propertyCallbacks: Function[] = Reflect.getOwnMetadata(symbol.destroy, property) || []
      callbacks.push(...propertyCallbacks)
    }
    return callbacks
  }
}