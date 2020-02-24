import pictures from './pictures.js'
import './style.scss'

console.clear()
/*--------------------
Settings
--------------------*/
const settings = {
  cols: 7,
  rows: 5,
  gap: 20,
  width: 360,
  height: 560,
  background: '#ffffff'
}


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
Listeners
--------------------*/
window.addEventListener('resize', onResize)


/*--------------------
Draw
--------------------*/
let finalTexture = null 
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
  ctx.rect(0, 0, (settings.width + settings.gap) * settings.cols, (settings.height + settings.gap) * settings.rows)
  // ctx.stroke()

  // Final Texture
  finalTexture = canvas.toDataURL('image/jpeg', 0.7)
  const img = document.createElement('img')
  img.src = finalTexture
  document.body.appendChild(img)
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