import {defs, tiny} from '/examples/common.js';

const {
    vec3, Mat4, Shape,
} = tiny;
const {Surface_Of_Revolution} = defs;

export default class Half_Torus extends Shape {
    // Build a donut shape.  An example of a surface of revolution.
    constructor(rows, columns, texture_range=[[0, 1], [0, 1]]) {
        super("position", "normal", "texture_coord");
        const circle_points = Array(rows).fill(vec3(1 / 3, 0, 0))
            .map((p, i, a) => Mat4.translation(-1/3, 0, 0)
                .times(Mat4.rotation(i / (a.length - 1) * 2 * Math.PI, 0, -1, 0))
                .times(Mat4.scale(1, 1, 3))
                .times(p.to4(1)).to3());
        Surface_Of_Revolution.insert_transformed_copy_into(this, [rows, columns, circle_points, texture_range, 3.2]);
    }
}