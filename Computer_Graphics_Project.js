import {defs, tiny} from '/examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;
const {Triangle, Square, Cube, Subdivision_Sphere, Textured_Phong, Surface_Of_Revolution} = defs;

import Shape_From_File from '/Shapes/Shape_From_File.js';
import Arena from '/Shapes/Arena.js';
import World from '/Shapes/World.js';
import Player from '/Shapes/Player.js';
import Golem from '/Shapes/Golem_Dummy.js';
import Text_Line from '/Shapes/Text_Line.js';

const MAP_SIZE = 512;
const HEIGHT_MAP_SIZE = 100;

class Bullet{
    constructor(px, py, pz, timestamp, angle){
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
        this.px = px;
        this.py = py;
        this.pz = pz;
        this.timestamp = timestamp;
        this.angle = angle;
        this.m1 = Mat4.identity().times(Mat4.translation(0, 25, 0)).times(Mat4.translation(3.6, -7, +100));
        //remember to undo-scaling
    }


    draw(context, program_state, currentTime) {
        var pos1 = this.px -(currentTime - this.timestamp)*50 * Math.sin(Math.PI * this.angle);
        var pos3 = this.pz -(currentTime - this.timestamp)*50 * Math.cos(Math.PI * this.angle);
        var currentPos = this.m1.times(Mat4.translation(pos1, this.py, pos3));
        var newM = currentPos.times(Mat4.rotation(Math.PI * this.angle, 0 ,1,0)).times(Mat4.scale(2, 2, 2));
        //console.log("mat is "+newM);
        this.shapes.sword.draw(context, program_state, newM, this.materials.sun);
        var opt = 0;
        if(pos1< -256){opt = 3;}
        if(pos1>256){opt =4;}
        if(pos3<-350){opt = 1;}
        if(pos3> 160){opt=2;}
        return opt;
    }
}

export class Computer_Graphics_Project extends Scene{
    constructor(){
        super();

        this.shapes = {
            platform: new defs.Capped_Cylinder(1, 10, [[0, 2], [0, 1]]),
            text: new Text_Line(),
            cube: new Cube(),
        }
        this.text_image = new Material(new defs.Textured_Phong(1), {
            ambient: 1, diffusivity: 0, specularity: 0,
            texture: new Texture("assets/text.png")
        });
        this.view = "third";
        this.world = new World();
        this.arena = new Arena();
        this.player = new Player();
        this.golem = new Golem();
        this.initial_camera_location = Mat4.look_at(vec3(0, 20, 40), vec3(0, 20, 0), vec3(0, 1, 0));
        this.bullets = [];
        this.position = Vector.of(0,0,0);
        this.fire = false;
        this.mouse_setup = false;
        this.cube = Mat4.identity()
            .times(Mat4.translation(0, 30, 0))
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
        const x_offset = 20 * Math.sin(2 * Math.PI / 360 * theta)
        const y_offset = 30 * Math.sin(2 * Math.PI / 360 * 20)
        const z_offset = 20 * Math.cos(2 * Math.PI / 360 * theta)

        let camera_position = Vector.of(0,0,0)
        camera_position[0] = player.position[0] + x_offset
        camera_position[1] = player.position[1] + y_offset
        camera_position[2] = player.position[2] + z_offset

        const look_x_offset = 10 * Math.sin(2 * Math.PI / 360 * theta)
        const look_y_offset = 1 * Math.sin(2 * Math.PI / 360 * 20)
        const look_z_offset = 10 * Math.cos(2 * Math.PI / 360 * theta)
        let look_at_position = Vector.of(0,0,0)
        look_at_position[0] = player.position[0] - look_x_offset
        look_at_position[1] = player.position[1] - look_y_offset
        look_at_position[2] = player.position[2] - look_z_offset

        program_state.set_camera(Mat4.look_at(
            camera_position, look_at_position, Vector.of(0, 1, 0)
        ))
    }

    first_person_view(player, program_state) {
        const theta = -player.rotation[1] * 180
        const x_offset = 30 * Math.sin(2 * Math.PI / 360 * theta)
        const y_offset = 10 * Math.sin(2 * Math.PI / 360 * 20)
        const z_offset = 30 * Math.cos(2 * Math.PI / 360 * theta)
        let camera_position = Vector.of(0,0,0)
        camera_position[0] = player.position[0] + 5 * Math.sin(2 * Math.PI / 360 * theta)
        camera_position[1] = player.position[1] + 4 * Math.sin(2 * Math.PI / 360 * 20)
        camera_position[2] = player.position[2] - 3 * Math.cos(2 * Math.PI / 360 * theta)
        let look_at_position = Vector.of(0,0,0)
        look_at_position[0] = player.position[0] + x_offset
        look_at_position[1] = player.position[1] + y_offset
        look_at_position[2] = player.position[2] - z_offset

        program_state.set_camera(Mat4.look_at(
            camera_position, look_at_position,Vector.of(0, 1, 0)
        ))
    }

    setFire(program_state){
        this.fire = !this.fire;
        let bullet = {
            start: this.player.position,
            target: this.player.position,
            start_time: program_state.animation_time,
            end_time: program_state.animation_time + 10000
        }
        this.bullets.push(bullet)
        this.player.fire();
    }

    make_control_panel() {
        this.key_triggered_button("Player Forward", ["w"], () => this.player.current_speed = -this.player.run_speed, undefined, () => this.player.current_speed = 0);
        this.key_triggered_button("Player Backwards", ["s"], () => this.player.current_speed = this.player.run_speed, undefined, () => this.player.current_speed = 0);
        this.key_triggered_button("Player Left", ["a"], () => this.player.current_turn_speed = this.player.turn_speed, undefined, () => this.player.current_turn_speed = 0);
        this.key_triggered_button("Player Right", ["d"], () => this.player.current_turn_speed = -this.player.turn_speed, undefined, () => this.player.current_turn_speed = 0);
        this.key_triggered_button("Jump", [" "], () => this.player.jump())
        this.key_triggered_button("First-Person", ["4"], () => this.view = "first");
        this.key_triggered_button("Third-Person", ["5"], () => this.view = "third");
    }

    mouse_controls(canvas) {
        this.mouse_position = vec(0,0)
        const mouse_position = (event, rect = canvas.getBoundingClientRect()) => {
            this.mouse_position = vec(
                (event.clientX - (rect.left + rect.right) / 2) / ((rect.right - rect.left) / 2),
                (event.clientY - (rect.bottom + rect.top)/2) / ((rect.top - rect.bottom)/2)
            );

        }

        canvas.addEventListener("mousemove", e => {
            e.preventDefault()
            mouse_position(e)
        })

    }

    mouse_click(e, context, program_state) {
        let pos_ndc_near = vec4(this.mouse_position[0], this.mouse_position[1], -1.0, 1.0);
        let pos_ndc_far = vec4(this.mouse_position[0], this.mouse_position[1], 1.0, 1.0);
        let center_ndc_near = vec4(0.0, 0.0, -1.0, 1.0);
        let P = program_state.projection_transform
        let V = program_state.camera_inverse
        let pos_world_near = Mat4.inverse(P.times(V)).times(pos_ndc_near);
        let pos_world_far = Mat4.inverse(P.times(V)).times(pos_ndc_far);
        let center_world_near = Mat4.inverse(P.times(V)).times(center_ndc_near);
        pos_world_near.scale_by(1 / pos_world_near[3]);
        pos_world_far.scale_by(1 / pos_world_far[3]);
        center_world_near.scale_by(1 / center_world_near[1]);
        this.cube = Mat4.translation(pos_world_near[0], 20, pos_world_near[2])
    }


    display(context, program_state) {
        if (!this.mouse_setup) {
            this.mouse_controls(context.canvas);
            context.canvas.addEventListener("mousedown", e => {
                e.preventDefault()
                this.mouse_click(e, context, program_state)
                this.setFire(program_state)
            })
            this.mouse_setup = true
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
        //var pos1= Mat4.identity().times(Mat4.translation(0, 0, -dist1));
        //this.bullets[0].draw(context, program_state, dist1); //pos1

        this.player.setMovement(program_state)
        program_state.player = this.player
        
        this.player.draw(context, program_state);
        this.arena.draw(context, program_state);
        this.golem.draw(context, program_state);
        if(!this.player.position.equals(this.position)){
            //console.log(this.player.position);
            this.position = this.player.position;
        }

        this.shapes.cube.draw(context, program_state, this.cube, this.text_image)
 
        var option = 0;
        if(this.bullets.length > 0) {
            for(let i = 0; i < this.bullets.length; i++) {
                let bullet = this.bullets[i];
                //this.bullet.draw(context, program_state, )
            }
        }

        this.world.draw(context, program_state, option);
    }
}

