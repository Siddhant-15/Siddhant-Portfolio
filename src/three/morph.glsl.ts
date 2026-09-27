import { NOISE } from "./noise.glsl";

/**
 * MorphField — one GPU particle system, nine procedural formations.
 * Every particle carries a random seed; targets are computed in the vertex
 * shader, so re-forming between sections costs no CPU and no buffer uploads.
 */
export const morphVertex = /* glsl */ `
uniform float uTime, uStage, uPR, uSize, uVel, uPulse, uMenu, uBelt, uContact, uProjZ, uHover, uOpacity, uPortrait, uMouseOn;
uniform vec2 uMouse, uHalf;
attribute vec4 aSeed;
varying float vAlpha;
varying float vAccent;

const float PI = 3.14159265;
const float TAU = 6.28318530718;
float gAccent = 0.0;

${NOISE}

// 0 — HERO: a tilted signal sheet that ripples around the cursor + suspended data motes
vec3 tHero(vec4 s, float t){
  if (s.w < 0.6) {
    vec2 g = (s.xy - 0.5) * vec2(uHalf.x * 2.1, uHalf.y * 2.7);
    float w = sin(g.x*0.45 + t*0.5)*0.55 + sin(g.y*0.6 - t*0.4)*0.4 + snoise(vec3(g*0.22, t*0.08))*1.4;
    float d = length(g - vec2(uMouse.x, uMouse.y * 1.7));
    w += sin(d*3.2 - t*3.0) * exp(-d*0.5) * 0.9 * uMouseOn;
    vec3 p = rotX(vec3(g, w), -0.95);
    p.y -= 0.5; p.z -= 2.0;
    return p;
  }
  vec3 p = (s.xyz - 0.5) * vec3(uHalf.x*2.0, uHalf.y*2.0, 9.0);
  p += vec3(snoise(p*0.2 + vec3(0.,0.,t*0.06)), snoise(p*0.2 + vec3(9.,3.,t*0.06)), snoise(p*0.2 + vec3(4.,8.,t*0.06))) * 1.4;
  return p;
}

// 1 — ABOUT: everything expands outward into a wide, breathing halo (centre left clear for type)
vec3 tAbout(vec4 s, float t){
  float a = s.x*TAU + t*0.03;
  float r = 0.34 + pow(s.y, 0.7) * 0.66;
  return vec3(cos(a)*r*uHalf.x*1.1, sin(a)*r*uHalf.y*1.1, (s.z-0.5)*7.0);
}

vec3 nodeCenter(float k){
  if (uPortrait > 0.5) return vec3((mod(k,2.0)-0.5)*uHalf.x*1.0, (0.5 - floor(k/2.0))*uHalf.y*0.9 + uHalf.y*0.05, 0.0);
  return vec3((k-1.5)*uHalf.x*0.5, uHalf.y*0.22, 0.0);
}

// 2 — PHILOSOPHY: four dense nodes joined by drifting filaments
vec3 tPhilo(vec4 s, float t){
  float k = floor(s.w*4.0);
  vec3 c = nodeCenter(k);
  float hv = abs(uHover - k) < 0.5 ? 1.0 : 0.0;
  if (s.z > 0.88 && k < 3.0) {
    vec3 c2 = nodeCenter(k + 1.0);
    vec3 p = mix(c, c2, s.y);
    p.y += sin(s.y*PI) * 0.35 * sin(t*0.6 + k);
    gAccent = hv * 0.6;
    return p + (s.xyz - 0.5) * 0.06;
  }
  float th = s.y*TAU;
  float ph = acos(1.0 - 2.0*fract(s.z*7.13 + s.x*3.7));
  vec3 d = vec3(sin(ph)*cos(th), sin(ph)*sin(th), cos(ph));
  d = rotY(d, t*(0.25 + s.x*0.4) + k);
  float R = pow(s.x, 0.55) * (uPortrait > 0.5 ? 0.62 : 0.9) * (1.0 + hv*0.6);
  gAccent = hv;
  return c + d * R;
}

// 3 — EXPERIENCE: a flowing vertical timeline ribbon with data drifting off it
vec3 tExp(vec4 s, float t){
  float x0 = -uHalf.x * (uPortrait > 0.5 ? 0.8 : 0.72);
  float y = (fract(s.y + t*0.02) - 0.5) * uHalf.y * 2.6;
  float sway = sin(y*0.6 + t*0.5)*0.12 + snoise(vec3(s.x*3.0, y*0.3, t*0.1))*0.1;
  vec3 p = vec3(x0 + sway + (s.x-0.5)*0.35, y, (s.z-0.5)*0.6);
  float branch = step(0.86, s.w);
  p.x += branch * s.z * s.z * uHalf.x * 0.9 * (0.5 + 0.5*sin(t*0.3 + s.x*6.0));
  return p;
}

// 4 — SKILLS: an orbital universe — core plus three tilted, counter-rotating shells
vec3 tSkills(vec4 s, float t){
  vec3 c = uPortrait > 0.5 ? vec3(0.0, uHalf.y*0.3, 0.0) : vec3(uHalf.x*0.36, 0.0, 0.0);
  float sc = uPortrait > 0.5 ? 0.6 : 1.0;
  if (s.z > 0.9) {
    float th = s.x*TAU, ph = acos(1.0 - 2.0*s.y);
    return c + vec3(sin(ph)*cos(th), sin(ph)*sin(th), cos(ph)) * 0.8 * sc * pow(s.w, 0.5);
  }
  float ring = floor(s.w*3.0);
  float R = (1.9 + ring*1.2) * sc;
  float dir = ring == 1.0 ? -1.0 : 1.0;
  float a = s.x*TAU + t*(0.34 - ring*0.08)*dir;
  vec3 p = vec3(cos(a)*R, 0.0, sin(a)*R) + (s.yzx - 0.5) * 0.22;
  p = rotX(p, 1.15 - ring*0.55);
  p = rotZ(p, 0.25 + ring*0.2);
  return c + p;
}

// 5 — TECH BELT: a wide band whose rotation is driven by scroll velocity
vec3 tTech(vec4 s, float t){
  float a = s.x*TAU + uBelt;
  float R = uHalf.x * (uPortrait > 0.5 ? 1.4 : 0.78);
  vec3 p = vec3(cos(a)*R, (s.y-0.5)*1.2 + sin(a*3.0 + t)*0.15, sin(a)*R*0.42);
  p = rotX(p, 0.22); p = rotZ(p, -0.07);
  p.z -= 2.0;
  return p;
}

// 6 — PROJECTS: a depth tunnel; particles stream toward the camera as you scroll
vec3 tProj(vec4 s, float t){
  float a = s.x*TAU;
  float r = 3.0 + pow(s.y, 0.8) * uHalf.x * 1.2;
  float z = mod(s.z*32.0 + uProjZ, 32.0) - 24.0;
  return vec3(cos(a)*r, sin(a)*r*0.62, z);
}

// 7 — INTELLIGENCE: distant ambient scatter (the words are drawn by the second system)
vec3 tIntel(vec4 s, float t){
  vec3 p = (s.xyz - 0.5) * vec3(uHalf.x*2.6, uHalf.y*2.6, 14.0);
  p += vec3(snoise(p*0.15 + t*0.05), snoise(p*0.15 + 7.0 + t*0.05), snoise(p*0.15 + 13.0)) * 2.0;
  return p;
}

// 8 — CONTACT: particles settle into a calm, sparse ambient field — a soft
// backdrop for the CSS glow and closing statement, not a jarring collapse.
vec3 tContact(vec4 s, float t){
  vec3 base = (s.xyz - 0.5) * vec3(uHalf.x*2.4, uHalf.y*2.0, 9.0);
  base.x += snoise(base*0.1 + t*0.035) * 1.6;
  base.y += snoise(base*0.1 + 11.0 + t*0.03) * 1.2;
  base.z += snoise(base*0.1 + 23.0) * 1.4;
  float e = clamp(uContact, 0.0, 1.0);
  float centerPull = 1.0 - exp(-dot(base.xy, base.xy) * 0.01);
  base *= mix(1.0, 0.5 + 0.5*centerPull, e); // thin out near the centre so the headline stays legible
  gAccent = 0.05 * e;
  return base;
}

vec3 target(int k, vec4 s, float t){
  if (k == 0) return tHero(s, t);
  if (k == 1) return tAbout(s, t);
  if (k == 2) return tPhilo(s, t);
  if (k == 3) return tExp(s, t);
  if (k == 4) return tSkills(s, t);
  if (k == 5) return tTech(s, t);
  if (k == 6) return tProj(s, t);
  if (k == 7) return tIntel(s, t);
  return tContact(s, t);
}

void main(){
  vec4 s = aSeed;
  float t = uTime;
  float st = clamp(uStage, 0.0, 8.0);
  float kf = floor(st);
  float f = st - kf;
  if (kf >= 8.0) { kf = 7.0; f = 1.0; }
  int k0 = int(kf);

  gAccent = 0.0; vec3 a = target(k0, s, t);     float accA = gAccent;
  gAccent = 0.0; vec3 b = target(k0 + 1, s, t); float accB = gAccent;

  // particles leave and arrive at different moments, so the field visibly re-forms
  float lag = s.x * 0.45;
  float m = smoothstep(lag, lag + 0.55, f);
  vec3 p = mix(a, b, m);
  float sw = sin(m * PI);
  p += vec3(snoise(vec3(s.yz*3.0, t*0.3)), snoise(vec3(s.zx*3.0 + 4.0, t*0.3)), snoise(vec3(s.xy*3.0 + 8.0, t*0.3))) * sw * 2.2;
  float acc = mix(accA, accB, m);

  // scroll velocity stretches the field vertically
  p.y += uVel * (s.z - 0.5) * 3.0;
  // mobile menu swirl
  p = rotZ(p, uMenu * 0.5 * (0.3 + s.x));
  // click / hover pulse travels outward from the centre
  p += normalize(p + vec3(0.0001)) * sin(length(p)*2.0 - uTime*8.0) * uPulse * 0.35;

  // cursor: repel + glow
  vec2 dm = p.xy - uMouse;
  float d = length(dm);
  float infl = exp(-(d*d)/(2.6*2.6)) * uMouseOn;
  p.xy += normalize(dm + vec2(0.0001)) * infl * 1.3;
  p.z += infl * 0.8;
  acc = max(acc, infl);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = -mv.z;
  float size = uSize * (0.55 + s.z*0.9) * (1.0 + acc*0.8 + uPulse*0.3);
  gl_PointSize = min(size * uPR * (12.0 / max(depth, 0.5)), 46.0 * uPR);
  float tw = 0.65 + 0.35 * sin(t*(0.6 + s.w*1.4) + s.x*TAU);
  vAlpha = uOpacity * tw * smoothstep(0.5, 3.0, depth) * (1.0 - smoothstep(20.0, 34.0, depth)) * (0.45 + 0.55*s.y);
  vAccent = clamp(acc + abs(uVel)*0.6 + uPulse*0.4, 0.0, 1.0);
}
`;

export const pointFragment = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uAccent;
varying float vAlpha;
varying float vAccent;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float core = smoothstep(0.5, 0.0, d);
  float a = pow(core, 1.6) * vAlpha;
  vec3 col = mix(uColor, uAccent, vAccent) * (1.0 + vAccent*0.6);
  gl_FragColor = vec4(col, a);
}
`;

/**
 * IntelligenceField — a second, independent system. Particles are baked to
 * sampled letterforms (4 words) and morph word → word, disperse, then
 * converge into a single point for the contact hand-off.
 */
export const intelVertex = /* glsl */ `
uniform float uTime, uWord, uForm, uDisp, uConv, uPR, uSize, uOpacity, uWidth, uMouseOn;
uniform vec2 uMouse;
attribute vec4 aSeed;
attribute vec3 aW0;
attribute vec3 aW1;
attribute vec3 aW2;
attribute vec3 aW3;
varying float vAlpha;
varying float vAccent;

const float PI = 3.14159265;
${NOISE}

vec3 pickWord(int i){
  if (i == 0) return aW0;
  if (i == 1) return aW1;
  if (i == 2) return aW2;
  return aW3;
}

void main(){
  vec4 s = aSeed;
  float t = uTime;
  float w = clamp(uWord, 0.0, 3.0);
  float kf = min(floor(w), 2.0);
  float f = w - kf;
  vec3 a = pickWord(int(kf));
  vec3 b = pickWord(int(kf) + 1);
  float m = smoothstep(s.x*0.5, s.x*0.5 + 0.5, f);
  vec3 p = mix(a, b, m);
  p.xy *= uWidth;
  p += vec3(snoise(vec3(s.yz*3.0, t*0.4)), snoise(vec3(s.zx*3.0 + 5.0, t*0.4)), snoise(vec3(s.xy*3.0 + 9.0, t*0.4))) * sin(m*PI) * 2.4;

  vec3 dir = normalize(s.xyz - 0.5 + vec3(0.001));
  vec3 scatter = dir * (8.0 + s.w*10.0);
  scatter.z -= 6.0;
  float fl = smoothstep(s.y*0.5, s.y*0.5 + 0.5, uForm);
  p = mix(scatter, p, fl);

  p += vec3(snoise(vec3(p.xy*0.8, t*0.3 + s.x*4.0)), snoise(vec3(p.yx*0.8 + 3.0, t*0.3 + s.y*4.0)), 0.0) * 0.07;
  p += dir * uDisp * (3.0 + s.w*7.0);

  float cl = smoothstep(s.z*0.4, s.z*0.4 + 0.6, uConv);
  p = mix(p, dir * 0.05, cl);

  vec2 dm = p.xy - uMouse;
  float d = length(dm);
  float infl = exp(-(d*d)/(1.8*1.8)) * uMouseOn * (1.0 - cl);
  p.xy += normalize(dm + vec2(0.0001)) * infl * 1.6;
  p.z += infl * 1.2;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = -mv.z;
  gl_PointSize = min(uSize * (0.7 + s.z*0.8) * (1.0 + infl*0.9) * uPR * (12.0 / max(depth, 0.5)), 40.0 * uPR);
  vAlpha = uOpacity * (0.55 + 0.45*s.y) * smoothstep(0.5, 3.0, depth);
  vAccent = clamp(infl + uDisp*0.5 + cl*0.6, 0.0, 1.0);
}
`;
