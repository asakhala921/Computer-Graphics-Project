import {defs, tiny} from '/examples/common.js';

const {
    Mat4, Shape
} = tiny;
const {Cube } = defs;

export default class Steps extends Shape {
    constructor() {
        super("position", "normal", "texture_coord");
        this.drawSteps(Mat4.identity()); //right
    }

    drawSteps(transform) {
        Cube.insert_transformed_copy_into(this, [], transform.times(Mat4.scale(5,1,5)));
        Cube.insert_transformed_copy_into(this, [], transform.times(Mat4.translation(0,1/1.25,-2)).times(Mat4.scale(5,1,5)));
        Cube.insert_transformed_copy_into(this, [], transform.times(Mat4.translation(0,2/1.25, -4)).times(Mat4.scale(5,1,5)));
        Cube.insert_transformed_copy_into(this, [], transform.times(Mat4.translation(0,3/1.25, -6)).times(Mat4.scale(5,1,5)));
    }
}