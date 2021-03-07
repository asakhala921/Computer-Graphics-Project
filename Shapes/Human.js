import {defs, tiny} from '/examples/common.js';

const {
    Mat4, Shape
} = tiny;
const {Cube, Subdivision_Sphere} = defs;

import Weapon_A from '/Shapes/Weapon_A.js'

export default class Human extends Shape {
    constructor() {
        super("position", "normal", "texture_coord");
        Cube.insert_transformed_copy_into(this, [], Mat4.identity()
            .times(Mat4.translation(-3, 0, 0))
            .times(Mat4.rotation(10, 0, 0, 5))
            .times(Mat4.scale(3, 1, 1)));
        Cube.insert_transformed_copy_into(this, [], Mat4.identity()
            .times(Mat4.translation(3, 0, 0))
            .times(Mat4.rotation(-10, 0, 0, 5))
            .times(Mat4.scale(3, 1, 1)));
        Subdivision_Sphere.insert_transformed_copy_into(this, [3], Mat4.identity()
            .times(Mat4.translation(0, 0, 0))
            .times(Mat4.scale(1,1,1))
            .times(Mat4.translation(0, 3.8, 0)));
        Subdivision_Sphere.insert_transformed_copy_into(this, [3], Mat4.identity()
            .times(Mat4.scale(2,4,2))
            .times(Mat4.translation(0, 0, 0)));
        Subdivision_Sphere.insert_transformed_copy_into(this, [3], Mat4.identity()
            .times(Mat4.scale(1,2,1))
            .times(Mat4.translation(0, -2, 0))
            .times(Mat4.translation(0, 2, 0))
            .times(Mat4.rotation(10,0,0,5))
            .times(Mat4.translation(0,2,0)));
        Subdivision_Sphere.insert_transformed_copy_into(this, [3], Mat4.identity()
            .times(Mat4.scale(1,2,1))
            .times(Mat4.translation(0, -2, 0))
            .times(Mat4.translation(0, 2, 0))
            .times(Mat4.rotation(10,0,0,-5))
            .times(Mat4.translation(0,2,0)));
        let weapon_transformation =  Mat4.identity().
        times(Mat4.translation(-5,-3,0));
        Weapon_A.insert_transformed_copy_into( this, [],  weapon_transformation);
    }

    attack(){

    }
}