import { map, lerp } from '../utils'
import * as PIXI from 'pixi.js'
import pictures from '../../pictures.js'
import './style.scss'


/*--------------------
Settings
--------------------*/
const settings = {
  cols: 5,
  rows: 6,
  gap: 20,
  width: 360,
  height: 560,
  background: '#ffffff'
}


/*------------------------------
Infinity Grid
------------------------------*/
const infinityGrid = () => {


  /*------------------------------
  Vars
  ------------------------------*/
  let bgX = 0
  let bgY = 0
  let mouseX = 0
  let mouseY = 0
  let finalTexture
  const $grid = document.getElementById('drag-grid')


  /*--------------------
  Setup
  --------------------*/
  const $texture = document.getElementById('texture')
  const ctx = $texture.getContext('2d')
  const win = {
    w: (settings.width + settings.gap) * settings.cols,
    h: (settings.height + settings.gap) * settings.rows
  }
  const devicePixelRatio = 1


  /*--------------------
  Resize
  --------------------*/
  const onResize = () => {
    $texture.width = win.w * devicePixelRatio
    $texture.height = win.h * devicePixelRatio
    $texture.style.width = `${win.w}px`
    $texture.style.height = `${win.h}px`
    ctx.scale(devicePixelRatio, devicePixelRatio)
  }
  onResize()

  
  /*--------------------
  Preload Images
  --------------------*/
  let loadedImages = 0
  const preloadImages = () => {
    const $images = document.getElementById('images')
    for (let i = 0; i < pictures.length; i++) {
      const img = document.createElement('img')
      img.setAttribute('crossorigin', 'anonymous')
      img.onload = () => {
        loadedImages++
        if (loadedImages === pictures.length) {
          createTexture()
        }
      }
      img.src = pictures[i]
      $images.appendChild(img)
    }
  }
  preloadImages()


  /*--------------------
  CreteTexture
  --------------------*/
  const createTexture = () => {
    ctx.fillStyle = settings.background
    ctx.rect(0, 0, win.w, win.h)
    ctx.fill()

    for (let i = 0; i < settings.rows; i++) {
      for (let j = 0; j < settings.cols; j++) {
        const index = j + i * settings.cols

        let x = (settings.gap / 2) + j * (settings.gap + settings.width)
        const y = (settings.gap / 2) + i * (settings.gap + settings.height)

        if (i % 2 === 1) {
          x += settings.width / 2
        }
        const width = settings.width
        const height = settings.height
        ctx.drawImage(document.querySelectorAll('img')[index], x, y, settings.width, settings.height)

        // Repeat last
        if (j === settings.cols - 1 && i % 2 === 1) {
          ctx.drawImage(document.querySelectorAll('img')[index], -settings.width / 2 - settings.gap / 2, y, settings.width, settings.height)
        }
      }
    }

    const w = (settings.width + settings.gap) * settings.cols
    const h = (settings.height + settings.gap) * settings.rows
    ctx.rect(0, 0, w, h)
    finalTexture = $texture.toDataURL('image/jpeg', 0.7)
    
    // Texture ready
    readyToGrid()
    $grid.style.backgroundImage = `url(${finalTexture})`
  }


  /*------------------------------
  Ready To Grid
  ------------------------------*/
  const readyToGrid = () => {
    requestAnimationFrame(readyToGrid)
    const x = map(mouseX, 0, window.innerWidth, 2, -2)
    const y = map(mouseY, 0, window.innerHeight, 2, -2)

    bgX = lerp(bgX, bgX + x, .8)
    bgY = lerp(bgY, bgY + y, .8)

    $grid.style.backgroundPosition = `${bgX}px ${bgY}px`
  }
  readyToGrid()



  /*------------------------------
  Ready To Webgl
  ------------------------------*/
  const readyToWebgl = () => {
    const $canvas = document.getElementById('canvas')
    const app = new PIXI.Application({
      autoResize: true,
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: devicePixelRatio,
      backgroundColor: 0xffffff
    })
    $canvas.appendChild(app.view)
    const stage = new PIXI.Container()
    const texture = PIXI.Texture.from(finalTexture)
    const tilingSprite = new PIXI.TilingSprite(texture, window.innerWidth, window.innerHeight)
    stage.addChild(tilingSprite)
    tilingSprite.tileScale.x = 2
    tilingSprite.tileScale.y = 2
  }


  /*------------------------------
  Mouse Move
  ------------------------------*/
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  })
}

export default infinityGrid