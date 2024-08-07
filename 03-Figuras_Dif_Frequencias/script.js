const vertexShaderSource = `#version 300 es
#pragma vscode_glsllintstage: vert

in float aPointSize;
in vec2 aPosition;
in vec4 aColor;

uniform vec2 uOffset;

out vec4 vColor;

void main()
{
    gl_PointSize = aPointSize;
    gl_Position = vec4(aPosition + uOffset, 0.0, 1.0);
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
const startButton = document.getElementById('startButton');

let startTime = null;

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


    gl.uniform2f(uOffsetLoc, xOffset, yOffset);
    gl.drawArrays(gl.TRIANGLES, 0, 18);

    gl.uniform2f(uOffsetLoc, xOffset2, yOffset2);
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
