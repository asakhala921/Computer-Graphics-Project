import {defs, tiny} from '/examples/common.js';

const {
    color, Mat4, Material, Texture, Vector, hex_color
} = tiny;
const {Textured_Phong, Cube} = defs;

import Shape_From_File from '/Shapes/Shape_From_File.js';


export default class Golem_Dummy {
    constructor(position = Vector.of(0, 15, 100)){
        this.shapes = {
            golem: new Shape_From_File("../assets/baymax/Bigmax_White_OBJ.obj"),
            cube: new defs.Cube(),
        }

        this.materials = {
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .6, diffusivity: .8, color: hex_color("#ffffff")}),
        }

        this.golem_position = Vector.of(0,20,0)
        this.golem_width = 8
        this.golem_depth = 5
    }

    is_colliding(object_position) {
        let currX = object_position[0]
        let currZ = object_position[2]
        let golX = this.golem_position[0]
        let golZ = this.golem_position[2]
        if(currX > (golX - this.golem_width/2) && currX < (golX + this.golem_width/2)) {
            if(currZ > (golZ - this.golem_depth/2) && currZ < (golZ + this.golem_depth/2)) {
                console.log("COLLIDING")
            }
        }
    }



    draw(context, program_state) {
        if(!program_state.current_position) return
        this.dummy = Mat4.identity()
            .times(Mat4.translation(this.golem_position[0], this.golem_position[1], this.golem_position[2]))
            .times(Mat4.scale(3,3,3))
        this.shapes.golem.draw(context, program_state, this.dummy, this.materials.plastic);

        this.is_colliding((program_state.current_position))

    }
}
