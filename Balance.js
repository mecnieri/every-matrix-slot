import { PubSub } from './PubSub.js'

export class Balance {
  constructor(container) {
    this.balance = 100
    this.balanceText = new PIXI.Text(`Balance: $${this.balance}`, style)
    this.balanceText.position.set(20, 320)
    container.addChild(this.balanceText)

    this.pubSub = new PubSub()
    this.pubSub.subscribe('decreaseBalance', this.decreaseBalance)
    this.pubSub.subscribe('increaseBalance', this.increaseBalance)
  }

  decreaseBalance = () => {
    this.balance -= 1
    this.updateBalance()
  }
  
  increaseBalance = win => {
    this.balance += win
    this.updateBalance()
  }

  updateBalance = () => {
    this.balanceText.text = `Balance: $${this.balance}`
  }
}

const style = {
  fontFamily: 'Arial',
  fontSize: 24,
  fill: '0xfff',
}
