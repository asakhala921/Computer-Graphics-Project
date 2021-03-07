import {defs, tiny} from '../examples/common.js';

const {
    color, Mat4, Material, Texture
} = tiny;
const {Cube} = defs;

import Water_Shader from "../Shaders/Water_Shader.js";

let SIZE = 256

export default class Water {
    constructor() {
        this.shapes = {
            cube: new Cube(),
        }

        this.waterMaterial = new Material(new Water_Shader(), {
            ambient: .4,
            diffusivity: 1,
            specularity: 0.8,
            texture: new Texture("../assets/water.jpeg"),
            color: color(0, 0, 1, 1)
        })

        this.water = Mat4.identity()
            .times(Mat4.scale(SIZE, 5, SIZE))
    }

    draw(context, program_state) {
        this.shapes.cube.draw(context, program_state, this.water, this.waterMaterial)
    }
}