// Custom GLSL shaders for low-poly grass rendering

export const grassVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseRadius;
  uniform vec3 uIndentPositions[5];
  uniform float uIndentStrengths[5];
  
  attribute float aHeight;
  attribute float aOffset;
  attribute float aAngle;
  
  varying float vHeight;
  varying vec3 vNormal;
  varying float vFogDepth;
  
  // Simplex noise function for natural wind movement
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vHeight = aHeight;
    vNormal = normalMatrix * normal;
    
    vec3 pos = position;
    
    // Wind effect - varies by position and time
    float windStrength = snoise(vec3(pos.x * 0.1, pos.z * 0.1, uTime * 0.5)) * 0.5 + 0.5;
    float windDirection = snoise(vec3(pos.x * 0.05, uTime * 0.3, pos.z * 0.05));
    
    // Apply wind bend (stronger at top of grass)
    float bendAmount = aHeight * aHeight * windStrength * 0.3;
    pos.x += sin(uTime * 2.0 + aOffset) * bendAmount + windDirection * bendAmount;
    pos.z += cos(uTime * 1.5 + aOffset * 0.7) * bendAmount * 0.5;
    
    // Mouse interaction - push grass away from cursor
    vec2 grassPos2D = vec2(pos.x, pos.z);
    float distToMouse = distance(grassPos2D, uMouse);
    float mouseInfluence = 1.0 - smoothstep(0.0, uMouseRadius, distToMouse);
    
    if (mouseInfluence > 0.0) {
      vec2 pushDir = normalize(grassPos2D - uMouse);
      float pushStrength = mouseInfluence * aHeight * 1.5;
      pos.x += pushDir.x * pushStrength;
      pos.z += pushDir.y * pushStrength;
      pos.y -= mouseInfluence * aHeight * 0.3; // Slight bend down
    }
    
    // Click indent effect
    for (int i = 0; i < 5; i++) {
      if (uIndentStrengths[i] > 0.01) {
        float distToIndent = distance(vec2(pos.x, pos.z), vec2(uIndentPositions[i].x, uIndentPositions[i].z));
        float indentRadius = 1.5;
        float indentInfluence = (1.0 - smoothstep(0.0, indentRadius, distToIndent)) * uIndentStrengths[i];
        
        if (indentInfluence > 0.0) {
          // Push grass outward and down
          vec2 pushDir = normalize(vec2(pos.x, pos.z) - vec2(uIndentPositions[i].x, uIndentPositions[i].z) + vec2(0.001));
          pos.x += pushDir.x * indentInfluence * aHeight * 2.0;
          pos.z += pushDir.y * indentInfluence * aHeight * 2.0;
          pos.y -= indentInfluence * aHeight * 0.8;
        }
      }
    }
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vFogDepth = -mvPosition.z;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const grassFragmentShader = `
  uniform vec3 uColorBase;
  uniform vec3 uColorTip;
  uniform float uTime;
  
  varying float vHeight;
  varying vec3 vNormal;
  varying float vFogDepth;
  
  void main() {
    // Gradient from base to tip
    vec3 color = mix(uColorBase, uColorTip, vHeight);
    
    // Add subtle variation
    float variation = sin(vHeight * 10.0 + gl_FragCoord.x * 0.01) * 0.05;
    color += variation;
    
    // Simple lighting
    vec3 lightDir = normalize(vec3(0.5, 1.0, 0.3));
    float diffuse = max(dot(normalize(vNormal), lightDir), 0.3);
    color *= (0.7 + diffuse * 0.3);
    
    // Subtle fog for depth
    float fogStart = 15.0;
    float fogEnd = 40.0;
    float fogFactor = smoothstep(fogStart, fogEnd, vFogDepth);
    vec3 fogColor = vec3(0.53, 0.81, 0.92); // Sky blue
    color = mix(color, fogColor, fogFactor * 0.3);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;
