import {defs, tiny} from '/examples/common.js';

const {
    hex_color, Mat4, Material, Texture
} = tiny;
const {Cube} = defs;
import Steps from '../Shapes/Steps.js'
import Exterior from '../Shapes/Exterior.js'

const MAP_SIZE = 512;

export default class Arena {
    constructor() {
        this.stageSize = 26
        this.pathLength = 40

        this.shapes = {
            exterior: new Exterior(),
            stage: new Cube(),
            path: new Cube(),
            steps: new Steps(),
        }
        this.shapes.stage.arrays.texture_coord.forEach(p => p.scale_by(10))
        this.shapes.path.arrays.texture_coord.forEach(p => p.scale_by(4))
        this.materials = {
            concrete: new Material(new defs.Fake_Bump_Map(1), {
                color: hex_color("#000000"),
                ambient: .75, diffusivity: .4, specularity: 0.1,
                texture: new Texture("../assets/concrete.png")
            }),
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

    draw(context, program_state) {
        let transform = Mat4.identity()
        transform = transform.times(Mat4.translation(0, 10, 0))
        this.stage = transform
            .times(Mat4.scale(this.stageSize, 4, this.stageSize))
        this.set_cube_height(this.stage, program_state)
        this.shapes.stage.draw(context, program_state, this.stage, this.materials.concrete)

        this.steps = transform
            .times(Mat4.translation(0, 0, this.stageSize + 4))
        this.shapes.steps.draw(context, program_state, this.steps, this.materials.concrete)

        this.exterior = transform
        this.shapes.exterior.draw(context, program_state, this.exterior, this.materials.concrete)

        this.path = this.steps
            .times(Mat4.translation(0,0,this.pathLength + 5))
            .times(Mat4.scale(5,1,this.pathLength))
        this.set_cube_height(this.path, program_state)
        this.shapes.path.draw(context, program_state, this.path, this.materials.concrete)

    }
}