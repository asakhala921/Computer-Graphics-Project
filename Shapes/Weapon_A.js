import {defs, tiny} from '/examples/common.js';

const {
    Mat4, Shape
} = tiny;
const {Cube} = defs;

export default class Weapon_A extends Shape {
    constructor() {
        super("position", "normal", "texture_coord");
        let cube_transform = {};
        for(var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                cube_transform = Mat4.identity().times(Mat4.scale(0.4, 0.4, 0.4));
                for(var k = 0; k < 8; k++) {
                    cube_transform = cube_transform
                        .times(Mat4.scale(1, 1, 1))
                        .times(Mat4.rotation(i*5, 0, 2, j+0.5))
                        .times(Mat4.translation(i, 2, j));
                    Cube.insert_transformed_copy_into( this, [], cube_transform );
                }
            }
        }
    }
}