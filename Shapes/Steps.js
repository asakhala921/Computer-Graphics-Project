import {defs, tiny} from '/examples/common.js';

const {
    Mat4, Shape
} = tiny;
const {Cube } = defs;

const MAP_SIZE = 512;

export default class Steps {
    constructor() {
        this.shapes = {
            step: new Cube(),
        }

    }

    set_cube_height(transform, program_state) {
        if(!program_state.floor_height) return;
        let x_start = transform[0][3]
        let z_start = transform[2][3]

        let x_scale = transform[0][0]
        let z_scale = transform[2][2]
        let y_position = transform[1][3] + transform[1][1]
        for (let row = x_start - x_scale; row < x_start + x_scale; row += 1) {
            for (let column = z_start - z_scale; column < z_start + z_scale; column += 1) {
                let curr_height = program_state.floor_height[MAP_SIZE/2 + row][MAP_SIZE/2 + column]
                if (curr_height < y_position)
                    program_state.floor_height[MAP_SIZE/2 + row][MAP_SIZE/2 + column] = y_position
            }
        }
    }

    draw(context, program_state, transform, material) {

        this.step = transform
            .times(Mat4.scale(5, 1, 5))
        this.shapes.step.draw(context, program_state, this.step, material)
        this.set_cube_height(this.step, program_state)

        this.step2 = transform
            .times(Mat4.translation(0, 1/1.25, -2))
            .times(Mat4.scale(5, 1, 5))
        this.shapes.step.draw(context, program_state, this.step2, material)
        this.set_cube_height(this.step2, program_state)

        this.step2 = transform
            .times(Mat4.translation(0, 2/1.25, -4))
            .times(Mat4.scale(5, 1, 5))
        this.shapes.step.draw(context, program_state, this.step2, material)
        this.set_cube_height(this.step2, program_state)

        this.step2 = transform
            .times(Mat4.translation(0, 3/1.25, -6))
            .times(Mat4.scale(5, 1, 5))
        this.shapes.step.draw(context, program_state, this.step2, material)
        this.set_cube_height(this.step2, program_state)
    }
}