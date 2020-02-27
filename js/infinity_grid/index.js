import {Renderer, Program, Color, Mesh, Triangle, Texture} from 'ogl'
import { map, lerp } from '../utils'
import pictures from '../../pictures.js'
import './style.scss'


/*--------------------
Settings
--------------------*/
const settings = {
  cols: 6,
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
  let newBgX = 1
  let newBgY = 1
  let startX = 0
  let startY = 0
  let mouseX = 0
  let mouseY = 0
  let finalTexture
  let finalTextureWidth
  let finalTextureHeight
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
    ctx.strokeStyle = 'rgba(255, 0, 0, .2)'
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
        
        if (document.querySelectorAll('img')[index]) {
          ctx.drawImage(document.querySelectorAll('img')[index], x, y, settings.width, settings.height)
        } else {
          ctx.beginPath()
          ctx.rect(x, y, settings.width, settings.height)
          ctx.stroke()
          ctx.fillStyle = 'rgba(255, 0, 0, .4)'
          ctx.textAlign = 'center'
          ctx.font = '20px Arial'
          ctx.fillText(index, x + settings.width / 2, y + settings.height / 2 + 3)
        }

        // Repeat last
        if (j === settings.cols - 1 && i % 2 === 1) {
          if (document.querySelectorAll('img')[index]) {
            ctx.drawImage(document.querySelectorAll('img')[index], -settings.width / 2 - settings.gap / 2, y, settings.width, settings.height)
          } else {
            ctx.beginPath()
            ctx.rect(-settings.width / 2 - settings.gap / 2, y, settings.width, settings.height)
            ctx.stroke()
          }

        }
      }
    }

    finalTextureWidth = (settings.width + settings.gap) * settings.cols
    finalTextureHeight = (settings.height + settings.gap) * settings.rows
    ctx.rect(0, 0, finalTextureWidth, finalTextureHeight)
    finalTexture = $texture.toDataURL('image/jpeg', 0.7)

    
    // Texture ready
    // readyToGrid()
    // $grid.style.backgroundImage = `url(${finalTexture})`
    
    // ReadyToWebgl
    readyToWebgl()
  }
  
  
  /*------------------------------
  Ready To Webgl
  ------------------------------*/
  const readyToWebgl = () => {
    const vertex = `
    attribute vec2 uv;
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0, 1);
    }
    `
    
    const fragment = `
    precision highp float;
    uniform float uTime;
    uniform float uRatioX;
    uniform float uRatioY;
    uniform float uOffsetX;
    uniform float uOffsetY;
    uniform vec3 uColor;
    uniform sampler2D uMap;
    
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv;
      
      uv.x *= 1. / uRatioX;
      uv.y *= 1. / uRatioY;

      uv.x -= uOffsetX;
      uv.y += uOffsetY;
      
      vec3 tex = texture2D(uMap, uv).rgb;
      
      gl_FragColor.rgb = tex;
      gl_FragColor.a = 1.0;
    }
    `
    
    const renderer = new Renderer()
    const gl = renderer.gl
    document.querySelector('#canvas').appendChild(gl.canvas)
    
    gl.clearColor(1, 1, 1, 1)
    
    // Texture
    const texture = new Texture(gl)
    const img = new Image()
    img.src = finalTexture
    img.onload = () => texture.image = img
    texture.width = finalTextureWidth
    texture.height = finalTextureHeight
    texture.wrapS = 'REPEAT'
    texture.wrapT = 'REPEAT'

    //         position                uv
    //      (-1, 3)                  (0, 2)
    //         |\                      |\
    //         |__\(1, 1)              |__\(1, 1)
    //         |__|_\                  |__|_\
    //   (-1, -1)   (3, -1)        (0, 0)   (2, 0)

    const geometry = new Triangle(gl)

    const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
            uTime: {value: 0},
            uRatioX: {value: finalTextureWidth / window.innerWidth},
            uRatioY: {value: finalTextureHeight / window.innerHeight},
            uOffsetX: {value: 1.},
            uOffsetY: {value: 1.},
            uColor: {value: new Color(0.3, 0.2, 0.5)},
            uMap: {value: texture},
        },
    })

    const mesh = new Mesh(gl, {geometry, program})

    requestAnimationFrame(update)
    function update(t) {
        requestAnimationFrame(update)

        const friction = dragging ? .23 : .11
        newBgX = lerp(newBgX, bgX + mouseX, friction)
        newBgY = lerp(newBgY, bgY + mouseY, friction)

        program.uniforms.uTime.value = t * 0.001
        
        program.uniforms.uOffsetX.value = (newBgX / window.innerHeight) * .5
        program.uniforms.uOffsetY.value = (newBgY / window.innerHeight) * .5
        
        renderer.render({scene: mesh})
    }

    function resize() {
      renderer.setSize(window.innerWidth, window.innerHeight)
      program.uniforms.uRatioX.value = finalTextureWidth / window.innerWidth
      program.uniforms.uRatioY.value = finalTextureHeight / window.innerHeight
    }
    window.addEventListener('resize', resize, false)
    resize()
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