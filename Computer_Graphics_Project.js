import {defs, tiny} from '/examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;
const {Triangle, Square, Cube} = defs;

let SIZE = 100

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

class Water {
    constructor() {
        this.shapes = {
            cube: new Cube(),
        }

        this.waterMaterial = new Material(new Water_Shader(2), {
            ambient: 1,
            diffusivity: 0.2,
            specularity: 0.8,
            texture: new Texture("assets/water.jpeg"),
            color: color(1, 1, 1, 1)
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
            sky: new Material(new defs.Fake_Bump_Map(1), {
                ambient: 1,
                texture: new Texture("assets/clouds.png")
            }),
        }
        this.size = SIZE;

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
        this.floor.draw(context, program_state)
        this.water.draw(context, program_state)
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

        this.shapes = {
            platform: new defs.Capped_Cylinder(1, 10, [[0, 2], [0, 1]]),
        }
        this.world = new World();

        this.materials = {
            metal: new Material(new defs.Fake_Bump_Map(1), {
                ambient: 1,
                texture: new Texture("assets/tai_image.jpg")
            }),
        }

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

        const light_position = vec4(75, 75, 75, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 10000)];

        this.world.draw(context, program_state);

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
                gl_FragColor.a = 0.25;
              } `;
    }


}
