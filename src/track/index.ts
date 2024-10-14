import DiContainer from "../container"

export default class DiTrack {
  static data: DiContainer[] = []
  static push(container: DiContainer) {
    this.data.push(container)
  }
  static pop() {
    return this.data.pop()
  }
  static take(): DiContainer | undefined {
    return this.data[this.data.length - 1]
  }
}