import { buildProgram, getShaders } from "./shader-utils.js"

(async () => {
    const canvas = document.querySelector('canvas');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    
    const gl = canvas.getContext("webgl") as any as WebGLRenderingContextStrict;
    const shaders = await getShaders(gl, [
        ['shaders/default.vert', gl.VERTEX_SHADER],
        ['shaders/experiment2.frag', gl.FRAGMENT_SHADER],
    ]);
    const shaderProgram = buildProgram(gl, shaders);

    gl.useProgram(shaderProgram);
    
    // Uniforms
    let uMouse: WebGLUniformLocation = gl.getUniformLocation(shaderProgram, 'u_mouse');
    let uResolution: WebGLUniformLocation = gl.getUniformLocation(shaderProgram, 'u_resolution');
    let uTime: WebGLUniformLocation = gl.getUniformLocation(shaderProgram, 'u_time');
    
    // Event Handlers
    const resizeCanvas = (): void => {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        gl.uniform2f(uResolution, canvas.width, canvas.height);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, false);

    const trackMouse = (e: MouseEvent): void => {
        gl.uniform2f(uMouse, e.pageX, e.pageY);
    }
    canvas.addEventListener('mousemove', trackMouse, false);

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

    // Render loop
    const animate = (previousTime: number): void => {

    }
})();
