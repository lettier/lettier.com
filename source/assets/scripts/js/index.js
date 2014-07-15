/*
 * 
 * David Lettier (C) 2014.
 * 
 * http:/www.lettier.com/
 * 
 * JS file for ../../../index.html.
 * 
 */

 // Globals.

var using_mobile = detect_mobile( "any" );

var canvas_container = null;
var canvas = null;

var renderer = null;

var scene = null;

window.requestAnimationFrame = window.requestAnimationFrame       || window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var request_animation_frame_id = null;

var clock = null;
var time_delta = null;

var origin = null;
var initial_camera_look_at_object = null;

var fog = null;
var beginning_fog_density = 1.0;
var ending_fog_density    = 0.1;

var camera = null;

var sunlight = null;

var use_trackball_controls = false;
var trackball_controls = null;

var MOUSE_LOOK_SPEED_DEFAULT      = 0.2;
var mouse_look_speed              = MOUSE_LOOK_SPEED_DEFAULT;
var mouse_coordinates             = [ window.innerWidth / 2, window.innerHeight / 2 ];
var mouse_left_is_down            = false;
var mouse_left_is_up              = true;
var mouse_left_is_being_held_down = false;
var mouse_left_down_timeout       = null;
var touch_is_down                 = false;
var touch_is_being_held_down      = false;
var touch_down_timeout            = null;
var horizontal_look_angle         = 0.0;
var vertical_look_angle           = 0.0;

var projector              = null;
var raycaster              = null;
var intersecting_object_id = -1;
var ray_mouse              = [ 0, 0 ];

var main_model          = null;
var logo_model          = null;
var glass_panes_model   = null;
var buildings_model     = null;
var bird_model          = null;
var desk_model          = null;
var computer_model      = null;
var picture_frame_model = null;
var blocks_model        = null;
var film_reel_model     = null;
var phone_model         = null;
var mannequin_model     = null;
var outlines_model      = null;

var AUDIO_ON_SYMBOL  = "<span class='lettier-icon-audio_on'></span>";
var AUDIO_OFF_SYMBOL = "<span class='lettier-icon-audio_off'></span>";
var VOLUME_HIGH = 0.6;
var VOLUME_LOW  = 0.0;
var audio_is_on = 0;

var background_noise_sound_effect = null;
var pop_sound_effect              = null;

var opening_animation_tween = null;

var overlay_is_out = false;

// On-load function.

function on_load( )
{

	initialize_3D_scene( );

	window.requestAnimationFrame( draw );

}

// Initializations.

// 3D scene.

function initialize_3D_scene( )
{

	// Create the div container to hold the canvas.
	
	canvas_container = document.createElement( "div" );
	canvas_container.id = "canvas_container";
	canvas_container.className = "canvas_container";
	document.body.appendChild( canvas_container );
	
	// Create the canvas and renderer.
	
	canvas = document.createElement( "canvas" );
	canvas.id = "canvas";
	canvas.innerHTML = "Your browser does not support the HTML5 canvas tag."
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas_container.appendChild( canvas );
	
	if ( Detector.webgl )
	{
		
		renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true, clearColor: 0xffffff, clearAlpha: 0, alpha: true, precision: "mediump" } );
		
	}
	else
	{
		
		renderer = new THREE.CanvasRenderer( { canvas: canvas, antialias: true, clearColor: 0xffffff, clearAlpha: 0, alpha: true } );
	
	}

	renderer.setSize( window.innerWidth, window.innerHeight );
	canvas_container.appendChild( renderer.domElement );
	
	// Log visitor data.
	
	try
	{
	
		log_visitor_data( "WEBGL_EXTS=" + renderer.context.getSupportedExtensions( ).join( "," ) );
		
	}
	catch( error )
	{
	
		log_visitor_data( "WEBGL_EXTS=" + "" );
		
	}
	
	// Create the scene.
			
	scene = new THREE.Scene( );
	
	// Projector.
	
	projector = new THREE.Projector( );
	
	// Ray-caster.
	
	raycaster = new THREE.Raycaster( );
	
	// Add in fog.
	
	scene.fog = new THREE.FogExp2( 0x323940, beginning_fog_density );
	
	fog = scene.fog;
	
	// Get the scene origin.
	
	origin = new THREE.Vector3( 0, 0, 0 );
	
	// Get the initial object look at point for the camera.
	
	initial_camera_look_at_object = new THREE.Object3D( );	
	initial_camera_look_at_object.position.set( -4, -0.2, -3.5 );
	
	// Create the camera.
	
	camera = new THREE.PerspectiveCamera( 45, canvas_container.offsetWidth / canvas_container.offsetHeight, .1, 1000 );
	camera.position.set( 0, -0.2, 2.9 );
	camera.rotation.order = "YXZ";
	scene.add( camera );
	
	// Set initial camera look at point.

	camera.lookAt( initial_camera_look_at_object.position );
	
	horizontal_look_angle = -camera.rotation.y;
	vertical_look_angle   =  camera.rotation.x;
	
	// Enable shadows.

	renderer.shadowMapEnabled  = true;
	renderer.shadowMapSoft     = false;
	renderer.shadowMapCullFace = THREE.CullFaceFront;
	
	// Create the lights with shadows.
	
	var ambient_light = new THREE.AmbientLight( 0x323940 );
	scene.add( ambient_light );

	var spotlight = new THREE.SpotLight( 0xe1d9a1 );
	spotlight.position.set( -15, 2, 5 );
	spotlight.target.position.set( -2, -1, 0 );
	spotlight.distance            = camera.far;
	spotlight.castShadow          = true;
	spotlight.shadowCameraVisible = false;
	spotlight.shadowBias          = 0.009;
	spotlight.shadowCameraNear    = 9;
	spotlight.shadowCameraFar     = camera.far;
	spotlight.shadowCameraFov     = 45;
	spotlight.shadowDarkness      = 0.35;
	spotlight.shadowMapWidth      = 512;
	spotlight.shadowMapHeight     = 512;
	spotlight.intensity           = 1.0;
	scene.add( spotlight );
	sunlight = spotlight;
	
	var point_light = new THREE.PointLight( 0xe1d9a1, 1.2, 50 );
	point_light.position.set( 0.13, 2.75, 3.0 );
	scene.add( point_light );
	
	// Create the trackball controls.
	
	if ( use_trackball_controls )
	{

		trackball_controls = new THREE.TrackballControls( camera, renderer.domElement );
		trackball_controls.rotateSpeed          = 1.0;					
		trackball_controls.zoomSpeed            = 1.2;					
		trackball_controls.panSpeed             = 0.2;				
		trackball_controls.noZoom               = false;					
		trackball_controls.noPan                = false;
		trackball_controls.noRotate             = false;
		trackball_controls.staticMoving         = false;					
		trackball_controls.dynamicDampingFactor = 0.3;				
		trackball_controls.minDistance          = 1.1;					
		trackball_controls.maxDistance          = 100;
		trackball_controls.keys                 = [ 16, 17, 18 ]; // [ rotateKey, zoomKey, panKey ]
		trackball_controls.target               = initial_camera_look_at_object.position;
		
	}

	// Get the clock.
	
	clock = new THREE.Clock();
	
	// Load in the models.

	var jsonLoader = new THREE.JSONLoader();
	
	jsonLoader.load( "assets/models/buildings.js", function( geometry, material ) { 
	
		var index = material.length;
		
		while ( index-- )
		{
			
			material[ index ].side    = THREE.FrontSide;
			material[ index ].shading = THREE.FlatShading;
			
		}

		var model = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { 
		                                                                     
		                                                                     color:     0x333333,
		                                                                     ambient:   0x454a59,
		                                                                     emissive:  0x111111,
		                                                                     specular:  0x8ad1de,
		                                                                     shading:   THREE.FlatShading,
		                                                                     shininess: 1000
		
		} ) );

		model.castShadow    = false;
		model.receiveShadow = false;
		
		scene.add( model );
		buildings_model = model;
	
	}, "assets/models/");
	
	jsonLoader.load( "assets/models/bird.js", function( geometry, material ) { 
	
		var index = material.length;
		
		while ( index-- )
		{
			
			material[ index ].side    = THREE.FrontSide;
			material[ index ].shading = THREE.SmoothShading;
			
		}

		var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );

		if ( !using_mobile ) { model.castShadow = true; model.receiveShadow = true; }
		
		scene.add( model );
		bird_model = model;
	
	}, "assets/models/textures/");
	
	jsonLoader.load( "assets/models/glass_panes.js", function( geometry, material ) { 
	
		var index = material.length;
	
		while ( index-- )
		{
		
			material[ index ].side    = THREE.DoubleSide;
			material[ index ].shading = THREE.FlatShading;
		
		}

		var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );

		if ( !using_mobile ) { model.castShadow = false; model.receiveShadow = true; }
	
		scene.add( model );
		glass_panes_model = model;

	}, "assets/models/");

	jsonLoader.load( "assets/models/main.js", function( geometry, material ) { 
	
		var index = material.length;
		
		while ( index-- )
		{
			
			material[ index ].side    = THREE.FrontSide;
			material[ index ].shading = THREE.FlatShading;
			
		}

		var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );

		if ( !using_mobile ) { model.castShadow = true; model.receiveShadow = true; }
		
		scene.add( model );
		main_model = model;
	
	}, "assets/models/");
	
	jsonLoader.load( "assets/models/logo.js", function( geometry, material ) { 
	
		var index = material.length;
		
		while ( index-- )
		{
			
			material[ index ].side    = THREE.FrontSide;
			material[ index ].shading = THREE.FlatShading;
			
		}

		var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );

		if ( !using_mobile ) { model.castShadow = true; model.receiveShadow = false; }
		
		scene.add( model );
		logo_model = model;
	
	}, "assets/models/");

	jsonLoader.load( "assets/models/desk.js", function( geometry, material ) { 
	
		var index = material.length;
		
		while ( index-- )
		{
			
			material[ index ].side    = THREE.FrontSide;
			material[ index ].shading = THREE.FlatShading;
			
		}

		var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );

		if ( !using_mobile ) { model.castShadow = true; model.receiveShadow = true; }
		
		scene.add( model );
		desk_model = model;
	
	}, "assets/models/");
	
	jsonLoader.load( "assets/models/computer.js", function( geometry, material ) { 
	
		var index = material.length;
		
		while ( index-- )
		{
			
			material[ index ].side    = THREE.FrontSide;
			material[ index ].shading = THREE.FlatShading;
			
		}

		var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );

		if ( !using_mobile ) { model.castShadow = true; model.receiveShadow = true; }
		
		scene.add( model );
		computer_model = model;
	
	}, "assets/models/textures/");
	
	jsonLoader.load( "assets/models/picture_frame.js", function( geometry, material ) { 
	
		var index = material.length;
		
		while ( index-- )
		{
			
			material[ index ].side    = THREE.FrontSide;
			material[ index ].shading = THREE.FlatShading;
			
		}

		var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );

		if ( !using_mobile ) { model.castShadow = true; model.receiveShadow = true; }
		
		scene.add( model );
		picture_frame_model = model;
	
	}, "assets/models/textures/");
	
	jsonLoader.load( "assets/models/blocks.js", function( geometry, material ) { 
	
		var index = material.length;
		
		while ( index-- )
		{
			
			material[ index ].side    = THREE.FrontSide;
			material[ index ].shading = THREE.FlatShading;
			
		}

		var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );

		if ( !using_mobile ) { model.castShadow = true; model.receiveShadow = true; }
		
		scene.add( model );
		blocks_model = model;
	
	}, "assets/models/");
	
	jsonLoader.load( "assets/models/film_reel.js", function( geometry, material ) { 
	
		var index = material.length;
		
		while ( index-- )
		{
			
			material[ index ].side    = THREE.FrontSide;
			material[ index ].shading = THREE.FlatShading;
			
		}

		var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );

		if ( !using_mobile ) { model.castShadow = true; model.receiveShadow = true; }
		
		scene.add( model );
		film_reel_model = model;
	
	}, "assets/models/");
	
	jsonLoader.load( "assets/models/phone.js", function( geometry, material ) { 
	
		var index = material.length;
		
		while ( index-- )
		{
			
			material[ index ].side    = THREE.FrontSide;
			material[ index ].shading = THREE.SmoothShading;
			
		}

		var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );

		if ( !using_mobile ) { model.castShadow = true; model.receiveShadow = true; }
		
		scene.add( model );
		phone_model = model;
	
	}, "assets/models/");
	
	jsonLoader.load( "assets/models/mannequin.js", function( geometry, material ) { 
	
		var index = material.length;
		
		while ( index-- )
		{
			
			material[ index ].side    = THREE.FrontSide;
			material[ index ].shading = THREE.SmoothShading;
			
		}

		var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );

		if ( !using_mobile ) { model.castShadow = true; model.receiveShadow = true; }
		
		scene.add( model );
		mannequin_model = model;
	
	}, "assets/models/");
	
	jsonLoader.load( "assets/models/outlines.js", function( geometry, material ) { 
	
		var index = material.length;
		
		while ( index-- )
		{
			
			material[ index ].side    = THREE.FrontSide;
			material[ index ].shading = THREE.None;
			
		}

		var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );

		model.castShadow    = false;
		model.receiveShadow = false;
		
		scene.add( model );
		outlines_model = model;
	
	}, "assets/models/");
	
	// Callbacks.
	
	window.onresize    = on_window_resize_callback;
	
	if ( !using_mobile )
	{
	
		window.onmousemove = on_mouse_move_callback;
	
		window.onmousedown = on_mouse_down_callback;
	
		window.onmouseup   = on_mouse_up_callback;
	
	}
	else
	{
	
		canvas.addEventListener( "touchstart", on_touch_start_callback, false );
	
		canvas.addEventListener( "touchend",   on_touch_end_callback,   false );
	
		canvas.addEventListener( "touchmove",  on_touch_move_callback,  false );
	
	}
	
	// Opening animation.
	
	var updatables   = { fog_density: beginning_fog_density };
	var final_update = { fog_density: ending_fog_density    };
	
	opening_animation_tween = new TWEEN.Tween( updatables ).to( final_update, 2000 );
	
	opening_animation_tween.easing( TWEEN.Easing.Circular.In );
	
	opening_animation_tween.onUpdate( function ( ) {
	
		fog.density = updatables.fog_density;
		
	} );
	
	opening_animation_tween.delay( 500 );
	
	opening_animation_tween.start( );
	
	// Load audio.
	
	initialize_audio( );
	
	// Create the help button.
	
	initialize_help_button( );

}

// Audio.

function initialize_audio( )
{

	var audio_control_button       = document.createElement( "div" );
	audio_control_button.id        = "audio_control_button";
	audio_control_button.className = "audio_control_button";
	audio_control_button.innerHTML = AUDIO_OFF_SYMBOL;
	audio_control_button.title     = "Turn Audio On";
	
	document.body.appendChild( audio_control_button );
	
	audio_control_button.onmouseup = function ( ) { toggle_audio( ); }
	
	audio_is_on = 0;
	
	
	// Background noise.
	
	background_noise_sound_effect          = document.createElement( "audio" );
	background_noise_sound_effect.id       = "background_noise_sound_effect";
	background_noise_sound_effect.preload  = "auto";
	background_noise_sound_effect.volume   = VOLUME_LOW;
	background_noise_sound_effect.loop     = true;
	background_noise_sound_effect.autoplay = "autoplay";
	
	document.body.appendChild( background_noise_sound_effect );
	
	background_noise_sound_effect.on_can_play = function ( ) { 
	
		document.getElementById( "audio_control_button" ).style.visibility = "visible"; 
		
		background_noise_sound_effect.removeEventListener( "canplay", background_noise_sound_effect.on_can_play );
		
		background_noise_sound_effect.load( );
	
		background_noise_sound_effect.play( );
		
	};
	
	background_noise_sound_effect.addEventListener( "canplay", background_noise_sound_effect.on_can_play, false );
	
	var background_noise_audio_source = document.createElement( "source" );
	
	if ( background_noise_sound_effect.canPlayType( "audio/ogg" ) != "" )
	{
	
		background_noise_audio_source.type = "audio/ogg";
		background_noise_audio_source.src  = "assets/audio/ogg/background.ogg";
		
		background_noise_sound_effect.appendChild( background_noise_audio_source );
	
	}
	else
	{
	
		background_noise_audio_source.type = "audio/mpeg";
		background_noise_audio_source.src  = "assets/audio/mp3/background.mp3";
		
		background_noise_sound_effect.appendChild( background_noise_audio_source );
	
	}
	
	// Pop sound.
	
	pop_sound_effect          = document.createElement( "audio" );
	pop_sound_effect.id       = "pop_sound_effect";
	pop_sound_effect.preload  = "auto";
	pop_sound_effect.volume   = VOLUME_LOW;
	pop_sound_effect.loop     = false;
	pop_sound_effect.autoplay = "autoplay";

	document.body.appendChild( pop_sound_effect );
	
	pop_sound_effect.on_can_play = function ( ) { 
	
		document.getElementById( "audio_control_button" ).style.visibility = "visible";
		
		pop_sound_effect.removeEventListener( "canplay", pop_sound_effect.on_can_play );
		
		pop_sound_effect.load( );
	
		pop_sound_effect.play( );
		
	};
	
	pop_sound_effect.addEventListener( "canplay", pop_sound_effect.on_can_play, false );
	
	var pop_audio_source = document.createElement( "source" );
	
	if ( pop_sound_effect.canPlayType( "audio/ogg" ) != "" )
	{
	
		pop_audio_source.type = "audio/ogg";
		pop_audio_source.src  = "assets/audio/ogg/pop.ogg";
		
		pop_sound_effect.appendChild( pop_audio_source );
	
	}
	else
	{
	
		pop_audio_source.type = "audio/mpeg";
		pop_audio_source.src  = "assets/audio/mp3/pop.mp3";
		
		pop_sound_effect.appendChild( pop_audio_source );
	
	}
	
}

// Initialize the help button function.

function initialize_help_button( )
{

	var help_button       = document.createElement( "div" );
	help_button.id        = "help_button";
	help_button.className = "help_button";
	help_button.innerHTML = "?";
	help_button.title     = "Help";
	
	document.body.appendChild( help_button );
	
	help_button.onmouseup = function ( ) { create_overlay( "assets/content/help.html" ); }
	
	var audio_control_button = document.getElementById( "audio_control_button" )
	
	help_button.style.top = audio_control_button.offsetTop + audio_control_button.clientHeight + 5 + "px";
}

// Event callbacks.

function toggle_audio( event )
{

	if ( audio_is_on === 1 )
	{
	
		document.getElementById( "background_noise_sound_effect" ).volume = VOLUME_LOW;
		
		document.getElementById( "pop_sound_effect" ).volume = VOLUME_LOW;
		
		document.getElementById( "audio_control_button" ).innerHTML = AUDIO_OFF_SYMBOL;
		
		document.getElementById( "audio_control_button" ).title = "Turn Audio On";
		
		audio_is_on = 0;
		
	}
	else
	{
	
		document.getElementById( "background_noise_sound_effect" ).volume = VOLUME_HIGH;
		
		document.getElementById( "pop_sound_effect" ).volume = VOLUME_HIGH;
		
		document.getElementById( "audio_control_button" ).innerHTML = AUDIO_ON_SYMBOL;
		
		document.getElementById( "audio_control_button" ).title = "Turn Audio Off";
		
		audio_is_on = 1;
		
	}
	
}

function on_window_resize_callback( event )
{

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix( );
	
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	if ( overlay_is_out )
	{
		
		size_overlay_content_container( );
		
		size_contact_form( );
		
	}
	
}

// Mouse event callbacks.

function on_mouse_move_callback( event )
{

	event.preventDefault( );
	
	if ( overlay_is_out ) return null;

	mouse_coordinates[ 0 ] = event.clientX;
	mouse_coordinates[ 1 ] = event.clientY;
	
	if ( !mouse_left_is_being_held_down )
	{
	
		if ( outlines_model != null )
		{

			ray_mouse[ 0 ] =   ( mouse_coordinates[ 0 ] / window.innerWidth  ) * 2 - 1;
			ray_mouse[ 1 ] = - ( mouse_coordinates[ 1 ] / window.innerHeight ) * 2 + 1;
	
			// Find intersections.

			var ray_mouse_vector = new THREE.Vector3( ray_mouse[ 0 ], ray_mouse[ 1 ], 1 );
			projector.unprojectVector( ray_mouse_vector, camera );

			raycaster.set( camera.position, ray_mouse_vector.sub( camera.position ).normalize() );

			var intersecting_objects = raycaster.intersectObjects( scene.children, true );
			
			if ( intersecting_objects.length != 0 )
			{
			
				if ( intersecting_objects[ 0 ].object.id === glass_panes_model.id && intersecting_objects.length >= 2 )
				{
				
					// Bird is behind the window panes so take the second index.
					
					intersecting_object_id = intersecting_objects[ 1 ].object.id;
				
				}
				else
				{
				
					intersecting_object_id = intersecting_objects[ 0 ].object.id;
					
				}
				
				destroy_tooltip( );
				
				switch ( intersecting_object_id )
				{
				
					case computer_model.id:
					
						create_tooltip( "Code" );

						canvas_container.style.cursor = "pointer";
						
						break;
						
					case blocks_model.id:
					
						create_tooltip( "Projects" );

						canvas_container.style.cursor = "pointer";
						
						break;
						
					case mannequin_model.id:
					
						create_tooltip( "3D Models" );

						canvas_container.style.cursor = "pointer";
						
						break;
						
					case phone_model.id:
					
						create_tooltip( "Contact" );

						canvas_container.style.cursor = "pointer";
						
						break;
						
					case logo_model.id:
					
						create_tooltip( "About" );

						canvas_container.style.cursor = "pointer";
						
						break;
						
					case bird_model.id:
					
						create_tooltip( "Twitter" );

						canvas_container.style.cursor = "pointer";
						
						break;
						
					case film_reel_model.id:
					
						create_tooltip( "Videos" );

						canvas_container.style.cursor = "pointer";
						
						break;
						
					case picture_frame_model.id:
					
						create_tooltip( "Photos" );

						canvas_container.style.cursor = "pointer";
						
						break;
						
					default:
					
						destroy_tooltip( );
						
						canvas_container.title        = "";
						canvas_container.style.cursor = "default";
						
						intersecting_object_id = -1;
						
						break;
						
				}
				
			}
		
		}
	
	}
	
}

function on_mouse_down_callback( event )
{

	if ( overlay_is_out ) return null;
	
	event.preventDefault( );

	event = event || window.event;	
	
	var button = event.which || event.button;
	
	if ( button === 1 )
	{

		mouse_left_is_down = true;
		mouse_left_is_up   = false;
	
		mouse_left_down_timeout = window.setTimeout( function ( ) {
		
			canvas_container.style.cursor = "move";
			
			mouse_left_is_being_held_down = true; 
			
		}, 200 );
		
	}
	
}

function on_mouse_up_callback( event )
{

	if ( overlay_is_out ) return null;
	
	event.preventDefault( );

	event = event || window.event;	
	
	var button = event.which || event.button;
	
	// console.log( button, mouse_left_is_being_held_down, intersecting_object_id, mouse_left_down_timeout );
	
	if ( button === 1 )
	{
	
		if ( !mouse_left_is_being_held_down )
		{
			
			switch ( intersecting_object_id )
			{
		
				case computer_model.id:
			
					window.open( "https://github.com/lettier?tab=repositories" );
				
					break;
				
				case blocks_model.id:
			
					// Create projects overlay.
					
					create_overlay( "assets/content/projects.html" );
			
					break;
				
				case mannequin_model.id:
			
					window.open( "https://sketchfab.com/lettier/recent" );
				
					break;
				
				case phone_model.id:
			
					// Create contact overlay.
					
					create_overlay ( "assets/content/contact.html" );
			
					break;
				
				case logo_model.id:
			
					// Create about overlay.
					
					create_overlay( "assets/content/about.html" );
				
					break;
				
				case bird_model.id:
			
					window.open( "https://twitter.com/lettier/" );
				
					break;
				
				case film_reel_model.id:
			
					window.open( "https://www.youtube.com/user/llettier" );
				
					break;
				
				case picture_frame_model.id:
			
					window.open( "https://secure.flickr.com/photos/30908838@N04/" );
				
					break;
				
				default:
			
					break;
				
			}
			
			intersecting_object_id = -1;
			
		}
		
		mouse_left_is_down            = false;
		mouse_left_is_up              = true;
		mouse_left_is_being_held_down = false;
		
		canvas_container.style.cursor = "default";
	
		window.clearInterval( mouse_left_down_timeout );
		
		mouse_left_down_timeout = null;

	}
	
}

// Touch event call backs.

function on_touch_move_callback( event )
{
	
	event.preventDefault( );
	
	if ( overlay_is_out ) return null;

	mouse_coordinates[ 0 ] = event.touches[ 0 ].clientX;
	mouse_coordinates[ 1 ] = event.touches[ 0 ].clientY;
	
	if ( !touch_is_being_held_down )
	{
	
		if ( outlines_model != null )
		{

			ray_mouse[ 0 ] =   ( mouse_coordinates[ 0 ] / window.innerWidth  ) * 2 - 1;
			ray_mouse[ 1 ] = - ( mouse_coordinates[ 1 ] / window.innerHeight ) * 2 + 1;
	
			// Find intersections.

			var ray_mouse_vector = new THREE.Vector3( ray_mouse[ 0 ], ray_mouse[ 1 ], 1 );
			projector.unprojectVector( ray_mouse_vector, camera );

			raycaster.set( camera.position, ray_mouse_vector.sub( camera.position ).normalize() );

			var intersecting_objects = raycaster.intersectObjects( scene.children, true );
			
			if ( intersecting_objects.length != 0 )
			{
			
				if ( intersecting_objects[ 0 ].object.id === glass_panes_model.id && intersecting_objects.length >= 2 )
				{
				
					// Bird is behind the window panes so take the second index.
					
					intersecting_object_id = intersecting_objects[ 1 ].object.id;
				
				}
				else
				{
				
					intersecting_object_id = intersecting_objects[ 0 ].object.id;
					
				}
				
			}
		
		}
	
	}
	
}

function on_touch_start_callback( event )
{
	
	event.preventDefault( );
	
	if ( overlay_is_out ) return null;
	
	touch_is_down = true;
	
	touch_down_timeout = window.setTimeout( function ( ) {
		
		touch_is_being_held_down = true; 
		
	}, 200 );
	
	on_touch_move_callback( event );
	
}

function on_touch_end_callback( event )
{
	
	event.preventDefault( );
	
	if ( overlay_is_out ) return null;

	if ( !touch_is_being_held_down )
	{
		
		switch ( intersecting_object_id )
		{
	
			case computer_model.id:
		
				window.open( "https://github.com/lettier?tab=repositories" );
			
				break;
			
			case blocks_model.id:
		
				// Create projects overlay.
				
				create_overlay( "assets/content/projects.html" );
		
				break;
			
			case mannequin_model.id:
		
				window.open( "https://sketchfab.com/lettier/recent" );
			
				break;
			
			case phone_model.id:
		
				// Create contact overlay.
				
				create_overlay ( "assets/content/contact.html" );
		
				break;
			
			case logo_model.id:
		
				// Create about overlay.
				
				create_overlay( "assets/content/about.html" );
			
				break;
			
			case bird_model.id:
		
				window.open( "https://twitter.com/lettier/" );
			
				break;
			
			case film_reel_model.id:
		
				window.open( "https://www.youtube.com/user/llettier" );
			
				break;
			
			case picture_frame_model.id:
		
				window.open( "https://secure.flickr.com/photos/30908838@N04/" );
			
				break;
			
			default:
		
				break;
			
		}
		
		intersecting_object_id = -1;
		
	}
	
	touch_is_down = false;

	touch_is_being_held_down = false;

	window.clearInterval( touch_down_timeout );
	
	touch_down_timeout = null;

}

// Create and destroy tooltip functions.

function create_tooltip( data_string )
{
	
	var tooltip        = document.createElement( "div" );
	tooltip.id         = "tooltip"
	tooltip.className  = "tooltip";
	tooltip.innerHTML  = data_string;
	
	document.body.appendChild( tooltip );
	
	tooltip.style.left = mouse_coordinates[ 0 ] - tooltip.clientWidth  + "px";
	tooltip.style.top  = mouse_coordinates[ 1 ] - tooltip.clientHeight + "px";
	
	var updatables   = { tooltip_opacity: 0.0 };
	var final_update = { tooltip_opacity: 1.0 };
	
	var tooltip_tween = new TWEEN.Tween( updatables ).to( final_update, 200 );
	
	tooltip_tween.easing( TWEEN.Easing.Circular.In );
	
	tooltip_tween.onUpdate( function ( ) {
	
		tooltip.style.opacity = updatables.tooltip_opacity;
		
	} );
	
	tooltip_tween.delay( 0 );
	
	tooltip_tween.start( );
	
}

function destroy_tooltip( )
{
	
	try
	{
	
		var tooltip = document.getElementById( "tooltip" );
		
		tooltip.parentNode.removeChild( tooltip );
		
	}
	catch ( error ) {}
	
}
	

// Draw function.

function draw( timestamp )
{

	request_animation_frame_id = window.requestAnimationFrame( draw );
	
	if ( use_trackball_controls ) trackball_controls.update( );
	
	var delta = clock.getDelta( );
	
	// Run tweens.
	
	TWEEN.update( );
	
	// Rotate camera.
	
	if ( ( mouse_left_is_down || touch_is_down ) && ( mouse_left_is_being_held_down || touch_is_being_held_down )
		&& !use_trackball_controls && !overlay_is_out )
	{

		var mx = ( ( window.innerWidth  / 2 ) -  mouse_coordinates[ 0 ] ) / ( -1 * ( window.innerWidth  / 2 ) );
		var my = ( ( window.innerHeight / 2 ) -  mouse_coordinates[ 1 ] ) / (  1 * ( window.innerHeight / 2 ) );
	
		horizontal_look_angle += mouse_look_speed * delta * ( mx * Math.PI * 1 );
		vertical_look_angle   += mouse_look_speed * delta * ( my * Math.PI * 1 );
	
		horizontal_look_angle = Math.max( -Math.PI * 0.25, Math.min( Math.PI * 0.05, horizontal_look_angle ) );
		vertical_look_angle   = Math.max( -Math.PI * 0.1, Math.min( Math.PI * 0.1, vertical_look_angle   ) );
		
		camera.rotation.x =  vertical_look_angle;
		camera.rotation.y = -horizontal_look_angle;
		camera.rotation.z = 0;
		
	}
	
	renderer.render( scene, camera );

}

// Mobile detection function.

function detect_mobile( platform )
{

	switch ( platform )
	{
		
		case "android":
		
			return navigator.userAgent.match( /Android/i );
			
			break;
			
		case "blackberry":
		
			return navigator.userAgent.match( /BlackBerry/i );
			
			break;
			
		case "ios":
		
			return navigator.userAgent.match( /iPhone|iPad|iPod/i );
			
			break;
			
		case "opera":
		
			return navigator.userAgent.match( /Opera Mini/i );
			
			break;
			
		case "windows":
		
			return navigator.userAgent.match( /IEMobile/i );
			
			break;
			
		case "any":
		
			return navigator.userAgent.match( /Android/i )          ||
			       navigator.userAgent.match( /BlackBerry/i )       ||
			       navigator.userAgent.match( /iPhone|iPad|iPod/i ) ||
			       navigator.userAgent.match( /Opera Mini/i )       ||
			       navigator.userAgent.match( /IEMobile/i );
			       
			break;
			
		default:
			
			return false;
			
	}
	
}

// Create overlay function.

function create_overlay( url )
{

	try
	{
		
		var audio_control_button = document.getElementById( "audio_control_button" );
		
		audio_control_button.style.visibility = "hidden";
		
	}
	catch ( error ) { }
	
	overlay_is_out = true;
	
	var overlay_container       = document.createElement( "div" );
	overlay_container.id        = "overlay_container";
	overlay_container.className = "overlay_container";
	
	var overlay_content_container       = document.createElement( "div" );
	overlay_content_container.id        = "overlay_content_container";
	overlay_content_container.className = "overlay_content_container";
	
	document.body.appendChild( overlay_container );
	overlay_container.appendChild( overlay_content_container );
	
	size_overlay_content_container( );
	
	var close_button           = document.createElement( "div" );
	close_button.className     = "close_button";
	close_button.innerHTML     = "X";
	close_button.title         = "Close";
	close_button.onselectstart = function ( ) { return true; };
	close_button.addEventListener( "mouseup", destroy_overlay, false );
	
	overlay_container.appendChild( close_button );

	var http_request;

	function fetch_overlay_content( url )
	{
		
		if ( window.XMLHttpRequest )
		{
			
			http_request = new XMLHttpRequest( );
			
		} 
		else if ( window.ActiveXObject )
		{
			
			try 
			{
			
				http_request = new ActiveXObject( "Msxml2.XMLHTTP" );
			
			} 
			catch ( error ) 
			{
				
				try 
				{
				
					http_request = new ActiveXObject( "Microsoft.XMLHTTP" );
				
				} 
				catch ( error ) {}
				
			}
			
		}

		if ( !http_request ) 
		{
		
			console.log( "Failed to fetch overlay content." );
			
			return false;
		
		}
		
		http_request.onreadystatechange = load_overlay_content;
		http_request.open( "GET", url );
		http_request.send( );
		
	}

	function load_overlay_content( ) 
	{
	
		if ( http_request.readyState === 4 ) 
		{
		
			if ( http_request.status === 200 ) 
			{
				
				var overlay_content_container = document.getElementById( "overlay_content_container" );
				
				overlay_content_container.innerHTML = http_request.responseText;
				
				if ( url.search( "contact" ) != -1 )
				{
				
					initialize_contact_form( );
				
				}
				
			} 
			else 
			{
				
				console.log( "Failed to load overlay content." );
				
			}
		
		}
	
	}
	
	fetch_overlay_content( url );
	
	pop_sound_effect.play( );
	
}

// Size the overlay content container function.

function size_overlay_content_container( )
{
	
	try
	{
		
		var overlay_content_container = document.getElementById( "overlay_content_container" );
		
		if ( window.innerWidth >= 720 )
		{
			
			overlay_content_container.style.width = 560 + "px";
			
			overlay_content_container.style.fontSize = "inherit";
			
		}
		else if ( window.innerWidth >= 640 )
		{
			
			overlay_content_container.style.width = 480 + "px";
			
			overlay_content_container.style.fontSize = "inherit";
			
		}
		else if ( window.innerWidth >= 480 )
		{
			
			overlay_content_container.style.width = 320 + "px";
			
			overlay_content_container.style.fontSize = "85%";
			
		}
		else if ( window.innerWidth >= 320 )
		{
			
			overlay_content_container.style.width = 160 + "px";
			
			overlay_content_container.style.fontSize = "65%";
			
		}
		else
		{
			
			var x = -160 + window.innerWidth;
			
			overlay_content_container.style.width = ( window.innerWidth - x ) / 2 + "px";
			
			overlay_content_container.style.fontSize = "60%";
			
		}
		
		overlay_content_container.style.left   = ( window.innerWidth / 2 ) - ( overlay_content_container.clientWidth / 2 ) + "px";
		overlay_content_container.style.height = window.innerHeight - 40 + "px";
		
		if ( window.innerWidth < 480 )
		{
			
			overlay_content_container.style.left  = 80 + "px";
			overlay_content_container.style.width = window.innerWidth - overlay_content_container.offsetLeft - 10 - 12 + "px";
			
		}
		
	}
	catch ( error ) { }	
	
}

function destroy_overlay( )
{
	
	var overlay_container = document.getElementById( "overlay_container" );
	
	overlay_container.parentNode.removeChild( overlay_container );
	
	overlay_is_out = false;
	
	try
	{
		
		var audio_control_button = document.getElementById( "audio_control_button" );
		
		audio_control_button.style.visibility = "visible";
		
	}
	catch ( error ) {}
	
}

// Log visitor information function.

function log_visitor_data( data_string )
{
	
	function get_xml_http( ) 
	{
		
		var xml_http = null;

		if ( window.XMLHttpRequest ) 
		{
			
			xml_http = new XMLHttpRequest( );
			
		}
		else if ( window.ActiveXObject ) 
		{
			
			xml_http = new ActiveXObject( "Microsoft.XMLHTTP" );
			
		}

		return xml_http;
	}
	

	function ajax_request( php_file, data_string ) 
	{
		
		var request =  get_xml_http( );

		request.open( "POST", php_file, true );
	
		request.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
		
		request.send( data_string ); 
	
		request.onreadystatechange = function( ) {
			
			if ( request.readyState === 4 )
			{
				
				if ( request.status === 200 )
				{
					
				}
				else
				{
				
					console.log( "Logging error." );
					
				}
				
			}

		}
	}
	
	ajax_request( "assets/scripts/php/visitor_data_logger.php", data_string );
	
}
