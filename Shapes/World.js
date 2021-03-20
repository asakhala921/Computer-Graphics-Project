import {defs, tiny} from '/examples/common.js';

const {
   Mat4,Material, Texture
} = tiny;
const {Cube, Subdivision_Sphere} = defs;

import Ground from '../Shapes/Ground.js';
import Water from '../Shapes/Water.js';

let SIZE = 256

export default class World {
    constructor(){
        this.shapes = {
            cube: new Cube(),
        }
        this.water = new Water()
        this.ground = new Ground()

        this.materials = {
            explode: new Material(new defs.Fake_Bump_Map(1), {
                ambient: 1,
                texture: new Texture("../assets/explosion.png")
            }),
            sky: new Material(new defs.Fake_Bump_Map(1), {
                ambient: 1,
                texture: new Texture("../assets/clouds.png")
            }),
        }
        this.size = SIZE;

        this.frontWall = Mat4.identity()
            .times(Mat4.translation(0,this.size/2,-this.size))
            .times(Mat4.scale(this.size, this.size, 1))
        this.backWall = Mat4.identity()
            .times(Mat4.translation(0,this.size/2,this.size))
            .times(Mat4.scale(this.size, this.size, 1))
        this.leftWall = Mat4.identity()
            .times(Mat4.translation(-this.size,this.size/2,0))
            .times(Mat4.scale(1, this.size, this.size))
        this.rightWall = Mat4.identity()
            .times(Mat4.translation(this.size,this.size/2,0))
            .times(Mat4.scale(1, this.size, this.size))
        this.top = Mat4.identity()
            .times(Mat4.translation(0,this.size,0))
            .times(Mat4.scale(this.size, 1, this.size))
    }



    draw(context, program_state) {
        this.ground.draw(context, program_state)
        this.water.draw(context, program_state)

        this.shapes.cube.draw(context, program_state, this.frontWall, this.materials.sky);
        this.shapes.cube.draw(context, program_state, this.backWall, this.materials.sky);
        this.shapes.cube.draw(context, program_state, this.leftWall, this.materials.sky);
        this.shapes.cube.draw(context, program_state, this.rightWall, this.materials.sky);

        this.shapes.cube.draw(context, program_state, this.top, this.materials.sky)

    }
}