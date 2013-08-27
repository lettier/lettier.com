/*
 * 
 * David Lettier (C) 2013.
 *
 * http://www.lettier.com/
 * 
 * File builds upon original from (http://www.neocomputer.org/projects/donut/).
 *
 * Gives Three.js Lambert Material a toon/cel-shaded look.
 * Modified to include shadow map/color.
 *
 */

THREE.ShaderLib['lambert'].fragmentShader = THREE.ShaderLib['lambert'].fragmentShader.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // Remove white-space.
THREE.ShaderLib['lambert'].fragmentShader = "uniform vec3 diffuse;\n" + THREE.ShaderLib['lambert'].fragmentShader.substr(0, THREE.ShaderLib['lambert'].fragmentShader.length-1); // Add a string to the top of the shader.
THREE.ShaderLib['lambert'].fragmentShader += [ // Augment the bottom of the shader string(s) with the following cel-shading logic strings.
	"#ifdef USE_MAP",
	//"	gl_FragColor = texture2D( map, vUv );", // Commented out to included shadow map color.
	"	gl_FragColor = gl_FragColor;",
	"#else",
	"	gl_FragColor = vec4(diffuse, 1.0);",
	"#endif",
	"	vec3 basecolor = vec3(gl_FragColor[0], gl_FragColor[1], gl_FragColor[2]);", // Base color before cel-shading.
	"	float alpha = gl_FragColor[3];", // Alpha value of fragment.
	"	float vlf = vLightFront[0];", // Front facing light intensity.
	// Clean and simple //
	"	if (vlf< 0.50) { gl_FragColor = vec4(mix( basecolor, vec3(0.0), 0.5), alpha); }", // Discretize the light to three bands.
	"	if (vlf>=0.50) { gl_FragColor = vec4(mix( basecolor, vec3(0.0), 0.3), alpha); }",
	"	if (vlf>=0.75) { gl_FragColor = vec4(mix( basecolor, vec3(1.0), 0.0), alpha); }",
	//"	if (vlf>=0.95) { gl_FragColor = vec4(mix( basecolor, vec3(1.0), 0.3), alpha); }",
	//"	gl_FragColor.xyz *= vLightFront;",
	"}"
	].join("\n");