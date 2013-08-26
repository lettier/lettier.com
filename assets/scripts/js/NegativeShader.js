/**
 * @author: lettier / http://www.lettier.com/
 *  
 * @description: Negative color shader for Three.js post processing.
 * 			 
 *               To use:
 * 
 * 			  negative = new THREE.ShaderPass( THREE.NegativeShader );
 *               negative.renderToScreen = true;
 *               composer.addPass( negative );
 * 
 */

THREE.NegativeShader = {

	uniforms: {
		
		"tDiffuse": { type: "t", value: null },
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
		"varying vec2 vUv;",

		"void main() {",
		
			"vec4 color = texture2D( tDiffuse, vUv );",
			
			"float r = abs(1.0 - color[0]);",
			"float g = abs(1.0 - color[1]);",
			"float b = abs(1.0 - color[2]);",
			
			"gl_FragColor = vec4( r, g, b, 1.0 );",
		"}"

	].join("\n")

};
