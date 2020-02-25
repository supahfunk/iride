/*------------------------------
Map
------------------------------*/
export const map = (v, from1, to1, from2, to2) => {
  return (v - from1) * (to2 - from2) / (to1 - from1) + from2
}

/*------------------------------
Lerp
------------------------------*/
export const lerp = (start, end, t) => {
  return start * (1 - t) + end * t
}