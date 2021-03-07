import {defs, tiny} from '/examples/common.js';

const {
    hex_color, Mat4, Material, Texture
} = tiny;
const {Cube} = defs;
import Steps from '../Shapes/Steps.js'
import Exterior from '../Shapes/Exterior.js'

export default class Arena {
    constructor() {
        this.stageSize = 25
        this.pathLength = 40

        this.shapes = {
            exterior: new Exterior(),
            stage: new Cube(),
            path: new Cube(),
            wall: new Cube(),
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

    draw(context, program_state) {
        let transform = Mat4.identity()
        transform = transform.times(Mat4.translation(0, 10, 0))

        this.stage = transform
            .times(Mat4.scale(this.stageSize, 4, this.stageSize))
        this.shapes.stage.draw(context, program_state, this.stage, this.materials.concrete)
        this.steps = transform
            .times(Mat4.translation(0, 0, this.stageSize + 4))
        this.shapes.steps.draw(context, program_state, this.steps, this.materials.concrete)
        this.exterior = transform
        this.shapes.exterior.draw(context, program_state, this.exterior, this.materials.concrete)

        this.path = this.steps
            .times(Mat4.translation(0,0,this.pathLength + 5))
            .times(Mat4.scale(5,1,this.pathLength))
        this.shapes.path.draw(context, program_state, this.path, this.materials.concrete)

    }
}