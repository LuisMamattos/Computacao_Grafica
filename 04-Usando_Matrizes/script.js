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

const bufferData = new Float32Array([
    // Coordenadas
    // left column
    0, 0,
    .3, .0,
    .0, 1.5,

    .0, 1.5,
    .3, .0,
    .3, 1.5,

    // top rung
    .3, 0,
    1, 0,
    .3, .3,

    .3, .3,
    1, 0,
    1, .3,

    // middle rung
    .3, .6,
    .67, .6,
    .3, .9,

    .3, .9,
    .67, .6,
    .67, .9, 

    // Tamanho
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

    // Cor
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
    0.0, 0.0, 1.0, 1.0  // Azul
   
]);


const aPositionLoc = gl.getAttribLocation(program, 'aPosition');
const aPointSizeLoc = gl.getAttribLocation(program, 'aPointSize');
const aColorLoc = gl.getAttribLocation(program, 'aColor');
const uOffsetLoc = gl.getUniformLocation(program, 'uOffset');

gl.enableVertexAttribArray(aPositionLoc);
gl.enableVertexAttribArray(aPointSizeLoc);
gl.enableVertexAttribArray(aColorLoc);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);

gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);
gl.vertexAttribPointer(aPointSizeLoc, 1, gl.FLOAT, false, 0, 36 * 4);
gl.vertexAttribPointer(aColorLoc, 4, gl.FLOAT, false, 0, 54 * 4);


const ySlider = document.getElementById('ySlider');
const Angulo = document.getElementById('Angulo');
const startButton = document.getElementById('startButton');

let startTime = null;
/////////////////////////////////////////////////////////////////////////////////////////////
function createTranslationMatrix(tx, ty) {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, 0, 1
    ]);
}
const uTransformMatrixLoc = gl.getUniformLocation(program, 'uTransformMatrix');
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




function drawScene(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsedTime = (timestamp - startTime) / 1000; // in seconds

    const cycleTime = 5; // x seconds to go and x to return
    const totalCycle = cycleTime * 2;

    let t = elapsedTime % totalCycle;
    if (t > cycleTime) {
        t = totalCycle - t;       
    } 
    var variacao = ((t / cycleTime) * 2 - 1);
    
    let t2 = (elapsedTime + cycleTime / 2) % totalCycle;
    if (t2 > cycleTime) {
        t2 = totalCycle - t2;       
    } 
    var variacao2 = ((t2 / cycleTime) * 2 - 1);


    const xOffset = variacao ;//////////////////////// 
    const yOffset = parseFloat(ySlider.value);
    //const yOffset = variacao;


    const xOffset2 = variacao2; 
    const yOffset2 = variacao2;

    gl.clear(gl.COLOR_BUFFER_BIT);


    // Criando Matrizes Individuais
    const scaleMatrix = createScaleMatrix(1, 1);
    const rotationMatrixZ = createRotationMatrixZ(parseFloat(Angulo.value) * Math.PI / 180);
    const translationMatrix1 = createTranslationMatrix(xOffset, yOffset);
    const translationMatrix2 = createTranslationMatrix(xOffset2, yOffset2);

    // Combinando Matrizes na Ordem Correta
    const transformMatrix1 = multiplyMatrices(rotationMatrixZ, multiplyMatrices(translationMatrix1, scaleMatrix));
    const transformMatrix2 = multiplyMatrices(translationMatrix2, multiplyMatrices(rotationMatrixZ, scaleMatrix));

    // Aplicando Matrizes de Transformação e Desenhando
    gl.uniformMatrix4fv(uTransformMatrixLoc, false, transformMatrix1);
    gl.drawArrays(gl.TRIANGLES, 0, 18);

    gl.uniformMatrix4fv(uTransformMatrixLoc, false, transformMatrix2);
    gl.drawArrays(gl.TRIANGLES, 0, 18);

    requestAnimationFrame(drawScene);
}

startButton.addEventListener('click', () => {
    startTime = null; // Reset the start time
    requestAnimationFrame(drawScene);
});

// Inicializa o WebGL
gl.clearColor(0.0, 0.0, 0.0, 1.0); // Opcional
gl.clear(gl.COLOR_BUFFER_BIT); // Opcional
