import Raf from './raf'


/*--------------------
Canvas
--------------------*/
export default class Canvas extends Raf {
  constructor(obj) {
    super()
    this.canvas = document.getElementById(obj.id)
    this.resize()
    this.events()
  }
  
  resize() {
    this.dpr = window.devicePixelRatio
    this.canvas.style.width = `${window.innerWidth}px`
    this.canvas.style.height = `${window.innerHeight}px`
    this.canvas.width = window.innerWidth * this.dpr
    this.canvas.height = window.innerHeight * this.dpr
    this.ctx = this.canvas.getContext('2d')
    this.ctx.scale(this.dpr, this.dpr)
  }
  
  events() {
    window.addEventListener('resize', this.resize)
  }
  
  clear() {
    this.ctx.clearRect(0, 0, window.innerWidth * this.dpr, window.innerHeight * this.dpr)
  }
  
  onRaf() {
    this.clear()
  }
}

