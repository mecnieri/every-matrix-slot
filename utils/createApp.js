export const createApp = (width = 540, height = 420) => {
  const app = new PIXI.Application({
    width,
    height,
    antialias: true,
    resolution: window.devicePixelRatio,
    autoDensity: true,
    backgroundAlpha: 0,
  })

  function resize() {
    if (window.innerWidth < width || window.innerHeight < height) {
      const scale = Math.min(
        window.innerWidth / width,
        window.innerHeight / height,
      )
      app.renderer.resize(width * scale, height * scale)
      app.stage.scale.set(scale)
      return
    }
    app.renderer.resize(width, height)
    app.stage.scale.set(1)
  }
  resize()

  window.addEventListener('resize', resize)

  root.appendChild(app.view)
  return app
}
