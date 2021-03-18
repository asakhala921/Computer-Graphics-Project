import {defs, tiny} from '/examples/common.js';

const {
    Mat4, Shape,
} = tiny;
const {Cube} = defs;
import Half_Torus from '../Shapes/Half_Torus.js'

export default class Exterior extends Shape {
    constructor() {
        let stageSize = 50
        let offSet = 10
        super("position", "normal", "texture_coord");
        Half_Torus.insert_transformed_copy_into(this, [10, 10, [[0, 2], [0, 2]]], Mat4.translation(0, 14, stageSize + offSet).times(Mat4.rotation(Math.PI,0,0,Math.PI).times(Mat4.scale(15,4,5)))) // Top
        //Cube.insert_transformed_copy_into(this, [], Mat4.translation(0,14, stageSize + offSet).times(Mat4.scale(5,1,1))) // Blocky Roof
        Cube.insert_transformed_copy_into(this, [], Mat4.translation(8,0, stageSize + offSet).times(Mat4.scale(1,14,1))) //Right Pillar
        Cube.insert_transformed_copy_into(this, [], Mat4.translation(-8,0, stageSize + offSet).times(Mat4.scale(1,14,1))) //Left Pillar

        Cube.insert_transformed_copy_into(this, [], Mat4.translation(-(stageSize + offSet)/2 - 4,0, stageSize + offSet).times(Mat4.scale((stageSize + offSet)/2 - 4,8,.5))) //Left-Front Wall
        Cube.insert_transformed_copy_into(this, [], Mat4.translation((stageSize + offSet)/2 + 4,0, stageSize + offSet).times(Mat4.scale((stageSize + offSet)/2 - 4,8,.5))) //Left-Front Wall
        Cube.insert_transformed_copy_into(this, [], Mat4.translation(0,0, -(stageSize + offSet)).times(Mat4.scale((stageSize + offSet),8,.5))) //Back Wall
        Cube.insert_transformed_copy_into(this, [], Mat4.translation(-(stageSize + offSet),0, 0).times(Mat4.scale(.5,8,(stageSize + offSet)))) //Left Wall
        Cube.insert_transformed_copy_into(this, [], Mat4.translation((stageSize + offSet),0, 0).times(Mat4.scale(.5,8,(stageSize + offSet)))) //Right Wall

        Cube.insert_transformed_copy_into(this, [], Mat4.translation((stageSize + offSet),0, (stageSize + offSet)).times(Mat4.scale(.5,15, .5))) //Front-Right Corner
        Cube.insert_transformed_copy_into(this, [], Mat4.translation(-(stageSize + offSet),0, (stageSize + offSet)).times(Mat4.scale(.5,15, .5))) //Front-Left Corner
        Cube.insert_transformed_copy_into(this, [], Mat4.translation((stageSize + offSet),0, -(stageSize + offSet)).times(Mat4.scale(.5,15, .5))) //Back-Right Corner
        Cube.insert_transformed_copy_into(this, [], Mat4.translation(-(stageSize + offSet),0, -(stageSize + offSet)).times(Mat4.scale(.5,15, .5))) //Back-Left Corner
    }
}