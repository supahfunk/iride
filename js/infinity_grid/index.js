import {Renderer, Program, Mesh, Triangle, Texture} from 'ogl'
import gsap from 'gsap'
import { lerp } from '../utils'
import pictures from '../../pictures.js'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
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
export default function() {


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
  let dragFriction = 1
  let finalTexture
  let finalTextureWidth
  let finalTextureHeight
  const displacement = {
    value: 0
  }
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

    
    /*------------------------------
    Render CSS or WEBGL
    ------------------------------*/
    if (window.innerWidth < 768) {
      $grid.style.backgroundImage = `url(${finalTexture})`
      readyToCSS()
    } else {
      readyToWebgl()
    }
  }
  
  
  /*------------------------------
  Ready To Webgl
  ------------------------------*/
  const readyToWebgl = () => {
    const renderer = new Renderer({
      antialias: true,
      canvas: document.querySelector('#canvas canvas')
    })
    const gl = renderer.gl
    
    gl.clearColor(1, 1, 1, 1)
    
    // Texture
    const texture = new Texture(gl)
    const img = new Image()
    img.src = finalTexture
    img.onload = () => texture.image = img
    texture.width = finalTextureWidth
    texture.height = finalTextureHeight
    texture.wrapS = gl.REPEAT
    texture.wrapT = gl.REPEAT
    texture.minFilter = gl.LINEAR

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
            uRatioX: {value: texture.width / window.innerWidth},
            uRatioY: {value: texture.height / window.innerHeight},
            uOffsetX: {value: 1.},
            uOffsetY: {value: 1.},
            uDisplacement: {value: displacement.value},
            uMap: {value: texture},
        },
    })

    const mesh = new Mesh(gl, {geometry, program})

    requestAnimationFrame(update)
    function update(t) {
        requestAnimationFrame(update)
        
        const friction = dragging ? .23 : .11
        newBgX = lerp(newBgX, bgX + mouseX * dragFriction, friction)
        newBgY = lerp(newBgY, bgY + mouseY * dragFriction, friction)

        program.uniforms.uTime.value = t * 0.001
        
        program.uniforms.uOffsetX.value = (newBgX / window.innerHeight) * .5
        program.uniforms.uOffsetY.value = (newBgY / window.innerHeight) * .5
        program.uniforms.uDisplacement.value = displacement.value

        renderer.render({scene: mesh})
    }

    function resize() {
      renderer.setSize(window.innerWidth, window.innerHeight)
      program.uniforms.uRatioX.value = texture.width / window.innerWidth
      program.uniforms.uRatioY.value = texture.height / window.innerHeight
    }
    window.addEventListener('resize', resize, false)
    resize()
  }


  /*------------------------------
  Ready To Grid
  ------------------------------*/
  const readyToCSS = () => {
    requestAnimationFrame(readyToCSS)
    let friction = .11
    if (dragging) {
      friction = .23
    }
    newBgX = lerp(newBgX, bgX + mouseX * dragFriction, friction)
    newBgY = lerp(newBgY, bgY + mouseY * dragFriction, friction)
    $grid.style.backgroundPosition = `${newBgX}px ${newBgY}px`
  }


  /*------------------------------
  Mouse Down
  ------------------------------*/
  const handleMouseDown = (e) => {
    mouseX = 0
    mouseY = 0
    startX = e.clientX || e.touches[0].clientX
    startY = e.clientY || e.touches[0].clientY
    bgX = newBgX
    bgY = newBgY
    dragging = true
    document.body.classList.add('dragging')
    dragFriction = 1

    gsap.killTweensOf(displacement)
    gsap.to(displacement, {
      value: 1,
      duration: .4,
      ease: 'power3.out'
    })
  }
  window.addEventListener('mousedown', (e) => {
    if (e.button === 2) return
    handleMouseDown(e)
  })
  window.addEventListener('touchstart', (e) => {
    handleMouseDown(e)
    e.preventDefault()
    e.stopPropagation()
  })


  /*------------------------------
  Mouse Move
  ------------------------------*/
  const handleMouseMove = (e) => {
    if (dragging) {
      const x = e.clientX || e.touches[0].clientX
      const y = e.clientY || e.touches[0].clientY
      e.preventDefault()
      mouseX = (x - startX)
      mouseY = (y - startY)
    }
  }
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('touchmove', handleMouseMove)


  /*------------------------------
  Mouse Up
  ------------------------------*/
  const handleMouseUp = () => {
    dragging = false
    dragFriction = 1.4
    document.body.classList.remove('dragging')
    gsap.killTweensOf(displacement)
    gsap.to(displacement, {
      value: 0,
      duration: .4,
      ease: 'power4.out'
    })
  }
  window.addEventListener('mouseup', handleMouseUp)
  window.addEventListener('mouseleave', handleMouseUp)
  window.addEventListener('touchend', handleMouseUp)
} 