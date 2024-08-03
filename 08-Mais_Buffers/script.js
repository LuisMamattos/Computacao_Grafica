const vertexShaderSource = `#version 300 es
#pragma vscode_glsllintstage: vert

in float aPointSize;
in vec2 aPosition;
in vec4 aColor;

uniform mat4 uTransformMatrix;

out vec4 vColor;

void main()
{
    gl_PointSize = aPointSize;
    gl_Position = uTransformMatrix * vec4(aPosition, 0.0, 1.0);
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
    // Coordenadas do primeiro objeto
    0, 0,
    .3, .0,
    .0, 1.5,
    
    .3, 1.5,
    .3, .0,
    .0, 1.5,    

    // top rung
    .3, 1.2,
    1, 1.2,
    .3, 1.5,

    1, 1.5,    
    1, 1.2,
    .3, 1.5,

    // middle rung
    .3, .6,
    .67, .6,
    .3, .9,

    .67, .9,    
    .67, .6,
    .3, .9,
]);

const positionData2 = new Float32Array([
    // Coordenadas do segundo objeto
    0, 0,
    .3, .0,
    .0, 1.5,
    
    .3, 1.5,
    .3, .0,
    .0, 1.5,    

    // top rung
    .3, 0,
    1, 0,
    .3, .3,

    1, .3,    
    1, 0,
    .3, .3,
]);

const sizeData1 = new Float32Array([
    100.0,
    30.0,
    50.0,

    100.0,
    30.0,
    50.0,

    100.0,
    30.0,
    50.0,

    100.0,
    30.0,
    50.0,

    100.0,
    30.0,
    50.0,

    100.0,
    30.0,
    50.0,
]);

const sizeData2 = new Float32Array([
    100.0,
    30.0,
    50.0,

    100.0,
    30.0,
    50.0,

    100.0,
    30.0,
    50.0,

    100.0,
    30.0,
    50.0,
]);

const colorData1 = new Float32Array([
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
]);

function createBuffer(data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buffer;
}

const positionBuffer1 = createBuffer(positionData1);
const positionBuffer2 = createBuffer(positionData2);
const sizeBuffer1 = createBuffer(sizeData1);
const sizeBuffer2 = createBuffer(sizeData2);
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

    const cycleTime = 1;
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
    const variacao = ((t / cycleTime) * 2 - 1);
    const variacao2 = ((t2 / (v2*cycleTime)) * 2 - 1);
    const variacao3 = ((t3 / (v3*cycleTime)) * 2 - 1);

    gl.clear(gl.COLOR_BUFFER_BIT);

    const orthoMatrix = createOrthographicMatrix(-3, 3, -3, 3, -1, 1);
    const scaleMatrix = createScaleMatrix(parseFloat(escala.value), parseFloat(escala.value));
    const rotationMatrix1 = createRotationMatrixZ(variacao * 200 * Math.PI / 180);
    const translationMatrix1 = createTranslationMatrix(variacao, variacao);
    const rotationMatrix2 = createRotationMatrixZ(variacao2 * 200 * Math.PI / 180);
    const translationMatrix2 = createTranslationMatrix(variacao2, variacao2);
    const rotationMatrix3 = createRotationMatrixZ(variacao3 * 200 * Math.PI / 180);
    const translationMatrix3 = createTranslationMatrix(variacao3, variacao3);

    const transformMatrix1 = multiplyMatrices(orthoMatrix, multiplyMatrices(rotationMatrix1, multiplyMatrices(translationMatrix1, scaleMatrix)));
    const transformMatrix2 = multiplyMatrices(orthoMatrix, multiplyMatrices(rotationMatrix2, multiplyMatrices(translationMatrix2, scaleMatrix)));
    const transformMatrix3 = multiplyMatrices(orthoMatrix, multiplyMatrices(rotationMatrix3, multiplyMatrices(translationMatrix3, scaleMatrix)));

    gl.uniformMatrix4fv(uTransformMatrixLoc, false, transformMatrix1);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer1);
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer1);
    gl.enableVertexAttribArray(aPointSizeLoc);
    gl.vertexAttribPointer(aPointSizeLoc, 1, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer1);
    gl.enableVertexAttribArray(aColorLoc);
    gl.vertexAttribPointer(aColorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, positionData1.length / 2);

    gl.uniformMatrix4fv(uTransformMatrixLoc, false, transformMatrix2);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2);
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer2);
    gl.enableVertexAttribArray(aPointSizeLoc);
    gl.vertexAttribPointer(aPointSizeLoc, 1, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer2);
    gl.enableVertexAttribArray(aColorLoc);
    gl.vertexAttribPointer(aColorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, positionData2.length / 2);

    gl.uniformMatrix4fv(uTransformMatrixLoc, false, transformMatrix3);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2);
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer2);
    gl.enableVertexAttribArray(aPointSizeLoc);
    gl.vertexAttribPointer(aPointSizeLoc, 1, gl.FLOAT, false, 0, 0);
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
/////////////////////////////////////////////////////////////////////////////////////////////
function createTranslationMatrix(tx, ty) {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, 0, 1
    ]);
}
/////////////////////////////////////////////////////////////////////////////////////////////
function createRotationMatrixX(angleInRadians) {
    const xcos = Math.cos(angleInRadians);
    const xsin = Math.sin(angleInRadians);
    return new Float32Array([
        1, 0,     0,    0,
        0, xcos, -xsin, 0,
        0, xsin,  xcos, 0,
        0, 0,     0,    1
    ]);
}
/////////////////////////////////////////////////////////////////////////////////////////////
function createRotationMatrixY(angleInRadians) {
    const ycos = Math.cos(angleInRadians);
    const ysin = Math.sin(angleInRadians);
    return new Float32Array([
        ycos,  0,  ysin, 0,
        0,     1,  0,    0,
        -ysin, 0,  ycos, 0,
        0,     0,  0,    1
    ]);
}
/////////////////////////////////////////////////////////////////////////////////////////////
function createRotationMatrixZ(angleInRadians) {
    const zcos = Math.cos(angleInRadians);
    const zsin = Math.sin(angleInRadians);
    return new Float32Array([
        zcos, -zsin, 0, 0,
        zsin, zcos,  0, 0,
        0,   0,    1, 0,
        0,   0,    0, 1
    ]);
}
/////////////////////////////////////////////////////////////////////////////////////////////
function createScaleMatrix(sx, sy) {
    return new Float32Array([
        sx, 0,  0, 0,
        0, sy,  0, 0,
        0, 0,  1, 0,
        0, 0,  0, 1
    ]);
}
/////////////////////////////////////////////////////////////////////////////////////////////
function createOrthographicMatrix(left, right, bottom, top, near, far) {
    return new Float32Array([
        2 / (right - left), 0, 0, 0,
        0, 2 / (top - bottom), 0, 0,
        0, 0, -2 / (far - near), 0,
        -(right + left) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1
    ]);
}
/////////////////////////////////////////////////////////////////////////////////////////////
function multiplyMatrices(a, b) {
    const result = new Float32Array(16);
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            result[row * 4 + col] =
                a[row * 4 + 0] * b[0 * 4 + col] +
                a[row * 4 + 1] * b[1 * 4 + col] +
                a[row * 4 + 2] * b[2 * 4 + col] +
                a[row * 4 + 3] * b[3 * 4 + col];
        }
    }

    return result;
    
}