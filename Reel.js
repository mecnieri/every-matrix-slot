import config from './config.json' with { type: 'json' }
import { PubSub } from './PubSub.js'

export class Reel {
  constructor(x, container) {
    this.textures = PIXI.Assets.get('spritesheet').textures

    this.lowestSymbolIndex = 0
    this.needsCheck = 0
    this.isRunning = false
    this.isFastSpinning = false
    this.symbolsOrder = []
    this.symbolsOrderIndex = 4

    this.winnerSymbolsFrames = []
    this.symbolsOnBoard = []
    this.symbolsContainer = new PIXI.Container()

    this.handleSymbolsOrder()
    this.createReelContainer(x)
    this.createMask(x)
    this.createWinnerSymbolsFrames()
    this.createInitSymbols()
    this.container.addChild(this.symbolsContainer)

    container.addChild(this.container)

    this.pubSub = new PubSub()
    this.pubSub.subscribe('spin', this.spin)
  }

  spin = () => {
    if (this.isRunning) {
      this.isFastSpinning = true
      this.animation.kill()
      this.animation = gsap.to(this.symbolsContainer, {
        y: config.symbolHeight * (this.needsCheck + 3),
        duration: 0.3,
        onUpdate: this.onUpdate,
        onComplete: this.onComplete,
      })
      return
    }

    this.isRunning = true
    this.symbolsOnBoard = []
    this.winnerSymbolsFrames.forEach(frame => (frame.visible = false))

    this.animation = gsap.to(this.symbolsContainer, {
      y: config.symbolHeight * 16,
      duration: 3,
      onUpdate: this.onUpdate,
      onComplete: this.onComplete,
    })
  }

  onUpdate = () => {
    if (
      Math.floor(this.symbolsContainer.y / config.symbolHeight) !==
      this.needsCheck
    ) {
      this.needsCheck++
      const lowestSymbol =
        this.symbolsContainer.children[this.lowestSymbolIndex]
      lowestSymbol.y -= config.symbolHeight * 4
      lowestSymbol.texture =
        this.textures[this.symbolsOrder[this.symbolsOrderIndex]]
      this.symbolsOrderIndex++
      if (this.symbolsOrderIndex > this.symbolsOrder.length - 1)
        this.symbolsOrderIndex = 0
      this.lowestSymbolIndex++
      if (this.lowestSymbolIndex > 3) this.lowestSymbolIndex = 0
    }
  }

  onComplete = () => {
    this.isRunning = false
    this.isFastSpinning = false
    this.needsCheck = 0
    this.symbolsContainer.y = 0
    for (let index = 0; index < 4; index++) {
      this.symbolsContainer.children[this.lowestSymbolIndex].y =
        config.symbolHeight * (3 - index)

      this.symbolsOnBoard.push(
        this.symbolsContainer.children[this.lowestSymbolIndex].texture
          .textureCacheIds[0],
      )

      this.lowestSymbolIndex++
      if (this.lowestSymbolIndex > 3) this.lowestSymbolIndex = 0
    }
    this.checkWin()
    this.pubSub.publish('reelStopped')
  }

  createInitSymbols() {
    for (let index = 0; index < 4; index++) {
      const symbol = PIXI.Sprite.from(this.textures[this.symbolsOrder[index]])
      symbol.x = (config.reelWidth - config.symbolWidth) / 2
      symbol.y = config.symbolHeight * (3 - index)
      symbol.width = config.symbolWidth
      symbol.height = config.symbolHeight
      this.symbolsContainer.addChild(symbol)
    }
  }

  createMask() {
    const mask = new PIXI.Graphics()
    mask.beginFill(0x000000)
    mask.drawRect(
      0,
      config.symbolHeight + config.reelBorder,
      config.reelWidth + config.reelBorder * 2,
      config.reelHeight - config.reelBorder * 2,
    )
    mask.endFill()
    this.container.addChild(mask)
    this.symbolsContainer.mask = mask
  }

  handleSymbolsOrder() {
    this.symbolsOrder = config.reel.split(',').map(el => el + '.png')
  }

  createReelContainer(x) {
    this.container = new PIXI.Container()
    this.container.x = x
    this.container.y = config.containerOffset

    const background = PIXI.Sprite.from(this.textures['REEL.png'])
    background.y = config.symbolHeight
    background.width = config.reelWidth
    background.height = config.reelHeight
    this.container.addChild(background)
  }

  createWinnerSymbolsFrames() {
    for (let index = 0; index < 3; index++) {
      let winFrame = PIXI.Sprite.from(this.textures['WIN_BG.png'])
      winFrame.x = (config.reelWidth - config.symbolWidth) / 2
      winFrame.width = config.winFrame
      winFrame.height = config.winFrame
      winFrame.visible = false
      winFrame.y =
        config.symbolHeight * (3 - index) +
        (config.reelWidth - config.symbolWidth) / 2
      this.winnerSymbolsFrames.push(winFrame)
      this.container.addChild(winFrame)
    }
  }

  checkWin() {
    let win = 0
    let match = 0
    if (this.symbolsOnBoard[0] === this.symbolsOnBoard[1]) {
      this.winnerSymbolsFrames[0].visible = true
      this.winnerSymbolsFrames[1].visible = true
      match++
    }
    if (this.symbolsOnBoard[1] === this.symbolsOnBoard[2]) {
      this.winnerSymbolsFrames[1].visible = true
      this.winnerSymbolsFrames[2].visible = true
      match++
    }
    if (this.symbolsOnBoard[0] === this.symbolsOnBoard[2]) {
      this.winnerSymbolsFrames[0].visible = true
      this.winnerSymbolsFrames[2].visible = true
      match++
    }
    if (match === 1) win = 2
    if (match === 3) win = 3
    if (win > 0) this.pubSub.publish('increaseBalance', win)
  }
}
