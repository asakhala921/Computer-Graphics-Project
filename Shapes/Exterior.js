import {defs, tiny} from '/examples/common.js';

const {
    Mat4, Shape,
} = tiny;
const {Cube} = defs;
import Half_Torus from '../Shapes/Half_Torus.js'

export default class Exterior extends Shape {
    constructor() {
        let stageSize = 25
        let offSet = 10
        super("position", "normal", "texture_coord");
        Half_Torus.insert_transformed_copy_into(this, [10, 10, [[0, 2], [0, 2]]], Mat4.translation(0, 6, stageSize + offSet).times(Mat4.rotation(Math.PI,0,0,Math.PI).times(Mat4.scale(12,4,5)))) // Top
        //Cube.insert_transformed_copy_into(this, [], Mat4.translation(0,6, stageSize + offSet).times(Mat4.scale(5,1,1))) // Blocky Roof
        Cube.insert_transformed_copy_into(this, [], Mat4.translation(6,0, stageSize + offSet).times(Mat4.scale(1,6,1))) //Right Pillar
        Cube.insert_transformed_copy_into(this, [], Mat4.translation(-6,0, stageSize + offSet).times(Mat4.scale(1,6,1))) //Left Pillar

        Cube.insert_transformed_copy_into(this, [], Mat4.translation(-(stageSize + offSet)/2 - 3,0, stageSize + offSet).times(Mat4.scale((stageSize + offSet)/2 - 3,5,.5))) //Left-Front Wall
        Cube.insert_transformed_copy_into(this, [], Mat4.translation((stageSize + offSet)/2 + 3,0, stageSize + offSet).times(Mat4.scale((stageSize + offSet)/2 - 3,5,.5))) //Left-Front Wall
        Cube.insert_transformed_copy_into(this, [], Mat4.translation(0,0, -(stageSize + offSet)).times(Mat4.scale((stageSize + offSet),5,.5))) //Back Wall
        Cube.insert_transformed_copy_into(this, [], Mat4.translation(-(stageSize + offSet),0, 0).times(Mat4.scale(.5,5,(stageSize + offSet)))) //Left Wall
        Cube.insert_transformed_copy_into(this, [], Mat4.translation((stageSize + offSet),0, 0).times(Mat4.scale(.5,5,(stageSize + offSet)))) //Right Wall

        Cube.insert_transformed_copy_into(this, [], Mat4.translation((stageSize + offSet),0, (stageSize + offSet)).times(Mat4.scale(.5,10, .5))) //Front-Right Corner
        Cube.insert_transformed_copy_into(this, [], Mat4.translation(-(stageSize + offSet),0, (stageSize + offSet)).times(Mat4.scale(.5,10, .5))) //Front-Left Corner
        Cube.insert_transformed_copy_into(this, [], Mat4.translation((stageSize + offSet),0, -(stageSize + offSet)).times(Mat4.scale(.5,10, .5))) //Back-Right Corner
        Cube.insert_transformed_copy_into(this, [], Mat4.translation(-(stageSize + offSet),0, -(stageSize + offSet)).times(Mat4.scale(.5,10, .5))) //Back-Left Corner
    }
}