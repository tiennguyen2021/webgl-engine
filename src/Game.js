import {Sprite} from "../lib/display/Sprite.js";

export class Game{
    constructor(){
        this.canvasElm = document.createElement("canvas");
        this.canvasElm.width = 800;
        this.canvasElm.height = 600;

        this.gl = this.canvasElm.getContext("webgl2");

        document.body.appendChild(this.canvasElm);

        let vs = document.getElementById("vs_01").innerHTML;
        let fs = document.getElementById("fs_01").innerHTML;

        this.sprite1 = new Sprite(this.gl, "assets/img/major.png", vs, fs);
        this.sprite2 = new Sprite(this.gl, "assets/img/mini.png", vs, fs);
    }

    update(){
        this.gl.viewport(0,0, this.canvasElm.width, this.canvasElm.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.sprite1.render();
        this.sprite2.render();

        this.gl.flush();
    }
}