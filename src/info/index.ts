import DiContainer from "../container"
import DiInjection from "../injection"
import DiMetadata from "../metedata"
import DiTrack from "../track"
import { getPrototypeChain } from "../utils"

type Data = any

export default class DiInfo {
  static data = new WeakMap<Data, DiInfo>()
  static Get(ins: Data) {
    return this.data.get(ins)
  }
  static GetOrCreate(ins: Data) {
    if (this.data.has(ins)) {
      return this.data.get(ins)!
    } else {
      const info = new this(ins)
      this.data.set(ins, info)
      return info
    }
  }
  static Delete(ins: Data) {
    this.data.delete(ins)
  }
  static GetContainer(ins: Data) {
    return this.Get(ins)?.container
  }
  private container
  private injections = new Map<string, DiInjection>()
  private destroyCallbacks: Function[]
  constructor(private ins: Data) {
    const container = DiTrack.take()
    if (!container) {
      throw new Error(`'${ins.constructor.name}' must be created with container`)
    }
    const prototypes = getPrototypeChain(ins)
    const isService = DiMetadata.isService(prototypes)
    if (!isService) {
      throw new Error(`'${ins.constructor.name}' must be decorated with @Service()`)
    }
    const containerOptions = DiMetadata.getContainerOptions(prototypes)
    if (containerOptions) {
      this.container = new DiContainer(...containerOptions)
      this.container.setParent(container)
    } else {
      this.container = container
    }
    this.destroyCallbacks = DiMetadata.getDestroyCallbacks(prototypes)
    DiMetadata.getInjections(prototypes).forEach(({ key, injection }) => {
      if (!this.injections.has(key)) {
        this.injections.set(key, injection)
      }
    })
  }

  private isInitialized = false
  init() {
    if (this.isInitialized) return
    this.isInitialized = true
    this.injections.forEach((injection, key) => {
      if (!Object.getOwnPropertyDescriptor(this.ins, key)) {
        if (injection.optional) {
          Object.defineProperty(this.ins, key, {
            get: () => this.getData(key),
            enumerable: true,
            configurable: true
          })
        } else if (injection.lazy) {
          Object.defineProperty(this.ins, key, {
            get: () => this.getData(key),
            set: (value) => {
              Object.defineProperty(this.ins, key, {
                value,
                enumerable: true,
                configurable: true
              })
            },
            enumerable: true,
            configurable: true
          })
        } else {
          this.ins[key] = this.getData(key)
        }
      }
    })
  }

  track<T>(fn: () => T) {
    return this.container.track(fn)
  }

  getData(key: string) {
    const injection = this.injections.get(key)
    if (!injection) {
      throw new Error('Injection not found')
    }
    const token = injection.getToken()
    if (injection.optional) {
      return this.container.getData(token)
    }
    return this.container.track(() => this.container.factory(injection))
  }

  private isDestroyed = false
  destroy() {
    if (this.isDestroyed) return
    this.isDestroyed = true
    this.destroyCallbacks.forEach(callback => callback.call(this.ins))
    DiInfo.Delete(this.ins)
    this.ins = null!
    this.injections.clear()
    this.container.destroy()
    this.container = null!
  }
}