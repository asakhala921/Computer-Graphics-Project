import {defs, tiny} from '/examples/common.js';

const {
    color, Mat4, Material, Texture, Vector
} = tiny;
const {Textured_Phong} = defs;

import Human from '/Shapes/Human.js'


export default class Player {
    constructor(position = Vector.of(0, 15, 70)){
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

        this.position = position
        this.rotation = Vector.of(0, 180, 0)
        this.run_speed = 30;
        this.turn_speed = 1;
        this.current_speed = 0;
        this.current_turn_speed = 0;
        this.gravity = -30;
        this.upwards_speed = 0
    }

    setMovement(program_state, height_map) {
        const dt = program_state.animation_delta_time / 1000;
        this.rotation = this.rotation.plus(Vector.of(0, this.current_turn_speed * dt, 0))
        const x = this.current_speed * dt * Math.sin(Math.PI * this.rotation[1]);
        const z = this.current_speed * dt * Math.cos(Math.PI * this.rotation[1]);
        let terrain_height = 0
        this.upwards_speed += this.gravity * dt
        this.position = this.position.plus(Vector.of(x, this.upwards_speed, z))
        if(height_map) {
           terrain_height = (height_map[Math.floor((256 + this.position[0]) / 2)][Math.floor((256 + this.position[2]) / 2)])
        }

        if (this.position[1] < terrain_height + 5) {
            this.upwards_speed = 0
            this.position[1] = terrain_height + 5
        }




    }

    draw(context, program_state) {
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        this.human_0 = Mat4.identity()
            .times(Mat4.scale(1,1 , 1))
            .times(Mat4.translation(this.position[0], this.position[1], this.position[2]))
            .times(Mat4.rotation(Math.PI * this.rotation[1], 0, 1, 0))
        this.shapes.human.draw(context, program_state, this.human_0, this.materials.rgb);

    }
}
