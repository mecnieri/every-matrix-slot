import { PubSub } from './PubSub.js'
export class Button {
  constructor(container) {
    this.textures = PIXI.Assets.get('spritesheet').textures
    this.button = PIXI.Sprite.from(this.textures['PLAY.png'])
    this.button.x = 220
    this.button.y = 310
    this.button.width = 100
    this.button.height = 100
    this.button.buttonMode = true
    this.button.interactive = true
    this.button.hitArea = new PIXI.Circle(185 / 2, 185 / 2, 170 / 2)
    this.button.cursor = 'pointer'

    this.pubSub = new PubSub()

    this.button.on('pointerdown', () => {
      this.pubSub.publish('placeBet')
    })

    this.pubSub.subscribe('disableButton', this.disable)

    container.addChild(this.button)
  }

  disable = () => {
    this.button.interactive = false
    this.button.texture = this.textures['PLAY_DISABLED.png']
  }
}
