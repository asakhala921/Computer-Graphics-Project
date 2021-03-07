import {defs, tiny} from '/examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;
const {Triangle, Square, Cube, Subdivision_Sphere, Textured_Phong, Surface_Of_Revolution} = defs;

let SIZE = 256

export default class Floor {
    // Adapted from Grid_Patch
    constructor() {
        this.height_map = new Image();
        this.height_map.src = "../assets/island_heightmap.png";

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