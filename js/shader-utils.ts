import GL = WebGLRenderingContextStrict;

const getShaderSrc = async (filename: string, debug: boolean = false): Promise<string> => {
    const source = await fetch(filename)
        .then(resp => resp.text());

    if (debug) {
        console.log(`contents of ${filename}:\n\n${source}`);
    }
    
    return source;
};

const createShader = (context: WebGLRenderingContextStrict, source: string, type: GL.ShaderType): WebGLShader => {
    let shader = context.createShader(type);

    context.shaderSource(shader, source);
    context.compileShader(shader);

    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        const error = context.getShaderInfoLog(shader);
        throw `could not compile shader: ${error}`;
    }

    return shader;
};

const getShaders = async (
    context: WebGLRenderingContextStrict,
    shaderDefs: [filename: string, type: GL.ShaderType][]
): Promise<WebGLShader[]> => {
    const shaderPromises = shaderDefs.map(([filename, type]) => {
        return getShaderSrc(filename, true)
            .then(source => createShader(context, source, type));
    });
    
    return Promise.all(shaderPromises);
};

const buildProgram = (context: WebGLRenderingContextStrict, shaders: WebGLShader[]): WebGLProgram => {
    let program = context.createProgram();

    shaders.forEach(shader => context.attachShader(program, shader));
    context.linkProgram(program);

    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
        const error = context.getProgramInfoLog(program);
        throw `could not link program: ${error}`;
    }

    return program;
};

export {
    buildProgram,
    getShaders
}
