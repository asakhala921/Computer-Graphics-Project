import {defs, tiny} from '/examples/common.js';

const {
    color, Mat4, Material, Texture, Vector, hex_color
} = tiny;
const {Textured_Phong} = defs;

import Shape_From_File from '/Shapes/Shape_From_File.js';
const MAP_SIZE = 512;
const HEIGHT_MAP_SIZE = 100;

export default class Player {
    constructor(position = Vector.of(0, 15, 100)){
        this.shapes = {
            sphere: new  defs.Subdivision_Sphere(3),
            torso: new Shape_From_File("../assets//baymax/baymax_belly.obj"),
            left_leg: new Shape_From_File("../assets/baymax/baymax_leftleg.obj"),
            right_leg: new Shape_From_File("../assets/baymax/baymax_rightleg.obj"),
            head: new Shape_From_File("../assets/baymax/baymax_head.obj"),
            right_arm: new Shape_From_File("../assets/baymax/baymax_rightarm.obj"),
            left_arm: new Shape_From_File("../assets/baymax/baymax_leftarm.obj"),


        }

        this.materials = {
            rgb: new Material(new Textured_Phong(), {
                color: color(1, 1, 1, 1),
                ambient: .4, diffusivity: 0.2, specularity: 0.3,
                texture: new Texture("assets/rgb.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .6, diffusivity: .8, color: hex_color("#ffffff")}),
        }

        this.position = position
        this.rotation = Vector.of(0, 180, 0)
        this.run_speed = 30;
        this.turn_speed = 1;
        this.current_speed = 0;
        this.current_turn_speed = 0;
        this.gravity = -5;
        this.upwards_speed = 0;
        this.arm_lift_time = 0;
        this.arm_lift = false;
        this.is_jumping = false;
    }

    setMovement(program_state) {
        if(!program_state.floor_height) return
        const dt = program_state.animation_delta_time / 1000;
        this.rotation = this.rotation.plus(Vector.of(0, this.current_turn_speed/2 * dt, 0))
        const x = this.current_speed * dt * Math.sin(Math.PI * this.rotation[1]);
        const z = this.current_speed * dt * Math.cos(Math.PI * this.rotation[1]);
        this.upwards_speed += this.gravity * dt

        this.position = this.position.plus(Vector.of(x, this.upwards_speed, z))
        const current_height = program_state.floor_height[Math.floor(MAP_SIZE/2 + this.position[0])][Math.floor(MAP_SIZE/2 + this.position[2])]

        if (this.position[1] < current_height + 5) {
            this.upwards_speed = 0
            this.is_jumping = false;
            this.position[1] = current_height + 5
        }
        program_state.current_position = this.position
    }

    fire() {
        this.arm_lift_time = 25;
        this.arm_lift = true;
    }

    jump() {
        if(!this.is_jumping) {
            this.upwards_speed = 2;
            this.is_jumping = true;
        }

    }

    draw(context, program_state) {
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        this.player_object = Mat4.identity()
            .times(Mat4.scale(1,1 , 1))
            .times(Mat4.translation(this.position[0], this.position[1], this.position[2]))
            .times(Mat4.rotation(Math.PI * this.rotation[1], 0, 1, 0))
        this.limb_angle = program_state.player.current_speed
            ? (Math.PI / 3) * Math.sin(program_state.animation_time / 100)
            : 0;
        this.lift_arm_angle = (Math.PI / 3) * Math.sin(5)

        this.left_arm = this.player_object
            .times(Mat4.translation(-1.6, 0.25, 0))
            .times(Mat4.scale(-1, 1, -1));

        if(this.arm_lift) {
            if (this.arm_lift_time == 0) {
                this.arm_lift = false;
            } else {
                this.arm_lift_time--;
            }

            this.left_arm = this.left_arm
                .times(Mat4.rotation(this.lift_arm_angle, 1,0,0))
                .times(Mat4.translation(0,-5,2.5))
        } else {
            this.left_arm = this.left_arm
                .times(Mat4.rotation(this.limb_angle/8, 0,1,0))

        }
        this.shapes.left_arm.draw(context, program_state, this.left_arm, this.materials.plastic)

        this.right_arm = this.player_object
            .times(Mat4.rotation(this.limb_angle/8, 0,1,0))
            .times(Mat4.translation(1.6, .25, 0))
            .times(Mat4.scale(-1, 1, -1));
        this.shapes.right_arm.draw(context, program_state, this.right_arm, this.materials.plastic)

        this.left_leg = this.player_object
            .times(Mat4.scale(-.75,.75,-.75))
            .times(Mat4.translation(1, -2, 0))
            .times(Mat4.rotation(this.limb_angle/3, 1,0,0))
        this.shapes.left_leg.draw(context, program_state, this.left_leg, this.materials.plastic)

        this.right_leg = this.player_object
            .times(Mat4.scale(-.75,.75,-.75))
            .times(Mat4.translation(-1, -2, 0))
            .times(Mat4.rotation(this.limb_angle/3, 1,0,0))
        this.shapes.right_leg.draw(context, program_state, this.right_leg, this.materials.plastic)

        this.torso = this.player_object
            .times(Mat4.scale(1.5,1.5,-1.5))
            .times(Mat4.translation(0, 1, 0));
        this.shapes.torso.draw(context, program_state, this.torso, this.materials.plastic)

        this.head = this.player_object
            .times(Mat4.translation(0, 3.3, 0))
            .times(Mat4.scale(.5,.5,.5))
        this.shapes.head.draw(context, program_state, this.head, this.materials.plastic)
    }
}
