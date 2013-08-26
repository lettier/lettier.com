/*
 * 
 * David Lettier (C) 2013.
 *
 * http://www.lettier.com/
 * 
 * Convolution sharpen filter for Three.js post processing. 
 * 
 * To use:
 * 
 * sharp = new THREE.ShaderPass( THREE.SharpShader );					
 * sharp.uniforms[ 'resolution' ].value.set( ( window.innerWidth * dpr ), ( window.innerHeight * dpr ) );
 * sharp.renderToScreen = true;
 * composer.addPass( sharp );
 * 
 */

THREE.SharpShader = {

	uniforms: {
	
		"tDiffuse": { type: "t", value: null },
		"resolution": { type: "v2", value: new THREE.Vector2( 1980, 1080 )  }
	},

	vertexShader: [

		"varying vec2 vUv;",
		"void main() {",
			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform vec2 resolution;",

		"varying vec2 vUv;",
		
		"float kernel[9];",
		"vec2 offset[9];",
		
		"float step_w = 1.0 / resolution.x;",
		"float step_h = 1.0 / resolution.y;",

		"void main() {",
			
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
			"int i;",

			"for ( i = 0; i < 9; i++ )",
			"{",
				"vec4 color = texture2D( tDiffuse, vUv + offset[i] );",
				"sum += color * kernel[i];",
			"}",
			
			"gl_FragColor =  vec4( sum[0], sum[1], sum[2], 1.0 );",

		"}"

	].join("\n")

};