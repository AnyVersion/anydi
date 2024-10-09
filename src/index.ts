import DiContainer from "./container"
import DiInjection from "./injection"
import DiInfo from "./info"
import DiMetadata from "./metedata"
import { AllConstructors } from "./utils"

export function Inject(token?: any) {
  return function <T extends Object>(prototype: T, key: string) {
    return DiMetadata.defineInjection(prototype, key, new DiInjection({
      token: token || Reflect.getMetadata('design:type', prototype, key)
    }))
  }
}

export function InjectRef(ref: () => any) {
  return function <T extends Object>(prototype: T, key: string) {
    return DiMetadata.defineInjection(prototype, key, new DiInjection({
      ref
    }))
  }
}

export function Optional({ token, ref }: {
  token?: any
  ref?: () => any
} = {}) {
  return function <T extends Object>(prototype: T, key: string) {
    return DiMetadata.defineInjection(prototype, key, new DiInjection(ref ? {
      ref,
      optional: true
    } : {
      token: token || Reflect.getMetadata('design:type', prototype, key),
      optional: true
    }))
  }
}

export function Lazy({ token, ref }: {
  token?: any
  ref?: () => any
} = {}) {
  return function <T extends Object>(prototype: T, key: string) {
    return DiMetadata.defineInjection(prototype, key, new DiInjection(ref ? {
      ref,
      lazy: true
    } : {
      token: token || Reflect.getMetadata('design:type', prototype, key),
      lazy: true
    }))
  }
}

export function Service() {
  return function <T extends AllConstructors>(target: T) {
    class Service extends target {
      constructor(...args: any[]) {
        super(...args)
        DiInfo.GetOrCreate(this).init()
      }
    }
    DiMetadata.defineService(Service.prototype)
    Object.defineProperty(Service, 'name', { value: target.name + '@Service' })
    return Service
  }
}

export function Container(...args: ConstructorParameters<typeof DiContainer>) {
  return function <T extends AllConstructors>(target: T) {
    DiMetadata.defineContainerOptions(target.prototype, args)
    return target
  }
}

export function Destroy<T extends Object>(prototype: T, propertyKey: string, descriptor: PropertyDescriptor) {
  DiMetadata.defineDestroyCallback(prototype, descriptor.value)
  descriptor.value = function () {
    DiInfo.Get(this)?.destroy()
  }
}

export function DiFrom(instance: any) {
  return {
    for: <T>(fn: () => T) => DiInfo.GetOrCreate(instance).track(fn)
  }
}

export function DiRoot(...args: ConstructorParameters<typeof DiContainer>) {
  return {
    for: <T>(fn: () => T) => new DiContainer(...args).track(fn)
  }
}

export {
  DiContainer,
  DiInjection,
  DiInfo,
  DiMetadata
}