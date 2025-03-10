import { createApp, customLoader } from './utils/index.js'
import { Balance } from './Balance.js'
import { Button } from './Button.js'
import { PubSub } from './PubSub.js'
import { Reel } from './Reel.js'
import { Win } from './Win.js'

window.addEventListener('load', initGame)

function initGame() {
  const game = new Game()
}

class Game {
  constructor() {
    this.app = createApp()
    customLoader(this.onAssetsLoaded)
    this.pubSub = new PubSub()
    this.pubSub.subscribe('placeBet', this.placeBet)
    this.pubSub.subscribe('reelStopped', this.reelStopped)
  }

  onAssetsLoaded = () => {
    for (let index = 0; index < 1; index++) {
      this.reel = new Reel(108 * index, this.app.stage)
    }
    this.button = new Button(this.app.stage)
    this.balance = new Balance(this.app.stage)
    this.win = new Win(this.app.stage)
  }

  placeBet = () => {
    if (this.reel.isFastSpinning) return
    if (this.reel.isRunning) return this.pubSub.publish('spin')
    if (this.balance.balance === 0) return
    this.pubSub.publish('spin')
    this.balance.decreaseBalance()
  }
  reelStopped = () => {
    if (this.balance.balance === 0) return this.button.disable()
  }
}
