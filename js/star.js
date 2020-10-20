import {random, sin, cos, lerp, TAO, PI} from './utils'
import Raf from './raf'


/*--------------------
Star
--------------------*/
export default class Star extends Raf {
  constructor(obj) {
    super()
    Object.assign(this, obj)
    this.draw()

    this.x = random(0, window.innerWidth)
    this.y = random(0, window.innerHeight)
    this.radius = random(.1, 1)
    this.alpha = random(0.1, .8)
    this.hue = random(0, 30)
    this.dirX = random(-.5, .5)
    this.dirY = random(-.5, .5)
  }

  bounds() {
    if (this.x > window.innerWidth) this.x = 0
    if (this.y > window.innerHeight) this.y = 0
    if (this.x < 0) this.x = window.innerWidth
    if (this.y < 0) this.y = window.innerHeight
  }
  
  draw(time) {
    this.x += this.dirX
    this.y += this.dirY

    this.bounds()

    this.ctx.beginPath()
    this.ctx.fillStyle = `hsl(${this.hue}, 60%, 70%, ${sin(this.alpha * 10 + time)})`
    this.ctx.arc(this.x, this.y, this.radius, 0, TAO)
    this.ctx.fill()
  }
  
  onRaf({time}) {
    this.draw(time)
  }  
}
