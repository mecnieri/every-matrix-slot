const assets = {
  spritesheet: 'assets/spritesheet.json',
}

export function customLoader(onAssetsLoaded) {
  for (let key in assets) {
    PIXI.Assets.add(key, assets[key])
  }
  const keys = Object.keys(assets)
  PIXI.Assets.load(keys).then(onAssetsLoaded)
  
  // if you want to show the loading progress
  // PIXI.Assets.load(keys, p => console.log(p.toFixed(2) * 100 + "%")).then(onAssetsLoaded)
}
