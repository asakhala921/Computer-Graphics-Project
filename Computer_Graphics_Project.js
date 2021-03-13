import {defs, tiny} from '/examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;
const {Triangle, Square, Cube, Subdivision_Sphere, Textured_Phong, Surface_Of_Revolution} = defs;

import Shape_From_File from '/Shapes/Shape_From_File.js';
import Arena from '/Shapes/Arena.js';
import World from '/Shapes/World.js';
import Player from '/Shapes/Player.js';

const MAP_SIZE = 512;
const HEIGHT_MAP_SIZE = 100;

class Bullet{
    constructor(){
        this.shapes = {
            ball: new  defs.Subdivision_Sphere(4),
            sword: new Shape_From_File("../assets/Single-handed_longsword.obj")
        }
        this.materials = {
            sun: new Material(new defs.Textured_Phong(1), {
                ambient: 1.0,
                color: hex_color("#000000"),
                texture: new Texture("../assets/stars.png")
            }),
        }
        this.m1 = Mat4.identity().times(Mat4.translation(0, 25, 0));
        this.m2 = this.m1.times(Mat4.translation(0, 0, -10));
        this.mBig = (this.m2).times(Mat4.scale(5, 5, 5));
    }


    draw(context, program_state, offset) {
        var newM = this.mBig.times(offset);

        this.shapes.sword.draw(context, program_state, newM, this.materials.sun);
    }
}

export class Computer_Graphics_Project extends Scene{
    constructor(){
        super();

        this.shapes = {
            platform: new defs.Capped_Cylinder(1, 10, [[0, 2], [0, 1]]),
        }
        this.view = "third";
        this.world = new World();
        this.arena = new Arena();
        this.player = new Player();
        this.initial_camera_location = Mat4.look_at(vec3(0, 20, 40), vec3(0, 20, 0), vec3(0, 1, 0));
        this.bullets = [];


        for(var i=0; i<6; i++){
            this.bullets.push(new Bullet());
        }
    }

    get_current_ground_height(row, column) {
        return this.world.ground.heights[Math.floor((MAP_SIZE/2 + row) / MAP_SIZE * HEIGHT_MAP_SIZE)][Math.floor((MAP_SIZE/2 + column) / MAP_SIZE * HEIGHT_MAP_SIZE)]
    }

    get_ground_heights(program_state) {
        if(!this.world.ground.heights) return;
        let floor_height = []
        for (let row = -MAP_SIZE/2; row < MAP_SIZE/2; row += 1) {
            let rowArray = []
            for (let column = -MAP_SIZE/2; column < MAP_SIZE/2; column += 1) {
                rowArray.push(this.get_current_ground_height(row, column))
            }
            floor_height.push(rowArray)
        }
        program_state.floor_height = floor_height;
    }

    third_person_view(player, program_state) {
        const theta = player.rotation[1] * 180
        const x_offset = 30 * Math.sin(2 * Math.PI / 360 * theta)
        const y_offset = 30 * Math.sin(2 * Math.PI / 360 * 20)
        const z_offset = 30 * Math.cos(2 * Math.PI / 360 * theta)

        let camera_position = Vector.of(0,0,0)
        camera_position[0] = player.position[0] + x_offset
        camera_position[1] = player.position[1] + y_offset
        camera_position[2] = player.position[2] + z_offset

        program_state.set_camera(Mat4.look_at(
            camera_position, player.position, Vector.of(0, 1, 0)
        ))
    }

    first_person_view(player, program_state) {
        const theta = -player.rotation[1] * 180
        const x_offset = 30 * Math.sin(2 * Math.PI / 360 * theta)
        const y_offset = 30 * Math.sin(2 * Math.PI / 360 * 20)
        const z_offset = 30 * Math.cos(2 * Math.PI / 360 * theta)
        let camera_position = Vector.of(0,0,0)
        camera_position[0] = player.position[0] - 2
        camera_position[1] = player.position[1] + 4
        camera_position[2] = player.position[2] - 2
        let look_at_position = Vector.of(0,0,0)
        look_at_position[0] = x_offset
        look_at_position[1] = y_offset
        look_at_position[2] = z_offset

        program_state.set_camera(Mat4.look_at(
            camera_position, look_at_position,Vector.of(0, 1, 0)
        ))
    }


    make_control_panel() {
        this.key_triggered_button("Player Forward", ["i"], () => this.player.current_speed = -this.player.run_speed, undefined, () => this.player.current_speed = 0);
        this.key_triggered_button("Player Backwards", ["k"], () => this.player.current_speed = this.player.run_speed, undefined, () => this.player.current_speed = 0);
        this.key_triggered_button("Player Left", ["j"], () => this.player.current_turn_speed = this.player.turn_speed, undefined, () => this.player.current_turn_speed = 0);
        this.key_triggered_button("Player Right", ["l"], () => this.player.current_turn_speed = -this.player.turn_speed, undefined, () => this.player.current_turn_speed = 0);
        this.key_triggered_button("First-Person", ["4"], () => this.view = "first");
        this.key_triggered_button("Third-Person", ["5"], () => this.view = "third");
    }

    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }
        if (this.view == "third")
            this.third_person_view(this.player, program_state)
        if (this.view == "first")
            this.first_person_view(this.player, program_state)

        if(!program_state.floor_height)
            this.get_ground_heights(program_state)
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        const light_position = vec4(75, 75, 75, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 10000)];

        const myT = program_state.animation_time / 1000, dmyT = program_state.animation_delta_time / 1000;
        var dist1 = (myT*10)%58;
        var pos1= Mat4.identity().times(Mat4.translation(0, 0, -dist1));
        //this.bullets[0].draw(context, program_state, pos1);

        var collision = false;
        //if(dist1>=50){
            //collision = true;}
        this.player.setMovement(program_state)
        this.world.draw(context, program_state, collision);
        this.player.draw(context, program_state);
        this.arena.draw(context, program_state);

    }
}

