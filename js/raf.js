/*--------------------
Raf
--------------------*/
const LOOP = 5

export default class Raf {
  constructor() {
    this.raf()
  }
  
  raf() {
    if (this.onRaf) {
      window.requestAnimationFrame(() => {
        const o = {}
        o.time = window.performance.now() / 1000
        o.playhead = o.time % LOOP / LOOP
        this.raf()
        this.onRaf(o)
      })
    }
  }
}
