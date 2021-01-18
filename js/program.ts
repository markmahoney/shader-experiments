import { buildProgram, getShaders } from "./shader-utils.js"

const clearContext = (canvas: HTMLCanvasElement, gl: WebGLRenderingContextStrict): void => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.9, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
};

const drawVertexCanvas = (gl: WebGLRenderingContextStrict, shaderProgram: WebGLProgram): void => {
    let vertexArray = new Float32Array([
        -1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0, -1.0, -1.0, -1.0
    ]);

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

    let vertexCount = vertexArray.length / 2
    let aVertexPosition =
        gl.getAttribLocation(shaderProgram, "a_position");

    gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexPosition);

    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
};

(async () => {
    const canvas = document.querySelector('canvas');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    
    const gl = canvas.getContext("webgl") as any as WebGLRenderingContextStrict;
    const shaders = await getShaders(gl, [
        ['shaders/default.vert', gl.VERTEX_SHADER],
        ['shaders/bookofshaders/02_line.frag', gl.FRAGMENT_SHADER],
    ]);
    const shaderProgram = buildProgram(gl, shaders);

    gl.useProgram(shaderProgram);
    
    // Uniforms
    let uMouse: WebGLUniformLocation = gl.getUniformLocation(shaderProgram, 'u_mouse');
    let uResolution: WebGLUniformLocation = gl.getUniformLocation(shaderProgram, 'u_resolution');
    let uTime: WebGLUniformLocation = gl.getUniformLocation(shaderProgram, 'u_time');

    let canvasWidth: number, canvasHeight: number;
    
    // Event Handlers
    const resizeCanvas = (): void => {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        gl.uniform2f(uResolution, canvas.width, canvas.height);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, false);

    const trackMouse = (e: MouseEvent): void => {
        gl.uniform2f(uMouse, e.pageX, canvasHeight - e.pageY);
    }
    gl.uniform2f(uMouse, 0, 0);
    canvas.addEventListener('mousemove', trackMouse, false);

    // Render loop
    let start = 0;
    const animate = (timestamp: number): void => {
        start = start || timestamp;
        const elapsedInSec = (timestamp - start) / 1000;

        clearContext(canvas, gl);
        drawVertexCanvas(gl, shaderProgram);
        gl.uniform1f(uTime, elapsedInSec);
        
        window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);
})();
