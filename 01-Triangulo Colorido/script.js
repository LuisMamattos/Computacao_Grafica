
const vertexShaderSource = `#version 300 es
#pragma vscode_glsllintstage: vert

in float aPointSize;
in vec2 aPosition;
in vec4 aColor;

out vec4 vColor;

void main()
{
    gl_PointSize = aPointSize;
    gl_Position = vec4(aPosition, 0.0, 1.0);
    vColor =aColor;
}`;

const fragmentShaderSource = `#version 300 es
#pragma vscode_glsllintstage: frag

precision mediump float;

in vec4 vColor;

out vec4 fragColor;

void main()
{
    fragColor = vColor;
}`;

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');

const program = gl.createProgram();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
gl.attachShader(program, vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
    console.log(gl.getShaderInfoLog(vertexShader));
    console.log(gl.getShaderInfoLog(fragmentShader));
}

gl.useProgram(program);

// const bufferData = new Float32Array([
//       0,  .8,    10,
//       0, -.8,    3,
//     -.8,   0,    5,
// ]);
const bufferData = new Float32Array([
    ///////////////////////coordenadas
    0.0,  0.8, 
    0.0, -0.8, 
   -0.8,  0.0,
    ///////////////////////tamanho
    100.0,
    30.0,
    50.0,
    ///////////////////////cor
    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0  // Azul
]);

const aPositionLoc = gl.getAttribLocation(program, 'aPosition');
const aPointSizeLoc = gl.getAttribLocation(program, 'aPointSize');
const aColorLoc = gl.getAttribLocation(program, 'aColor');

gl.enableVertexAttribArray(aPositionLoc);
gl.enableVertexAttribArray(aPointSizeLoc);
gl.enableVertexAttribArray(aColorLoc);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);

gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);
gl.vertexAttribPointer(aPointSizeLoc, 1, gl.FLOAT, false, 0, 6 * 4);
gl.vertexAttribPointer(aColorLoc, 4, gl.FLOAT, false, 0, 9 * 4);

gl.drawArrays(gl.TRIANGLES,0,3);
