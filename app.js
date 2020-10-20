import { random, sin, cos, TAO } from './js/utils'
import Canvas from './js/canvas'
import Sine from './js/sine'
import Star from './js/star'
import './style.scss'


/*--------------------
Init
--------------------*/
const canvas = new Canvas({
  id: 'canvas'
})
canvas.ctx.globalCompositeOperation = 'screen'

const lines = 300
for (let i = 0; i < lines; i++) {
  const sine = new Sine({
    ctx: canvas.ctx,
    from: { x: 0, y: 0 },
    to: { x: random(80, 200), y: 0 },
    t: { x: random(120, 200), y: 0 },
    h: random(-20, 20),
    rotation: TAO / lines * i,
    hue: Math.round(random(0, 20)),
    pointRadius: 1,
    offset: random(-1, 1),
    offsetRadius: random(-6, 6)
  })  
}

const innerLines = 100
for (let i = 0; i < innerLines; i++) {
  const sine = new Sine({
    ctx: canvas.ctx,
    from: { x: 0, y: 0 },
    to: { x: random(80, 100), y: 0 },
    t: { x: random(80, 100), y: 0 },
    h: random(-40, 40),
    rotation: TAO / innerLines * i,
    hue: Math.round(random(30, 50)),
    pointRadius: 1,
    offset: random(-1, 1),
    offsetRadius: random(-6, 6)
  })  
}

canvas.ctx.globalCompositeOperation = 'lighter'

const stars = 300
for (let i = 0; i < stars; i++) {
  const star = new Star({
    ctx: canvas.ctx,
  })  
}

