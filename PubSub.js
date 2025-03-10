export class PubSub {
  static events = {}

  subscribe(eventName, callback) {
    if (!this.constructor.events[eventName]) {
      this.constructor.events[eventName] = []
    }
    this.constructor.events[eventName].push(callback)
  }

  publish(event, data) {
    if (!this.constructor.events[event]) return

    this.constructor.events[event].forEach(callback => {
      callback(data)
    })
  }
}
