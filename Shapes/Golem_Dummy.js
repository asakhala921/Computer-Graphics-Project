import {defs, tiny} from '/examples/common.js';

const {
    color, Mat4, Material, Texture, Vector, hex_color
} = tiny;
const {Textured_Phong} = defs;

import Shape_From_File from '/Shapes/Shape_From_File.js';


export default class Golem_Dummy {
    constructor(position = Vector.of(0, 15, 100)){
        this.shapes = {
            golem: new Shape_From_File("../assets/baymax/Bigmax_White_OBJ.obj")
        }

        this.materials = {
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .6, diffusivity: .8, color: hex_color("#ffffff")}),
        }


    }


    draw(context, program_state) {
        this.dummy = Mat4.identity()
            .times(Mat4.translation(0,20,0))
            .times(Mat4.scale(3,3,3))
        this.shapes.golem.draw(context, program_state, this.dummy, this.materials.plastic);

    }
}
