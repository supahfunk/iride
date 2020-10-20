/*--------------------
Utils
--------------------*/
export const mapRange = (a, b, c, d, e) => {
  return (a - b) * (e - d) / (c - b) + d
}
export const lerp = (v0, v1, t) => {
  return v0 * (1 - t) + v1 * t
}
export const random = (min, max) => min + Math.random() * (max - min)
export const sin = (t) => (Math.sin(t))
export const cos = (t) => (Math.cos(t))
export const PI = Math.PI
export const TAO = PI * 2