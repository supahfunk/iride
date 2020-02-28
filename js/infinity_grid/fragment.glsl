precision highp float;
uniform float uTime;
uniform float uRatioX;
uniform float uRatioY;
uniform float uOffsetX;
uniform float uOffsetY;
uniform float uDisplacement;
uniform sampler2D uMap;
varying vec2 vUv;

/*------------------------------
Barrel Distortion function
------------------------------*/
vec2 barrelDistort(vec2 pos, float power){
  float t = atan(pos.y, pos.x);
  float r = pow(length(pos), power);
  pos.x   = r * cos(t);
  pos.y   = r * sin(t);
  return 0.5 * (pos + 1.0);
}


/*------------------------------
Scale
------------------------------*/
mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}


void main() {
  vec2 uv = vUv;

  // Dezoom al click
  uv -= vec2(0.5);
  uv *= 1. + uDisplacement * 0.18;
  uv += vec2(0.5);
  
  // Effetto Fisheye
  float intensity = 0.05;
  vec2 fisheye  = -1.0 + 2.0 * uv;
  float d = length(fisheye) * 2.;
  fisheye = barrelDistort(fisheye, 1. - d * uDisplacement * intensity);

  // Ripristino zoom
  uv *= .005;

  // Aggiunto fisheye
  uv += fisheye;

  // Correggo ratio
  uv.x /= uRatioX;
  uv.y /= uRatioY;
  
  // Muovo offset
  uv.x -= uOffsetX;
  uv.y += uOffsetY;
  
  // Imposto testure
  vec3 tex = texture2D(uMap, uv).rgb;

  // Renderizzo
  gl_FragColor.rgb = tex;
  gl_FragColor.a = 1.0;
}