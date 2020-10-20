import {sin, cos, lerp, TAO} from './utils'
import Raf from './raf'


/*------------------------------
Easing
------------------------------*/
const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

/*--------------------
Sine
--------------------*/
export default class Sine extends Raf {
  constructor(obj) {
    super()
    Object.assign(this, obj)
    this.draw()
  }
  
  draw(playhead, time) {
    const movement = sin(time + this.offset) * this.offsetRadius
    // this.height = this.h + easeInOutCubic(movement * 0.3)
    // this.to.x = this.t.x + easeInOutCubic(movement * 0.3)
    this.height = this.h + movement * .3
    this.to.x = this.t.x + movement

    this.second = {
      x: lerp(this.from.x, this.to.x, .5),
      y: lerp(this.from.y, this.to.y, .5) + this.height
    }

    this.ctx.strokeStyle = `hsl(${this.hue}, 70%, 50%, .33)`
    this.ctx.save()
    this.ctx.translate(window.innerWidth / 2, window.innerHeight / 2)
    this.ctx.rotate(this.rotation)
    this.ctx.beginPath()
    this.ctx.moveTo(this.from.x, this.from.y)
    this.ctx.quadraticCurveTo(
      lerp(this.from.x, this.second.x, .33),
      lerp(this.from.y, this.second.y, 0),
      lerp(this.from.x, this.second.x, .5),
      lerp(this.from.y, this.second.y, .5)
    )
    this.ctx.quadraticCurveTo(
      lerp(this.from.x, this.second.x, .66),
      lerp(this.from.y, this.second.y, 1),
      this.second.x,
      this.second.y
    )
    this.ctx.quadraticCurveTo(
      lerp(this.second.x, this.to.x, .33),
      lerp(this.second.y, this.to.y, 0),
      lerp(this.second.x, this.to.x, .5),
      lerp(this.second.y, this.to.y, .5)
    )
    this.ctx.quadraticCurveTo(
      lerp(this.second.x, this.to.x, .66),
      lerp(this.second.y, this.to.y, 1),
      this.to.x,
      this.to.y
    )
    this.ctx.stroke()
    
    this.ctx.beginPath()
    this.ctx.fillStyle = `hsl(${this.hue}, 60%, 70%, .8)`
    this.ctx.arc(this.to.x - this.pointRadius / 2, this.to.y - this.pointRadius / 2, this.pointRadius, 0, TAO)
    this.ctx.fill()
    
    this.ctx.restore()
  }
  
  onRaf({playhead, time}) {
    this.draw(playhead, time)
  }  
}
