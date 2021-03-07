import {defs} from "../examples/common.js";

export default class Water_Shader extends defs.Textured_Phong {
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
