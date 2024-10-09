import { Container, Destroy, DiFrom, Inject, Lazy, DiRoot, Service } from "../src"

let id = 0

@Service()
class ChildValue {
  id = id++
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

const test = DiRoot().for(() => new Test())
test.destroy()