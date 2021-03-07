import {defs, tiny} from '/examples/common.js';

const {
    color, Mat4, Material, Texture
} = tiny;
const {Textured_Phong} = defs;

import Human from '/Shapes/Human.js'


export default class Player {
    constructor(){
        this.shapes = {
            human: new Human(),
        }

        this.materials = {
            rgb: new Material(new Textured_Phong(), {
                color: color(1, 1, 1, 1),
                ambient: .4, diffusivity: 0.2, specularity: 0.3,
                texture: new Texture("assets/rgb.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
        }
    }

    draw(context, program_state) {
        this.human_0 = Mat4.identity()
            .times(Mat4.scale(1,1 , 1))
            .times(Mat4.translation(0, 20, 0));
        this.shapes.human.draw(context, program_state, this.human_0, this.materials.rgb);

    }
}
