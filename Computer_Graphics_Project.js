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

let SIZE = 256

class Steps extends Shape {
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

class Half_Torus extends Shape {
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


class Exterior extends Shape {
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


class Arena {
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
                texture: new Texture("assets/concrete.png")
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

class Floor {
    // Adapted from Grid_Patch
    constructor() {
        this.height_map = new Image();
        this.height_map.src = "/assets/island_heightmap.png";

        this.height_map.onload = () => {
            let canvas = document.createElement("canvas");
            canvas.width = this.height_map.width;
            canvas.height = this.height_map.height;
            let context = canvas.getContext('2d');
            context.drawImage(this.height_map, 0, 0);
            this.data = context.getImageData(0, 0, this.height_map.width, this.height_map.height);

            let rows = this.height_map.width;
            let columns = this.height_map.height;
            this.heights = new Array(rows);

            for (let r = 0; r < rows; r++) {
                this.heights[r] = new Array(columns);
            }

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < columns; c++) {
                    let height = this.getHeight(this.data, r, c);
                    this.heights[r][c] = height;
                }
            }

            const row_operation = (s, p) => {
                return vec3(-1, 1, 2 * s - 1);
            }
            const column_operation = (t, p, s) => {
                let height = this.heights[Math.floor(t * columns) - 1][Math.floor(s * rows) - 1]
                return vec3(2 * t - 1, height, 2 * s - 1);
            }
            this.shapes = {sheet: new defs.Grid_Patch(rows - 1, columns - 1, row_operation, column_operation, [[0, rows], [0, columns]])}
        }

        this.ground = new Material(new defs.Fake_Bump_Map(1), {
            ambient: .5,
            diffusivity: .2,
            texture: new Texture("assets/rock.jpg")
        })

    }

    getHeight(data, x, y) {
        let position = (x + data.width * y) * 4
        let scale = 150
        let r = data.data[position]
        let g = data.data[position + 1]
        let b = data.data[position + 2]
        let height = r/256 * g/256 * b/256;
        return height * scale;
    }

    draw(context, program_state) {
        if(!this.shapes) return;
        this.floor = Mat4.identity()
            .times(Mat4.scale(SIZE, 1, SIZE))
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

class Water {
    constructor() {
        this.shapes = {
            cube: new Cube(),
        }

        this.waterMaterial = new Material(new Water_Shader(1), {
            ambient: .4,
            diffusivity: 1,
            specularity: 0.8,
            texture: new Texture("assets/water.jpeg"),
            color: color(0, 0, 1, 1)
        })

        this.water = Mat4.identity()
            .times(Mat4.scale(SIZE, 5, SIZE))
    }

    draw(context, program_state) {
        this.shapes.cube.draw(context, program_state, this.water, this.waterMaterial)
    }
}

class World {
    constructor(){
        this.shapes = {
            cube: new Cube(),
        }
        this.water = new Water()
        this.floor = new Floor()

        this.materials = {
            explode: new Material(new defs.Fake_Bump_Map(1), {
                ambient: 1,
                texture: new Texture("assets/explosion.png")
            }),
            sky: new Material(new defs.Fake_Bump_Map(1), {
                ambient: 1,
                texture: new Texture("assets/clouds.png")
            }),
        }
        this.size = SIZE;

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
        this.water.draw(context, program_state)

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

        this.shapes = {
            platform: new defs.Capped_Cylinder(1, 10, [[0, 2], [0, 1]]),
        }
        this.world = new World();
        this.arena = new Arena();
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

        const light_position = vec4(75, 75, 75, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 10000)];

        const myT = program_state.animation_time / 1000, dmyT = program_state.animation_delta_time / 1000;
        var dist1 = (myT*10)%58;
        var pos1= Mat4.identity().times(Mat4.translation(0, 0, -dist1));
        this.bullets[0].draw(context, program_state, pos1);

        var collision = false;
        if(dist1>=50){
            collision = true;}
        this.world.draw(context, program_state, collision);
        this.player.draw(context, program_state);
        this.arena.draw(context, program_state);

    }
}

class Water_Shader extends defs.Textured_Phong {
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;

            void main(){
                // Sample the texture image in the correct place:
                vec4 tex_color = texture2D( texture, f_tex_coord );
                if( tex_color.w < .01 ) discard;
                // Slightly disturb normals based on sampling the same image that was used for texturing:
                vec3 bumped_N  = N + tex_color.rgb - .5*vec3(1,1,1);
                // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w );
                // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( bumped_N ), vertex_worldspace );
                gl_FragColor.a = 0.5;
              } `;

    }
}
