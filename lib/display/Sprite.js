import {Renderer} from "../renderer/Renderer.js";
import {Point, M3x3} from "../core/maths.js";

export class Sprite{
    constructor(gl, img_url, vs, fs){
        this.gl = gl;
        this.isLoaded = false;
        this.renderer = new Renderer(gl,vs,fs);

        this.image = new Image();
        this.image.src = img_url;
        this.image.sprite = this;
        this.image.onload = function(){
            this.sprite.setup();
        }


    }
    static createRectArray(x=0, y=0, w=1, h=1){
        return new Float32Array([
            x, y,
            x+w, y,
            x, y+h,
            x, y+h,
            x+w, y,
            x+w, y+h
        ]);
    }
    setup(){
        let gl = this.gl;

        gl.useProgram(this.renderer.program);
        this.gl_tex = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, this.gl_tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
        gl.bindTexture(gl.TEXTURE_2D, null);

        this.tex_buff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_buff);
        gl.bufferData(gl.ARRAY_BUFFER, Sprite.createRectArray(), gl.STATIC_DRAW);


        this.geo_buff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.geo_buff);
        gl.bufferData(gl.ARRAY_BUFFER, Sprite.createRectArray(), gl.STATIC_DRAW);

        this.aPositionLoc = gl.getAttribLocation(this.renderer.program, "a_position");
        this.aTexcoordLoc = gl.getAttribLocation(this.renderer.program, "a_texCoord");
        this.uImageLoc = gl.getUniformLocation(this.renderer.program, "u_image");

        gl.useProgram(null);
        this.isLoaded = true;

    }
    render(){
        if(this.isLoaded){
            let gl = this.gl;

            gl.useProgram(this.renderer.program);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.gl_tex);
            gl.uniform1i(this.uImageLoc, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_buff);
            gl.enableVertexAttribArray(this.aTexcoordLoc);
            gl.vertexAttribPointer(this.aTexcoordLoc,2,gl.FLOAT,false,0,0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.geo_buff);
            gl.enableVertexAttribArray(this.aPositionLoc);
            gl.vertexAttribPointer(this.aPositionLoc,2,gl.FLOAT,false,0,0);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);

            gl.useProgram(null);
        }
    }
}