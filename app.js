import pictures from './pictures.js'
import './style.scss'

console.clear()

/*------------------------------
Map
------------------------------*/
const map = (from1, to1, from2, to2, v) => {
  return from2 + ((v - from1) * (to2 - from2)) / (to1 - from1);
}

const lerp = (start, end, t) => {
  return start * (1 - t) + end * t
}


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


let bgX = 0
let bgY = 0
let mouseX = 0
let mouseY = 0
let finalTexture
const $grid = document.getElementById('drag-grid')
window.addEventListener('mousemove', (e) => {
  mouseX = map(0, window.innerWidth, 10, -10, e.clientX)
  mouseY = map(0, window.innerHeight, 10, -10, e.clientY)
})

const animateBG = () => {
  requestAnimationFrame(animateBG)
  bgX += mouseX
  bgY += mouseY

  bgX = lerp(bgX, bgX + mouseX, .8)
  bgY = lerp(bgY, bgY + mouseY, .8)
  $grid.style.backgroundPosition = `${bgX}px ${bgY}px`
}
animateBG()


/*--------------------
Setup
--------------------*/
const canvas = document.getElementById('texture')
const ctx = canvas.getContext('2d')
const win = {
  w: (settings.width + settings.gap) * settings.cols,
  h: (settings.height + settings.gap) * settings.rows
}
const devicePixelRatio = 1


/*--------------------
Resize
--------------------*/
const onResize = () => {
  canvas.width = win.w * devicePixelRatio
  canvas.height = win.h * devicePixelRatio
  canvas.style.width = `${win.w}px`
  canvas.style.height = `${win.h}px`
  ctx.scale(devicePixelRatio, devicePixelRatio)
}
onResize()


/*--------------------
Draw
--------------------*/
const draw = () => {
  ctx.fillStyle = settings.background
  ctx.rect(0, 0, win.w, win.h)
  ctx.fill()

  ctx.strokeStyle = 'black'
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
      ctx.beginPath()
      ctx.strokeStyle = 'black'
      ctx.rect(x, y, width, height)
      // ctx.stroke()
      ctx.fillStyle = "black"
      ctx.textAlign = "center"
      ctx.font = "10px Arial"
      ctx.fillText(index, x + settings.width / 2, y + settings.height / 2 + 3)

      ctx.drawImage(document.querySelectorAll('img')[index], x, y, settings.width, settings.height)

      // Repeat last
      if (j === settings.cols - 1 && i % 2 === 1) {
        ctx.beginPath()
        // ctx.strokeStyle = 'red'
        ctx.rect(-settings.width / 2 - settings.gap / 2, y, width, height)
        ctx.drawImage(document.querySelectorAll('img')[index], -settings.width / 2 - settings.gap / 2, y, settings.width, settings.height)

        // ctx.stroke()
        ctx.fillStyle = "red"
        ctx.textAlign = "center"
        ctx.font = "10px Arial"
        // ctx.fillText(index, 10, y + settings.height / 2 + 3)
      }
    }
  }

  ctx.strokeStyle = 'blue'
  ctx.beginPath()
  const w = (settings.width + settings.gap) * settings.cols
  const h = (settings.height + settings.gap) * settings.rows
  ctx.rect(0, 0, w, h)
  // ctx.stroke()

  // Final Texture
  finalTexture = canvas.toDataURL('image/jpeg', 0.7)
  $grid.style.backgroundImage = `url(${finalTexture})`
}


/*--------------------
Preload Images
--------------------*/
let loaded = 0
const preloadImages = () => {
  const $images = document.getElementById('images')
  for (let i = 0; i < pictures.length; i++) {
    const img = document.createElement('img')
    img.setAttribute('crossorigin', 'anonymous')
    img.onload = () => {
      loaded++
      if (loaded === pictures.length) {
        draw()
      }
    }
    img.src = pictures[i]
    $images.appendChild(img)
  }
}
preloadImages()