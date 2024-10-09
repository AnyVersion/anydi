import DiInjection from "../injection"
import DiInfo from "../info"
import DiToken from "../token"
import DiTrack from "../track"

export default class DiContainer {
  static Get(instance: any) {
    return DiInfo.GetContainer(instance)
  }
  static id = 0
  private dataMap = new WeakMap<DiToken, any>()
  private dataSet = new Set<any>()
  private resolvers = new WeakMap<DiToken, () => any>()

  private children = new Set<this>()
  private parent?: this

  id = DiContainer.id++

  constructor({ providers }: {
    providers?: {
      token: any
      resolver: () => any
    }[]
  } = {}) {
    providers?.forEach(item => {
      this.resolvers.set(DiToken.GetOrCreate(item.token), item.resolver)
    })
  }

  setParent(parent: this) {
    parent.children.add(this)
    this.parent = parent
  }

  getData(token: DiToken | any): any {
    if (!(token instanceof DiToken)) {
      token = DiToken.GetOrCreate(token)
    }
    if (this.dataMap.has(token)) {
      return this.dataMap.get(token)!
    } else {
      return this.parent?.getData(token)
    }
  }

  private resolve(token: DiToken): any {
    if (this.resolvers.has(token)) {
      return this.resolvers.get(token)!()
    }
    return this.parent?.resolve(token)
  }

  factory(injection: DiInjection) {
    const token = injection.getToken()
    const data = this.getData(token)
    if (data !== undefined) {
      return data
    }
    const value = this.track(() => this.resolve(token) || injection.factory())
    this.setData(token, value)
    return value
  }

  track<T>(fn: () => T) {
    try {
      DiTrack.push(this)
      return fn()
    } finally {
      DiTrack.pop()
    }
  }

  setData<T>(token: DiToken, data: T) {
    if (!this.dataMap.has(token)) {
      this.dataMap.set(token, data)
      this.addData(data)
    } else {
      if (this.dataMap.get(token) !== data) {
        throw new Error('Different values ​​in the container')
      }
    }
  }

  addData<T>(data: T) {
    this.dataSet.add(data)
    return data
  }

  private isDestroyed = false
  destroy() {
    if (this.isDestroyed) return
    this.isDestroyed = true
    this.children.forEach(container => {
      container.destroy()
    })
    this.dataSet.forEach(data => {
      DiInfo.Get(data)?.destroy()
    })
    this.dataSet.clear()
    this.dataSet = null!
    this.dataMap = null!
    this.parent = null!
    this.resolvers = null!
    this.children.clear()
  }
}