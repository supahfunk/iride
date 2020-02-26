import { map, lerp } from '../utils'
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
  let dragging = false
  let bgX = 0
  let bgY = 0
  let newBgX = 0
  let newBgY = 0
  let startX = 0
  let startY = 0
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

    // ReadyToWebgl
    readyToWebgl()
  }


  /*------------------------------
  Ready To Webgl
  ------------------------------*/
  const readyToWebgl = () => {
  }


  /*------------------------------
  Ready To Grid
  ------------------------------*/
  const readyToGrid = () => {
    requestAnimationFrame(readyToGrid)
    let friction = .11
    if (dragging) {
      friction = .23
    }
    newBgX = lerp(newBgX, bgX + mouseX, friction)
    newBgY = lerp(newBgY, bgY + mouseY, friction)
    $grid.style.backgroundPosition = `${newBgX}px ${newBgY}px`
  }


  /*------------------------------
  Mouse Move
  ------------------------------*/
  window.addEventListener('mousedown', (e) => {
    mouseX = 0
    mouseY = 0
    startX = e.clientX
    startY = e.clientY
    bgX = newBgX
    bgY = newBgY
    dragging = true
    document.body.classList.add('dragging')
  })
  window.addEventListener('mousemove', (e) => {
    if (dragging) {
      mouseX = (e.clientX - startX)
      mouseY = (e.clientY - startY)
    }
  })
  window.addEventListener('mouseup', () => {
    dragging = false
    document.body.classList.remove('dragging')
  })
}

export default infinityGrid