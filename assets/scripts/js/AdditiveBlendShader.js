/**
 * @author stemkoski / http://github.com/stemkoski
 * @author lettier / http://www.lettier.com/
 *
 * Blend two textures additively
 */

THREE.AdditiveBlendShader = {

	uniforms: {
	
		"tDiffuse1": { type: "t", value: null },
		"tDiffuse2": { type: "t", value: null },
		"resolution": { type: "v2", value: new THREE.Vector2( 1024, 512 )  }
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse1;",
		"uniform sampler2D tDiffuse2;",
		"uniform vec2 resolution;",

		"varying vec2 vUv;",
		
		"float kernel[9];",
		"vec2 offset[9];",
		
		"float step_w = 1.0 / resolution.x;",
		"float step_h = 1.0 / resolution.y;",

		"void main() {",

			"vec4 texel1 = texture2D( tDiffuse1, vUv );",
			"vec4 texel2 = texture2D( tDiffuse2, vUv );",
			
			// SHARPEN VIA CONVOLUTION MATRIX
			
			"offset[0] = vec2(-step_w, -step_h);",
			"offset[1] = vec2(0.0, -step_h);",
			"offset[2] = vec2(step_w, -step_h);",
			"offset[3] = vec2(-step_w, 0.0);",
			"offset[4] = vec2(0.0, 0.0);",
			"offset[5] = vec2(step_w, 0.0);",
			"offset[6] = vec2(-step_w, step_h);",
			"offset[7] = vec2(0.0, step_h);",
			"offset[8] = vec2(step_w, step_h);",
			
			/* SHARPEN KERNEL
			  0 -1  0
			 -1  5 -1
			  0 -1  0
			*/
			
			"kernel[0] =  0.0;",
			"kernel[1] = -1.0;",
			"kernel[2] =  0.0;",
			"kernel[3] = -1.0;",
			"kernel[4] =  5.0;",
			"kernel[5] = -1.0;",
			"kernel[6] =  0.0;",
			"kernel[7] = -1.0;",
			"kernel[8] =  0.0;",
			
			"vec4 sum = vec4(0.0);",		

			"for ( int i = 0; i < 9; i++ )",
			"{",
				"vec4 color = texture2D( tDiffuse2, vUv + offset[i] );",
				"sum += color * kernel[i];",
			"}",
			
			"float r;",
			"float g;",
			"float b;",
			
// 			"if ( texel1[0] < 0.5 )",
// 			"{",
// 				"r = 2.0*sum[0]*texel1[0];",
// 				"g = 2.0*sum[1]*texel1[1];",
// 				"b = 2.0*sum[2]*texel1[2];",
// 			"}",
// 			"else",
// 			"{",
// 				"r = 1.0-2.0*( 1.0 - texel1[0] )*(1.0-sum[0]);",
// 				"g = 1.0-2.0*( 1.0 - texel1[1] )*(1.0-sum[1]);",
// 				"b = 1.0-2.0*( 1.0 - texel1[2] )*(1.0-sum[2]);",
// 			"}",
// 			
// 			"r = min( sum[0], texel1[0] );",
// 			"g = min( sum[1], texel1[1] );",
// 			"b = min( sum[2], texel1[2] );",
			
			"r = sum[0]*texel1[0];",
			"g = sum[1]*texel1[1];",
			"b = sum[2]*texel1[2];",
			
			"gl_FragColor =  vec4( r, g, b, 1.0 );",

		"}"

	].join("\n")

};