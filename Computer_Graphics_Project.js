import {defs, tiny} from '/examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;
const {Triangle, Square, Cube, Subdivision_Sphere, Textured_Phong} = defs;


class Human extends Shape {
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

class Weapon_A extends Shape {
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


class Player {
    constructor(){
        this.shapes = {
            human: new Human(),
        }

        this.materials = {
           rgb: new Material(new Textured_Phong(), {
                color: color(1, 1, 1, 1),
                ambient: .4, diffusivity: 0.2, specularity: 0.3,
                texture: new Texture("assets/rgb.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
        }
    }
   
    draw(context, program_state) {
        this.human_0 = Mat4.identity()
            .times(Mat4.scale(5, 5, 5));
        this.shapes.human.draw(context, program_state, this.human_0, this.materials.rgb);

    }

}


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
class Bullet{
    constructor(){
        this.shapes = {
            ball: new  defs.Subdivision_Sphere(4)
        }
        this.materials = {
            sun: new Material(new defs.Phong_Shader(),
                {ambient: 1.0, color: color(1,0,0,1)})
        }
        this.m1 = Mat4.identity().times(Mat4.translation(0, 25, 0));
        this.m2 = this.m1.times(Mat4.translation(0, 0, -10));
        this.mBig = (this.m2).times(Mat4.scale(5, 5, 5));
    }

    
    draw(context, program_state, offset) {
        var newM = this.mBig.times(offset);
        this.shapes.ball.draw(context, program_state, newM, this.materials.sun);
    }
}

class World {
    constructor(){
        this.shapes = {
            floor: new Floor(),
            cube: new Cube(),
        }

        this.materials = {
            explode: new Material(new defs.Fake_Bump_Map(1), {
                ambient: 1,
                texture: new Texture("assets/explosion.png")
            }),
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
        //console.log("this front wall is "+this.frontWall);
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



    draw(context, program_state, collision) {
        this.shapes.floor.draw(context, program_state)
        if(collision){
            this.shapes.cube.draw(context, program_state, this.frontWall, this.materials.explode)
        }
        else{
            this.shapes.cube.draw(context, program_state, this.frontWall, this.materials.sky)
        }
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
        this.player = new Player();
        this.initial_camera_location = Mat4.look_at(vec3(0, 20, 40), vec3(0, 20, 0), vec3(0, 1, 0));
        this.bullets = [];
        for(var i=0; i<6; i++){
            this.bullets.push(new Bullet());
        }
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

        const myT = program_state.animation_time / 1000, dmyT = program_state.animation_delta_time / 1000;
        var dist1 = (myT*10)%58;
        var pos1= Mat4.identity().times(Mat4.translation(0, 0, -dist1));
        this.bullets[0].draw(context, program_state, pos1);

        var collision = false;
        if(dist1>=50){
            collision = true;}
        this.world.draw(context, program_state, collision);
        this.player.draw(context, program_state);

        
    }
}