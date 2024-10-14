### AnyDI

## Install

```
$ npm install anydi --save
```

## Usage

```ts
import { Container, Destroy, Inject, Lazy, DiContainer, Service, Root, setConfig } from "../src"

setConfig({ defaultLazy: true })

@Service()
class ChildValue {
  static id = 0
  id = ChildValue.id++
  constructor() {
    console.log('Child value:', this.id)
  }

  @Destroy
  destroy() {
    console.log('Child value destroy:', this.id)
  }
}

@Service()
class Child {
  @Lazy() value!: ChildValue

  constructor() {
    console.log('Child init')
  }

  @Destroy
  destroy() {
    console.log('Child destroy')
  }
}

@Container()
@Service()
class Test2 {
  @Inject() child!: Child
}

@Service()
class Test3 {
  @Inject() value!: ChildValue
}

@Root()
@Service()
class Test {
  @Inject() private test2!: Test2
  @Inject() private test3!: Test3
  @Inject() private value!: ChildValue
  constructor() {
    console.log(this.test2.child.value.id)
    console.log(this.test3)
    console.log(this.value.id === this.test3.value.id, this.value.id !== this.test2.child.value.id)
  }

  @Destroy
  destroy() {
    console.log('Test destroy')
  }
}

const test = new Test
test.destroy()

// or without @Root

const test2 = new DiContainer().factory(Test) // or new DiContainer().track(() => new Test)
test2.destroy()
```

## changelog