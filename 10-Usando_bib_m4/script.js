const vertexShaderSource = `#version 300 es
#pragma vscode_glsllintstage: vert

in float aPointSize;
in vec3 aPosition;
in vec4 aColor;

uniform mat4 uTransformMatrix;

out vec4 vColor;

void main()
{
    gl_PointSize = aPointSize;
    gl_Position = uTransformMatrix * vec4(aPosition, 1.0);
    vColor = aColor;
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

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
    console.log(gl.getShaderInfoLog(fragmentShader));
}

gl.useProgram(program);

const aPositionLoc = gl.getAttribLocation(program, 'aPosition');
const aPointSizeLoc = gl.getAttribLocation(program, 'aPointSize');
const aColorLoc = gl.getAttribLocation(program, 'aColor');
const uTransformMatrixLoc = gl.getUniformLocation(program, 'uTransformMatrix');

// Dados para os diferentes buffers
const positionData1 = new Float32Array([
          // left column front
          0,   0,  0,
          0, 1.5,  0,
          0.3,   0,  0,

          0, 1.5,  0,
          0.3, 1.5,  0,
          0.3,   0,  0,

          // top rung front
          0.3,   0,  0,
          0.3,  0.3,  0,
          1,   0,  0,

          0.3,  0.3,  0,
          1,  0.3,  0,
          1,   0,  0,

          // middle rung front
          0.3,  0.6,  0,
          0.3,  0.9,  0,
          0.67,  0.6,  0,

          0.3,  0.9,  0,
          0.67,  0.9,  0,
          0.67,  0.6,  0,

          // left column back
            0,   0,  0.3,
           0.3,   0,  0.3,
            0, 1.5,  0.3,

            0, 1.5,  0.3,
           0.3,   0,  0.3,
           0.3, 1.5,  0.3,

          // top rung back
           0.3,   0,  0.3,
          1,   0,  0.3,
           0.3,  0.3,  0.3,

           0.3,  0.3,  0.3,
          1,   0,  0.3,
          1,  0.3,  0.3,

          // middle rung back
           0.3,  0.6,  0.3,
           0.67,  0.6,  0.3,
           0.3,  0.9,  0.3,

           0.3,  0.9,  0.3,
           0.67,  0.6,  0.3,
           0.67,  0.9,  0.3,

          // top
            0,   0,   0,
          1,   0,   0,
          1,   0,  0.3,

            0,   0,   0,
          1,   0,  0.3,
            0,   0,  0.3,

          // top rung right
          1,   0,   0,
          1,  0.3,   0,
          1,  0.3,  0.3,

          1,   0,   0,
          1,  0.3,  0.3,
          1,   0,  0.3,

          // under top rung
          0.3,   0.3,   0,
          0.3,   0.3,  0.3,
          1,  0.3,  0.3,

          0.3,   0.3,   0,
          1,  0.3,  0.3,
          1,  0.3,   0,

          // between top rung and middle
          0.3,   0.3,   0,
          0.3,   0.6,  0.3,
          0.3,   0.3,  0.3,

          0.3,   0.3,   0,
          0.3,   0.6,   0,
          0.3,   0.6,  0.3,

          // top of middle rung
          0.3,   0.6,   0,
          0.67,   0.6,  0.3,
          0.3,   0.6,  0.3,

          0.3,   0.6,   0,
          0.67,   0.6,   0,
          0.67,   0.6,  0.3,

          // right of middle rung
          0.67,   0.6,   0,
          0.67,   0.9,  0.3,
          0.67,   0.6,  0.3,

          0.67,   0.6,   0,
          0.67,   0.9,   0,
          0.67,   0.9,  0.3,

          // bottom of middle rung.
          0.3,   0.9,   0,
          0.3,   0.9,  0.3,
          0.67,   0.9,  0.3,

          0.3,   0.9,   0,
          0.67,   0.9,  0.3,
          0.67,   0.9,   0,

          // right of bottom
          0.3,   0.9,   0,
          0.3,  1.5,  0.3,
          0.3,   0.9,  0.3,

          0.3,   0.9,   0,
          0.3,  1.5,   0,
          0.3,  1.5,  0.3,

          // bottom
          0,   1.5,   0,
          0,   1.5,  0.3,
          0.3,  1.5,  0.3,

          0,   1.5,   0,
          0.3,  1.5,  0.3,
          0.3,  1.5,   0,

          // left side
          0,   0,   0,
          0,   0,  0.3,
          0,  1.5,  0.3,

          0,   0,   0,
          0,  1.5,  0.3,
          0,  1.5,   0,
]);


const positionData2 = new Float32Array([
    // left column front
    0,   0,  0,
    0, 1.5,  0,
    0.3,   0,  0,

    0, 1.5,  0,
    0.3, 1.5,  0,
    0.3,   0,  0,

    // top rung front
    0.3,   0,  0,
    0.3,  0.3,  0,
    1,   0,  0,

    0.3,  0.3,  0,
    1,  0.3,  0,
    1,   0,  0,    

    // left column back
      0,   0,  0.3,
     0.3,   0,  0.3,
      0, 1.5,  0.3,

      0, 1.5,  0.3,
     0.3,   0,  0.3,
     0.3, 1.5,  0.3,

    // top rung back
     0.3,   0,  0.3,
    1,   0,  0.3,
     0.3,  0.3,  0.3,

     0.3,  0.3,  0.3,
    1,   0,  0.3,
    1,  0.3,  0.3,

    // top
      0,   0,   0,
    1,   0,   0,
    1,   0,  0.3,

      0,   0,   0,
    1,   0,  0.3,
      0,   0,  0.3,

    // top rung right
    1,   0,   0,
    1,  0.3,   0,
    1,  0.3,  0.3,

    1,   0,   0,
    1,  0.3,  0.3,
    1,   0,  0.3,

    // under top rung
    0.3,   0.3,   0,
    0.3,   0.3,  0.3,
    1,  0.3,  0.3,

    0.3,   0.3,   0,
    1,  0.3,  0.3,
    1,  0.3,   0,

    // between top rung and middle
    0.3,   0.3,   0,
    0.3,   1.5,  0.3,
    0.3,   1.5,  0,

    0.3,   0.3,   0,
    0.3,   1.5,  0.3,
    0.3,   0.3,  0.3,

    // bottom
    0,   1.5,   0,
    0,   1.5,  0.3,
    0.3,  1.5,  0.3,

    0,   1.5,   0,
    0.3,  1.5,  0.3,
    0.3,  1.5,   0,

    // left side
    0,   0,   0,
    0,   0,  0.3,
    0,  1.5,  0.3,

    0,   0,   0,
    0,  1.5,  0.3,
    0,  1.5,   0,
]);

const colorData1 = new Float32Array([
    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro

    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro

    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro

    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro

    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro

    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro

    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro

    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro

    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro

    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro

    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro

    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro
    0.72, 0.52, 0.04, 1.0, // Marrom claro
    
    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul
    
    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul
    
    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul
    
    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul

    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul

    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul

    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul

    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul

    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul

    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul

    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul

    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul

    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul

    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul

    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul

    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul
    
    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul
    
    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul
    
    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul
    
    1.0, 0.0, 0.0, 1.0, // Vermelho
    0.0, 1.0, 0.0, 1.0, // Verde
    0.0, 0.0, 1.0, 1.0,  // Azul
]);

const colorData2 = new Float32Array([
    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

    1.0, 1.0, 0.0, 1.0, // Amarelo
    0.0, 1.0, 1.0, 1.0, // Ciano
    1.0, 0.0, 1.0, 1.0,  // Magenta

]);

function createBuffer(data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buffer;
}

const positionBuffer1 = createBuffer(positionData1);
const positionBuffer2 = createBuffer(positionData2);
const colorBuffer1 = createBuffer(colorData1);
const colorBuffer2 = createBuffer(colorData2);

const ySlider = document.getElementById('ySlider');
const Angulo = document.getElementById('Angulo');
const escala = document.getElementById('escala');
const startButton = document.getElementById('startButton');

let startTime = null;
requestAnimationFrame(drawScene);

function drawScene(timestamp) {

    const v2 = 3.39; //diferença de frequencia em relação ao primeiro
    const v3 = 7.12;
    if (!startTime) startTime = timestamp;
    const elapsedTime = (timestamp - startTime) / 1000;

    const cycleTime = 5;
    const totalCycle = cycleTime * 2;

    let t = elapsedTime % totalCycle;
    if (t > cycleTime) {
        t = totalCycle - t;
    }
    let t2 = elapsedTime % (v2*totalCycle);
    if (t2 > v2*cycleTime) {
        t2 = v2*totalCycle - t2;       
    }

    let t3 = elapsedTime % (v3*totalCycle);
    if (t3 > v3*cycleTime) {
        t3 = v3*totalCycle - t3;       
    }        
    var variacao = ((t / cycleTime) * 2 - 1);
    var variacao2 = ((t2 / (v2*cycleTime)) * 2 - 1);
    var variacao3 = ((t3 / (v3*cycleTime)) * 2 - 1);

    //variacao *= 0.6;
    //variacao2 *= 0;
    //variacao3 *= 0;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // turn on depth testing
    gl.enable(gl.DEPTH_TEST);

    // tell webgl to cull faces
    //gl.enable(gl.CULL_FACE);

    const orthoMatrix = m4.projection(6, 6, 6);
    const scaleMatrix = m4.scaling(parseFloat(escala.value), parseFloat(escala.value), parseFloat(escala.value));
    const rotationMatrix1z = m4.zRotation(variacao * 300 * Math.PI / 180);
    const rotationMatrix1y = m4.yRotation(variacao * 500 * Math.PI / 180);
    const rotationMatrix1x = m4.xRotation(variacao * 200 * Math.PI / 180);
    const translationMatrix1 = m4.translation(variacao, variacao, 0);

    const rotationMatrix2z = m4.zRotation(variacao2 * 200 * Math.PI / 180);
    const rotationMatrix2y = m4.yRotation(variacao2 * 800 * Math.PI / 180);
    const rotationMatrix2x = m4.xRotation(variacao2 * 200 * Math.PI / 180);
    const translationMatrix2 = m4.translation(variacao2, variacao2, 0);

    const rotationMatrix3z = m4.zRotation(variacao3 * 200 * Math.PI / 180);
    const rotationMatrix3y = m4.yRotation(variacao3 * 500 * Math.PI / 180);
    const rotationMatrix3x = m4.xRotation(variacao3 * 800 * Math.PI / 180);
    const translationMatrix3 = m4.translation(variacao3, variacao3, 0);    
       
    var Transf_Aux1 = scaleMatrix;
    Transf_Aux1 = m4.multiply(Transf_Aux1, translationMatrix1);
    Transf_Aux1 = m4.multiply(Transf_Aux1, rotationMatrix1z);
    Transf_Aux1 = m4.multiply(Transf_Aux1, rotationMatrix1y);
    Transf_Aux1 = m4.multiply(Transf_Aux1, rotationMatrix1x);
    Transf_Aux1 = m4.multiply(Transf_Aux1, orthoMatrix);
    const transformMatrix1 = Transf_Aux1;

    var Transf_Aux2 = scaleMatrix;    
    Transf_Aux2 = m4.multiply(Transf_Aux2, translationMatrix2);
    Transf_Aux2 = m4.multiply(Transf_Aux2, rotationMatrix2z);
    Transf_Aux2 = m4.multiply(Transf_Aux2, rotationMatrix2y);
    Transf_Aux2 = m4.multiply(Transf_Aux2, rotationMatrix2x);
    Transf_Aux2 = m4.multiply(Transf_Aux2, orthoMatrix);
    const transformMatrix2 = Transf_Aux2;

    var Transf_Aux3 = scaleMatrix;    
    Transf_Aux3 = m4.multiply(Transf_Aux3, translationMatrix3);
    Transf_Aux3 = m4.multiply(Transf_Aux3, rotationMatrix3z);
    Transf_Aux3 = m4.multiply(Transf_Aux3, rotationMatrix3y);
    Transf_Aux3 = m4.multiply(Transf_Aux3, rotationMatrix3x);
    Transf_Aux3 = m4.multiply(Transf_Aux3, orthoMatrix);
    const transformMatrix3 = Transf_Aux3;


    gl.uniformMatrix4fv(uTransformMatrixLoc, false, transformMatrix1);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer1);
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);    
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer1);
    gl.enableVertexAttribArray(aColorLoc);
    gl.vertexAttribPointer(aColorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, positionData1.length / 2);

    gl.uniformMatrix4fv(uTransformMatrixLoc, false, transformMatrix2);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2);
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer2);
    gl.enableVertexAttribArray(aColorLoc);
    gl.vertexAttribPointer(aColorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, positionData2.length / 2);

    gl.uniformMatrix4fv(uTransformMatrixLoc, false, transformMatrix3);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2);
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer2);
    gl.enableVertexAttribArray(aColorLoc);
    gl.vertexAttribPointer(aColorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, positionData2.length / 2);

    requestAnimationFrame(drawScene);
}

startButton.addEventListener('click', () => {
    startTime = null; // Reset the start time
    requestAnimationFrame(drawScene);
});
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

var m4 = {

    perspective: function(fieldOfViewInRadians, aspect, near, far) {
      var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
      var rangeInv = 1.0 / (near - far);
  
      return [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, near * far * rangeInv * 2, 0,
      ];
    },
  
    projection: function(width, height, depth) {
      // Note: This matrix flips the Y axis so 0 is at the top.
      return [
        2 / width, 0, 0, 0,
        0, -2 / height, 0, 0,
        0, 0, 2 /  depth, 0,
        0, 0, 0, 1
    
      ];
    },
  
    multiply: function(a, b) {
      var a00 = a[0 * 4 + 0];
      var a01 = a[0 * 4 + 1];
      var a02 = a[0 * 4 + 2];
      var a03 = a[0 * 4 + 3];
      var a10 = a[1 * 4 + 0];
      var a11 = a[1 * 4 + 1];
      var a12 = a[1 * 4 + 2];
      var a13 = a[1 * 4 + 3];
      var a20 = a[2 * 4 + 0];
      var a21 = a[2 * 4 + 1];
      var a22 = a[2 * 4 + 2];
      var a23 = a[2 * 4 + 3];
      var a30 = a[3 * 4 + 0];
      var a31 = a[3 * 4 + 1];
      var a32 = a[3 * 4 + 2];
      var a33 = a[3 * 4 + 3];
      var b00 = b[0 * 4 + 0];
      var b01 = b[0 * 4 + 1];
      var b02 = b[0 * 4 + 2];
      var b03 = b[0 * 4 + 3];
      var b10 = b[1 * 4 + 0];
      var b11 = b[1 * 4 + 1];
      var b12 = b[1 * 4 + 2];
      var b13 = b[1 * 4 + 3];
      var b20 = b[2 * 4 + 0];
      var b21 = b[2 * 4 + 1];
      var b22 = b[2 * 4 + 2];
      var b23 = b[2 * 4 + 3];
      var b30 = b[3 * 4 + 0];
      var b31 = b[3 * 4 + 1];
      var b32 = b[3 * 4 + 2];
      var b33 = b[3 * 4 + 3];
      return [
        b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
        b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
        b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
        b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
        b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
        b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
        b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
        b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
        b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
        b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
        b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
        b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
        b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
        b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
        b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
        b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
      ];
    },
  
    translation: function(tx, ty, tz) {
      return [
         1,  0,  0,  0,
         0,  1,  0,  0,
         0,  0,  1,  0,
         tx, ty, tz, 1,
      ];
    },
  
    xRotation: function(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
  
      return [
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1,
      ];
    },
  
    yRotation: function(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
  
      return [
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1,
      ];
    },
  
    zRotation: function(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
  
      return [
         c, s, 0, 0,
        -s, c, 0, 0,
         0, 0, 1, 0,
         0, 0, 0, 1,
      ];
    },
  
    scaling: function(sx, sy, sz) {
      return [
        sx, 0,  0,  0,
        0, sy,  0,  0,
        0,  0, sz,  0,
        0,  0,  0,  1,
      ];
    },
  
    translate: function(m, tx, ty, tz) {
      return m4.multiply(m, m4.translation(tx, ty, tz));
    },
  
    xRotate: function(m, angleInRadians) {
      return m4.multiply(m, m4.xRotation(angleInRadians));
    },
  
    yRotate: function(m, angleInRadians) {
      return m4.multiply(m, m4.yRotation(angleInRadians));
    },
  
    zRotate: function(m, angleInRadians) {
      return m4.multiply(m, m4.zRotation(angleInRadians));
    },
  
    scale: function(m, sx, sy, sz) {
      return m4.multiply(m, m4.scaling(sx, sy, sz));
    },
  
    inverse: function(m) {
      var m00 = m[0 * 4 + 0];
      var m01 = m[0 * 4 + 1];
      var m02 = m[0 * 4 + 2];
      var m03 = m[0 * 4 + 3];
      var m10 = m[1 * 4 + 0];
      var m11 = m[1 * 4 + 1];
      var m12 = m[1 * 4 + 2];
      var m13 = m[1 * 4 + 3];
      var m20 = m[2 * 4 + 0];
      var m21 = m[2 * 4 + 1];
      var m22 = m[2 * 4 + 2];
      var m23 = m[2 * 4 + 3];
      var m30 = m[3 * 4 + 0];
      var m31 = m[3 * 4 + 1];
      var m32 = m[3 * 4 + 2];
      var m33 = m[3 * 4 + 3];
      var tmp_0  = m22 * m33;
      var tmp_1  = m32 * m23;
      var tmp_2  = m12 * m33;
      var tmp_3  = m32 * m13;
      var tmp_4  = m12 * m23;
      var tmp_5  = m22 * m13;
      var tmp_6  = m02 * m33;
      var tmp_7  = m32 * m03;
      var tmp_8  = m02 * m23;
      var tmp_9  = m22 * m03;
      var tmp_10 = m02 * m13;
      var tmp_11 = m12 * m03;
      var tmp_12 = m20 * m31;
      var tmp_13 = m30 * m21;
      var tmp_14 = m10 * m31;
      var tmp_15 = m30 * m11;
      var tmp_16 = m10 * m21;
      var tmp_17 = m20 * m11;
      var tmp_18 = m00 * m31;
      var tmp_19 = m30 * m01;
      var tmp_20 = m00 * m21;
      var tmp_21 = m20 * m01;
      var tmp_22 = m00 * m11;
      var tmp_23 = m10 * m01;
  
      var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
               (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
      var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
               (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
      var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
               (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
      var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
               (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
  
      var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
  
      return [
        d * t0,
        d * t1,
        d * t2,
        d * t3,
        d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
             (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
        d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
             (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
        d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
             (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
        d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
             (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
        d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
             (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
        d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
             (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
        d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
             (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
        d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
             (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
        d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
             (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
        d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
             (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
        d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
             (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
        d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
             (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02)),
      ];
    },
  
    cross: function(a, b) {
      return [
         a[1] * b[2] - a[2] * b[1],
         a[2] * b[0] - a[0] * b[2],
         a[0] * b[1] - a[1] * b[0],
      ];
    },
  
    subtractVectors: function(a, b) {
      return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    },
  
    normalize: function(v) {
      var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
      // make sure we don't divide by 0.
      if (length > 0.00001) {
        return [v[0] / length, v[1] / length, v[2] / length];
      } else {
        return [0, 0, 0];
      }
    },
  
    lookAt: function(cameraPosition, target, up) {
      var zAxis = m4.normalize(
          m4.subtractVectors(cameraPosition, target));
      var xAxis = m4.normalize(m4.cross(up, zAxis));
      var yAxis = m4.normalize(m4.cross(zAxis, xAxis));
  
      return [
        xAxis[0], xAxis[1], xAxis[2], 0,
        yAxis[0], yAxis[1], yAxis[2], 0,
        zAxis[0], zAxis[1], zAxis[2], 0,
        cameraPosition[0],
        cameraPosition[1],
        cameraPosition[2],
        1,
      ];
    },
  
    transformVector: function(m, v) {
      var dst = [];
      for (var i = 0; i < 4; ++i) {
        dst[i] = 0.0;
        for (var j = 0; j < 4; ++j) {
          dst[i] += v[j] * m[j * 4 + i];
        }
      }
      return dst;
    },
  
  };
