import {defs, tiny} from '/examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;
const {Triangle, Square, Cube, Subdivision_Sphere} = defs;


class Wall extends Shape {
    constructor() {
        super("position", "normal", "texture_coord");
        this.drawLeg(Mat4.identity()); //right
        this.drawLeg(Mat4.rotation(Math.PI,0,0,1)); //left
        this.drawLeg(Mat4.rotation(Math.PI,1,1,0)); //up
        //this.drawLeg(Mat4.rotation(Math.PI,1,0,1)); //front
        //this.drawLeg(Mat4.rotation(Math.PI, -1,0,1)); //back
        this.drawLeg(Mat4.rotation(Math.PI, 1, -1,0)); //down

    }

    drawLeg(transform) {
        Cube.insert_transformed_copy_into(this, [], transform.times(Mat4.translation(.3,0,0)).times(Mat4.scale(.3,.1,.1)));
        Cube.insert_transformed_copy_into(this, [], transform.times(Mat4.translation(.6,.2,0)).times(Mat4.scale(.1,.3,.1)));
        Cube.insert_transformed_copy_into(this, [], transform.times(Mat4.translation(.6,-.2,0)).times(Mat4.scale(.1,-.3,.1)));
        //Cube.insert_transformed_copy_into(this, [], transform.times(Mat4.translation(.6,0,.2)).times(Mat4.scale(.1,.1,.3)));
        //Cube.insert_transformed_copy_into(this, [], transform.times(Mat4.translation(.6,0,-.2)).times(Mat4.scale(.1,.1,-.3)));
    }
}

class Floor {
    constructor() {
        this.size = 256
        this.max_height = 10;
        this.ground = new Material(new defs.Fake_Bump_Map(1), {
            ambient: .5,
            diffusivity: .8,
            texture: new Texture("assets/rock.jpg")
        })
        const row_operation = (s, p) => vec3(-1, 2 * s - 1, Math.random() / 2);
        const column_operation = (t, p, s) => vec3(2 * t - 1, 2 * s - 1, Math.random() / 2);
        this.shapes = {sheet: new defs.Grid_Patch(1, 1, row_operation, column_operation)};
    }

    draw(context, program_state) {

        this.floor = Mat4.identity()
            .times(Mat4.scale(this.size, this.size, this.size))
            .times(Mat4.rotation(Math.PI / 2, 1,0,0))
        ;
        this.shapes.sheet.draw(context, program_state, this.floor, this.ground);
    }
}

class World {
    constructor(){
        this.shapes = {
            floor: new Floor(),
            cube: new Cube(),
        }

        this.materials = {
            sky: new Material(new defs.Fake_Bump_Map(1), {
                ambient: 1,
                texture: new Texture("assets/clouds.png")
            }),
            ground: new Material(new defs.Fake_Bump_Map(1), {
                ambient: .5,
                diffusivity: .3,
                texture: new Texture("assets/rock.jpg")
            }),
        }
        this.size = 256;

        this.floor = Mat4.identity()
            .times(Mat4.scale(this.size, 1, this.size));
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
        this.shapes.floor.draw(context, program_state)
        this.shapes.cube.draw(context, program_state, this.frontWall, this.materials.sky)
        this.shapes.cube.draw(context, program_state, this.backWall, this.materials.sky)
        this.shapes.cube.draw(context, program_state, this.leftWall, this.materials.sky)
        this.shapes.cube.draw(context, program_state, this.rightWall, this.materials.sky)
        this.shapes.cube.draw(context, program_state, this.top, this.materials.sky)
    }
}

export class Computer_Graphics_Project extends Scene{
    constructor(){
        super();

        this.world = new World();

        this.initial_camera_location = Mat4.look_at(vec3(0, 20, 40), vec3(0, 20, 0), vec3(0, 1, 0));
    }
    make_control_panel() {

    }

    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        const light_position = vec4(50, 50, 50, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000000)];

        this.world.draw(context, program_state);
    }
}