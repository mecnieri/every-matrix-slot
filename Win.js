import { PubSub } from './PubSub.js'

export class Win {
  constructor(container) {
    this.winText = new PIXI.Text(`Win: 0`, style)
    this.winAmount = 0
    this.winText.position.set(20, 360)
    this.winText.visible = false
    container.addChild(this.winText)

    this.pubSub = new PubSub()
    this.pubSub.subscribe('increaseBalance', this.updateWin)
    this.pubSub.subscribe('spin', this.hideWin)
  }

  updateWin = win => {
    this.winAmount += win
    this.winText.visible = true
    this.winText.text = `Win: ${this.winAmount}`
  }

  hideWin = () => {
    this.winAmount = 0
    this.winText.visible = false
  }
}

const style = {
  fontFamily: 'Arial',
  fontSize: 24,
  fill: '0xfff',
}
