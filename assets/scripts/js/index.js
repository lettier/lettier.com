/*
 * 
 * @author lettier / http:www.lettier.com/
 * 
 * @description: JS file for index.html. Handles 3D/2D/audio interface.
 * 
 */

// ONLOAD FUNCTION //

function onLoad()
{
	// FOR MOBILE USERS HAVING THE PHONE ORIENTED IN PORTRAIT MODE //
	
	if( window.innerHeight > window.innerWidth )
	{
		
		alert( "Best viewed in landscape." );
		
	}	
	
	// TEST //
	
	test = document.createElement( 'canvas' );
	document.body.appendChild( test );	
	if ( !canRunWebGL( test ) ) 
	{
		setTimeout( function ( ) { log( "webgl=" ); }, 8000 );
		
		// RUN //
		
		twoD( );
	}
	else
	{
		setTimeout( function ( ) { log( "webgl=" + webglexts.join( ) ); }, 8000 );
		
		// RUN //
		
		//twoD( ); //DELETE!
		
		threeD( );
	}
	
}

function threeD( )
{
	
	// GLOBABLS //
	
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	try
	{
		
		var audioContext = new AudioContext();
		
	}
	catch( err )
	{
		
	}
	
	var webglexts;
	
	var requestID;
	
	var contactcontainer;
	var overContactForm = false;
	var contactopensoundfx;
	
	var soundplaying = false;
	var backgroundsoundsource;
	
	var disableAnimation = 0;
	var animationOff = false;
	
	var composer;
	var canvas;
	var renderer; 
	var scene;
	var camera; 
	
	var dpr;
	var effectFXAA; 
	var blend;
	
	var clock;	
	
	var controls; 
	
	var projector;
	var mouseVector;
	var raycaster;
	var intersects;
	var intersection;
	
	var globe; 
	var moon; 
	var satellite; 
	var sunLight;	
	
	var images_sign;
	var videos_sign;
	var code_sign;
	var models_sign;
	var contact_sign;
	var pickables = new Array( );
	
	
	var mouseOver = -1;
	var lastMousePos = { x: 0, y: 0 };
	
	var cloud = new Array( );	
	var cloud_xz = new Array( );
	
	var angle  = 0.0;
	var angle2 = 0.0;
	
	var openinganimation;
	
	var origin;	
	
	// RUN //
	
	initScene( );
	
	// INIT3DSCENE FUNCTION //
	
	function initScene() 
	{
		// ICONS //
		
		var speakericon = document.createElement( "img" );
		speakericon.id = "speakericon";
		speakericon.className = "icon";
		speakericon.style.left = 1 + "%";
		speakericon.alt = "Sound On";
		speakericon.title = "Sound On";
		speakericon.src = "assets/images/png/speaker_icon.png";
		document.body.appendChild( speakericon );
		speakericon.style.top = 100 + "%";
		speakericon.style.visibility = "hidden";
		
		var animationofficon = document.createElement( "img" );
		animationofficon.id = "animationofficon";
		animationofficon.className = "icon";
		animationofficon.style.left = 1 + "%";
		animationofficon.alt = "Animation Pause";
		animationofficon.title = "Animation Pause";
		animationofficon.src = "assets/images/png/stopwatch_icon.png";
		document.body.appendChild( animationofficon );
		animationofficon.style.top = 100 + "%";
		animationofficon.style.visibility = "visible";		

		var gameicon = document.createElement( "img" );
		gameicon.id = "gameicon";
		gameicon.className = "icon";
		gameicon.style.left = .5 + "%";
		gameicon.alt = "Play POiNG";
		gameicon.title = "Play POiNG";
		gameicon.src = "assets/images/png/game_icon.png";
		document.body.appendChild( gameicon );
		gameicon.style.top = 100 + "%";
		gameicon.style.visibility = "visible";
		
		var twodicon = document.createElement( "img" );
		twodicon.id = "twodicon";
		twodicon.className = "icon";
		twodicon.style.left = .75 + "%";
		twodicon.alt = "Switch to 2D";
		twodicon.title = "Switch to 2D";
		twodicon.src = "assets/images/png/twod_icon.png";
		document.body.appendChild( twodicon );
		twodicon.style.top = 100 + "%";
		twodicon.style.visibility = "visible";
		
		var twittericon = document.createElement( "img" );
		twittericon.id = "twittericon";
		twittericon.className = "icon";
		twittericon.style.left = .8 + "%";;
		twittericon.alt = "Tweets";
		twittericon.title = "Tweets";
		twittericon.style.borderRight = "0px";
		twittericon.src = "assets/images/png/twitter_icon.png";
		document.body.appendChild( twittericon );
		twittericon.style.top = 100 + "%";
		twittericon.style.visibility = "visible";
		
		// CLOCK //
		
		clock = new THREE.Clock();
		
		// RENDERER//
		
		var canvascontainer = document.createElement( "div" );
		canvascontainer.id = "canvascontainer";
		document.body.appendChild( canvascontainer );
		canvas = document.createElement( "canvas" );
		canvas.id = "canvas";
		canvas.innerHTML = "Your browser does not support the HTML5 canvas tag."
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvascontainer.appendChild( canvas );
		renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: false } );
		renderer.setSize( window.innerWidth, window.innerHeight );
		canvascontainer.appendChild( renderer.domElement );
		
		// SCENE //
				
		scene = new THREE.Scene();
		
		// CAMERA//
		
		camera = new THREE.PerspectiveCamera( 55, canvascontainer.offsetWidth / canvascontainer.offsetHeight, 1, 1000 );
		camera.position.set( 30, -30, -30 );
		scene.add( camera );
		
		// SHADOWS //

		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;
		renderer.shadowCameraNear = 10;
		renderer.shadowCameraFar = camera.far;
		renderer.shadowCameraFov = 100;
		renderer.shadowMapBias = 0.0039;
		renderer.shadowMapDarkness = 1.0;
		renderer.shadowMapWidth = 256;
		renderer.shadowMapHeight = 256;
		
		// ORIGIN //
		
		origin = new THREE.Vector3( 0, 0, 0 );
		
		// LIGHTS //
		
		var ambientLight = new THREE.AmbientLight( 0x555555 );
		scene.add( ambientLight );

		var spotlight = new THREE.SpotLight( 0xffffcc );
		spotlight.position.set( 0, 40, 0);
		spotlight.shadowCameraVisible = false;
		spotlight.shadowDarkness = 0.7;
		spotlight.intensity = 1;
		spotlight.castShadow = true;
		scene.add(spotlight);
		
		sunLight = spotlight;
		
		// LOAD IN THE MODELS //
		
		var jsonLoader = new THREE.JSONLoader();
		
		jsonLoader.load( "assets/models/globe.js", function( geometry, material ) { 
		
			var loop = material.length;
			
			while ( loop-- )
			{
				material[ loop ].side = THREE.DoubleSide;							
			}

			var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );			
			model.castShadow = true;
			model.receiveShadow = true;
			scene.add( model );
			globe = model;
		
		}, "assets/models/textures/");
		
		jsonLoader.load( "assets/models/skybox.js", function( geometry, material ) { 
		
			var loop = material.length;
			
			while ( loop-- )
			{
				material[ loop ].side = THREE.DoubleSide;							
			}

			var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );			
			model.castShadow = false;
			model.receiveShadow = false;
			scene.add( model );
			
		}, "assets/models/textures/");
		
		jsonLoader.load( "assets/models/cloud.js", function( geometry, material ) { 
			
			var loop = material.length;
			
			while ( loop-- )
			{
				material[ loop ].side = THREE.DoubleSide;							
				material[ loop ].transparent = true;							
				material[ loop ].shading = THREE.none;
			}

			var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );						
			model.lookAt( camera.position );						
			model.position.set( 10, 0, 3 );
			scene.add( model );						
			cloud.push( model );
			cloud_xz.push( { x: model.position.x, y: model.position.y, z: model.position.z } );
			
			var loop = 5;
			
			while ( loop-- ) 
			{
				var clone = new THREE.Mesh( model.geometry, model.material );
				var x = ( Math.random() < 0.5 ? -1 : 1 ) * Math.floor( ( Math.random( ) * 10 ) + 3 );
				var y = ( Math.random() < 0.5 ? -1 : 1 ) * Math.floor( ( Math.random( ) *  6 ) + 3 );
				var z = ( Math.random() < 0.5 ? -1 : 1 ) * Math.floor( ( Math.random( ) * 10 ) + 3 );
				clone.position.set( x, y, z );
				scene.add( clone );							
				cloud.push( clone );
				cloud_xz.push( { x: clone.position.x, y: clone.position.y, z: clone.position.z } );
			}
			
		}, "assets/models/textures/");
		
		jsonLoader.load( "assets/models/moon.js", function( geometry, material ) { 

			var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );
			model.castShadow = true;
			model.receiveShadow = true;
			model.position.set( -10, 5, -5 );
			scene.add( model );						
			moon = model;
			
		}, "assets/models/textures/");
		
		jsonLoader.load( "assets/models/satellite.js", function( geometry, material ) { 
		
			var loop = material.length;
			
			while ( loop-- )
			{
				material[ loop ].side = THREE.DoubleSide;
			}

			var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );
			model.castShadow = true;
			model.receiveShadow = true;
			model.position.set( 10, -5, 5 );						
			scene.add( model );						
			satellite = model;
			
		}, "assets/models/textures/");
		
		// BEGIN PICKABLE OBJECTS //
		
		jsonLoader.load( "assets/models/code_sign.js", function( geometry, material ) { 
			
			var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );
			model.castShadow = true;
			model.receiveShadow = true;
			code_sign = model;
			scene.add( model );
			pickables.push( model );
			
		}, "assets/models/textures/");
		
		jsonLoader.load( "assets/models/images_sign.js", function( geometry, material ) { 
			
			var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );
			model.castShadow = true;
			model.receiveShadow = true;
			images_sign = model;
			scene.add( model );
			pickables.push( model );
			
		}, "assets/models/textures/");
		
		jsonLoader.load( "assets/models/videos_sign.js", function( geometry, material ) { 
			
			var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );
			model.castShadow = true;
			model.receiveShadow = true;
			videos_sign = model;
			scene.add( model );
			pickables.push( model );
			
		}, "assets/models/textures/");
		
		jsonLoader.load( "assets/models/models_sign.js", function( geometry, material ) { 
			
			var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );
			model.castShadow = true;
			model.receiveShadow = true;
			models_sign = model;
			scene.add( model );
			pickables.push( model );
			
		}, "assets/models/textures/");
		
		jsonLoader.load( "assets/models/contact_sign.js", function( geometry, material ) { 
			
			var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( material ) );
			model.castShadow = true;
			model.receiveShadow = true;
			contact_sign = model;
			scene.add( model );
			pickables.push( model );
			
		}, "assets/models/textures/");

		// END PICKABLE OBJECTS //
		
		// POST PROCESSING //

		var width = window.innerWidth || 1;
		var height = window.innerHeight || 1;
		var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false };
		renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );					
		composer = new THREE.EffectComposer( renderer, renderTarget );	

		var renderPass = new THREE.RenderPass( scene, camera );					
		//renderPass.renderToScreen = true;					
		composer.addPass( renderPass );
		
		dpr = 1;					
		if ( window.devicePixelRatio !== undefined ) 
		{
			dpr = window.devicePixelRatio;
		}					
		effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
		effectFXAA.uniforms[ 'resolution' ].value.set( 1 / ( window.innerWidth * dpr ), 1 / ( window.innerHeight * dpr ) );
		//effectFXAA.renderToScreen = true;					
		composer.addPass( effectFXAA );
		
		var edge = new THREE.ShaderPass( THREE.EdgeShader, "tDiffuse" );									
		edge.material.transparent = true;	
		//edge.renderToScreen = true;
		composer.addPass( edge );
	
		blend = new THREE.ShaderPass( THREE.AdditiveBlendShader, "tDiffuse2" );					
		blend.uniforms[ 'resolution' ].value.set( ( window.innerWidth * dpr ), ( window.innerHeight * dpr ) );
		blend.renderToScreen = true;
		composer.addPass( blend );
		
		// CONTROLS //

		controls = new THREE.TrackballControls( camera, renderer.domElement );
		controls.rotateSpeed = 1.0;					
		//controls.zoomSpeed = 1.2;					
		//controls.panSpeed = 0.2;				
		controls.noZoom = true;					
		controls.noPan = true;
		controls.noRotate = true;
		controls.staticMoving = false;					
		controls.dynamicDampingFactor = 0.3;				
		controls.minDistance = 1.1;					
		controls.maxDistance = 100;
		controls.keys = [ 16, 17, 18 ]; // [ rotateKey, zoomKey, panKey ]
		controls.target = origin;
		
		// PICKING //
		
		projector = new THREE.Projector();
		mouseVector = new THREE.Vector3();
		
		// OPENING ANIMATION //
		
		var iconFrom = { top: 100 };
		var iconTo   = { top:   7 };		
		iconAnimation = new TWEEN.Tween( iconFrom ).to( iconTo, 1500 );
		iconAnimation.easing( TWEEN.Easing.Back.InOut );
		iconAnimation.onUpdate( function( ) {
			speakericon.style.top = iconFrom.top - 6 + "%";
			animationofficon.style.top = iconFrom.top + "%";
			twodicon.style.top = iconFrom.top + 12 + "%";
			twittericon.style.top = iconFrom.top + 18.5 + "%";
			gameicon.style.top = iconFrom.top + 6 + "%";
		});
		iconAnimation.onComplete( function( ) {
			initaudio( );
			animationofficon.onclick = pauseResumeAnimation;
			twodicon.onclick     = function ( ) { destoryThreeD( ); };
			twittericon.onclick  = function ( ) { window.open( "http://www.twitter.com/lettier/" ) };
			gameicon.onclick     = function ( ) { window.open( "http://www.lettier.com/poing/" ) };
		});
		
		var whiteout = document.createElement( "div" );
		whiteout.id = "whiteout";
		whiteout.style.width = window.innerWidth + "px";
		whiteout.style.height = window.innerHeight + "px";
		whiteout.innerHTML = "&nbsp;";		
		whiteout.style.opacity = "100";
		document.body.appendChild( whiteout );		
		opacityFrom = { x: 1.0 };
		opacityTo = { x: 0.0 };		
		whiteoutanimation = new TWEEN.Tween( opacityFrom ).to( opacityTo, 3500 );
		whiteoutanimation.onUpdate( function( ) {
			whiteout.style.opacity = "" + opacityFrom.x;
		});
		whiteoutanimation.onComplete( function( ) {
			document.getElementById( "whiteout" ).parentNode.removeChild( document.getElementById( "whiteout" ) );
			iconAnimation.start( );
		});	
		
		var position = { x: 30, y: -30, z: -30 };
		var target = { x: 0, y: 10, z: 22 };
		cameraMovement = new TWEEN.Tween( position ).to( target, 3500 );
		cameraMovement.easing( TWEEN.Easing.Back.InOut );		
		cameraMovement.onUpdate( function( ) {
			camera.position.x = position.x;
			camera.position.y = position.y;
			camera.position.z = position.z;
			camera.lookAt( origin );
		});		
		cameraMovement.onComplete( function( ) {
			camera.lookAt( origin );
			controls.noRotate = false;
		});
		
		window.setTimeout( function() { whiteoutanimation.start( ); cameraMovement.start(); }, 1000 );	
		
		// RESIZE EVENT //

		canvas.addEventListener( 'resize', onWindowResize, false );
		
		// MOUSE MOVE EVENT //
		
		canvas.addEventListener( 'mousemove', onMouseMove, false );
		
		// MOUSE DOWN EVENT //
		
		canvas.addEventListener( 'mousedown', onMouseDown, true );
		
		// MOUSE UP EVENT //
		
		canvas.addEventListener( 'mouseup', onMouseUp, true );
		
		// START ANIMATION //
		
		requestAnimationFrame( animate );
	}
	
	// ONWNDOWRESIZE FUNCTION //

	function onWindowResize() 
	{				
		// UPDATE SCREEN RESOLUTION FOR SHADER //
		
		effectFXAA.uniforms[ 'resolution' ].value.set( 1 / ( window.innerWidth * dpr ), 1 / ( window.innerHeight * dpr ) );
		blend.uniforms[ 'resolution' ].value.set( ( window.innerWidth * dpr ), ( window.innerHeight * dpr ) );
		composer.setSize( window.innerWidth * dpr, window.innerHeight * dpr );
		
		// UPDATE CAMERA //

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		
		// UPDATE RENDERER SIZE //

		renderer.setSize( window.innerWidth, window.innerHeight );
	}
	
	// ONMOUSEMOVE FUNCTION //
	
	function onMouseMove( e )
	{
		mouseVector.x =     2 * ( e.clientX / window.innerWidth  ) - 1;
		mouseVector.y = 1 - 2 * ( e.clientY / window.innerHeight );
		
		raycaster = projector.pickingRay( mouseVector.clone(), camera );		
		intersects = raycaster.intersectObjects( pickables );
		
		if ( intersects[ 0 ] != undefined )
		{
			if ( code_sign != undefined && images_sign != undefined && models_sign != undefined && contact_sign != undefined && videos_sign != undefined )
			{
				switch ( intersects[ 0 ].object.id )
				{
					case code_sign.id:
						canvas.style.cursor = "pointer";
						mouseOver = code_sign.id;
						break;
					case models_sign.id:
						canvas.style.cursor = "pointer";
						mouseOver = models_sign.id;
						break;
					case videos_sign.id:
						canvas.style.cursor = "pointer";
						mouseOver = videos_sign.id;
						break;
					case contact_sign.id:
						canvas.style.cursor = "pointer";
						mouseOver = contact_sign.id;
						break;
					case images_sign.id:
						canvas.style.cursor = "pointer";
						mouseOver = images_sign.id;
						break;
					default:
						canvas.style.cursor = "move";
						mouseOver = -1;
						break;
				}
			}
		}
		else
		{
			canvas.style.cursor = "move";
			mouseOver = -1;
		}
	}
	
	// ONMOUSEDOWN EVENT CALLBACK FUNCTION //
	
	function onMouseDown( e )
	{
		lastMousePos.x = e.clientX;
		lastMousePos.y = e.clientY;		
	}
	
	// ONMOUSEUP EVENT CALLBACK FUNCTION //
	
	function onMouseUp( e )
	{
		onMouseMove( e );
		
		if ( lastMousePos.x != e.clientX && lastMousePos.y != e.clientY ) return;
		
		if ( code_sign != undefined && images_sign != undefined && models_sign != undefined && contact_sign != undefined && videos_sign != undefined && overContactForm != true )
		{
			switch ( mouseOver )
			{
				case code_sign.id:
					window.open( "http://www.github.com/lettier" );
					break;
				case models_sign.id:
					window.open( "https://sketchfab.com/lettier/" );
					break;
				case videos_sign.id:
					window.open( "https://www.youtube.com/user/dlettier" );
					break;
				case contact_sign.id:
					createContactDialog( );
					break;
				case images_sign.id:
					window.open( "https://secure.flickr.com/photos/30908838@N04/" );
					break;
				default:					
					break;
			}
		}
	}

	// ANIMATE FUNCTION //
	
	function animate() 
	{
		if ( !disableAnimation ) requestID = requestAnimationFrame( animate );
		
		delta = clock.getDelta();
		
		render();
	}
	
	// RENDER FUNCTION //
	
	function render() 
	{
		controls.update( );
		
		// OPTIMIZATION //
		
		var math_cos = Math.cos;
		var math_sin = Math.sin;
		var math_pi_180 = Math.PI / 180;
		var cos_angle_math_pi_180 = math_cos( angle * math_pi_180 );
		var sin_angle_math_pi_180 = math_sin( angle * math_pi_180 );
		
		// END OPTIMIZATION //
		
		if ( moon != undefined && satellite != undefined && cloud != undefined )
		{
			moon.rotation.x = ( 0.0 + 30.0 * cos_angle_math_pi_180 );
			moon.rotation.y = ( 0.0 + 30.0 * sin_angle_math_pi_180 );
			
			moon.position.x = ( 0.0 + 10.0 * cos_angle_math_pi_180 );
			moon.position.z = ( 0.0 + 10.0 * sin_angle_math_pi_180 );
			
			sunLight.position.x = ( 0.0 + 60.0 * cos_angle_math_pi_180 );
			sunLight.position.z = ( 0.0 + 60.0 * sin_angle_math_pi_180 );
			
			satellite.position.x = ( 0.0 + 10.0 * sin_angle_math_pi_180 * math_cos( 20.0 * math_pi_180 ) );
			satellite.position.y = ( 0.0 + 10.0 * sin_angle_math_pi_180 * math_sin( 20.0 * math_pi_180 ) );
			satellite.position.z = ( 0.0 + 10.0 * cos_angle_math_pi_180 );
			
			var loop = cloud.length;
			
			while ( loop-- )
			{						
				cloud[ loop ].position.x = ( 0.0 + cloud_xz[ loop ].x * math_cos( cloud_xz[ loop ].y * math_pi_180 ) );
				cloud[ loop ].position.z = ( 0.0 + cloud_xz[ loop ].x * math_sin( cloud_xz[ loop ].y * math_pi_180 ) );
				
				cloud_xz[ loop ].y += cloud_xz[ loop ].z * delta;
				cloud_xz[ loop ].y = cloud_xz[ loop ].y % 360.0;
				
				cloud[ loop ].lookAt( camera.position );
			}
			
			angle += 10.0 * delta;	
			angle  = angle % 360.0;

			angle2 += 5.0 * delta;
			angle2  = angle2 % 360;
		}
		
		TWEEN.update();

		composer.render( );
		
		//renderer.render( scene, camera );
	}
	
	// CREATECONTACTDIALOG FUNCTION //
	
	function createContactDialog( )
	{
		
		if ( contactcontainer != undefined )
		{
			document.getElementById( "contactcontainer" ).parentNode.removeChild( document.getElementById( "contactcontainer" ) );
			nameClr = 0;
			mailClr = 0;
			msgClr  = 0;
		}
		
		contactcontainer = document.createElement( "div" );
		contactcontainer.id = "contactcontainer";
		document.body.appendChild( contactcontainer );
		contactcontainer.innerHTML = "" +		
			"<form name=\"contact\" id=\"contact\" action=\"\" method=\"post\">" +
				"" +
				"<img id=\"mailicon\" src=\"assets/images/png/mail_icon.png\" alt=\"Contact\" title=\"Contact\"><font id=\"contactheader\"><b></b></font>" +
				"<br><br>" +
				"<input id=\"name\" class=\"input-form-text\" type=\"text\" name=\"name\" style=\"width:25.3em\" value=\"Name Here\" onFocus=\"clearForm( 'name' );\" title=\"Name Here\" alt=\"Name Here\">" +
				"<br><br>" +
				"<input id=\"email\" class=\"input-form-text\" type=\"text\" name=\"email\" style=\"width:25.3em\" value=\"Email Address Here\" onFocus=\"clearForm( 'email' );\" title=\"Email Here\" alt=\"Email Here\">" +
				"<br><br>" +
				"<select id=\"subject\" name=\"subject\" class=\"input-form-text\" style=\"width:25.8em\">" +
					"<option value=\"Select a Subject\" selected>Select a Subject</option>" +
					"<option value=\"General\">General</option>" +
					"<option value=\"Tech Support\">Tech Support</option>" +
					"<option value=\"Graphic Design\">Graphic Design</option>" +
					//"<option value=\"Advertising\">Advertising</option>" +
					//"<option value=\"LETTiERtv\">LETTiERtv</option>" +
					//"<option value=\"Music\">Music</option>" +
					//"<option value=\"Article Request\">Article Request</option>" +
				"</select>" +
				"<br><br>" +
				"<textarea id=\"message\" class=\"input-form-text\" rows=\"10\" name=\"message\" style=\"width:25.3em\" onFocus=\"clearForm( 'message' );\" title=\"Message Here\" alt=\"Message Here\">Message Here</textarea>" +
				"<br>" +
				"<table style=\"width:100%\">" +
					"<tr>" +
						"<td style=\"vertical-align: top; width:35%\">" +
							"<input id=\"send\" class=\"input-form-send-button\" type=\"submit\" name=\"send\" value=\"Send\" title=\"Send\" alt=\"Send\">&nbsp;" +
							"<input id=\"close\" class=\"input-form-close-button\" type=\"button\" name=\"close\" value=\"Close\" title=\"Close\" alt=\"Close\">" +	
						"</td>" +
						"<td style=\"padding-left: 12px; width:65%\">" +
							"<div id=\"response\" class=\"input-form-response\"><br><br><br><br><br></div>" +
						"</td>" + 
					"</tr>" +
				"</table>" +
			"</form>";
					
		// Center form and mail icon.
					
		document.getElementById( "contact" ).style.marginLeft = ( window.innerWidth / 2 ) - ( document.getElementById( "contact" ).offsetWidth / 2 ) + "px";
		
		document.getElementById( "mailicon" ).style.marginLeft = ( document.getElementById( "contact" ).offsetWidth / 2 ) - ( document.getElementById( "mailicon" ).offsetWidth / 2 ) + "px";
		
		contactcontainer.onmouseover = function ( ) { overContactForm = true; };
		contactcontainer.onmouseout = function ( ) { overContactForm = false; };
		
		document.getElementById( "close" ).onclick = function ( ) {
			
			document.getElementById( "contactcontainer" ).parentNode.removeChild( document.getElementById( "contactcontainer" ) );
			nameClr = 0;
			mailClr = 0;
			msgClr  = 0;

			contactcontainer = undefined;
			overContactForm = false;
		};
		
		// Play the pop sound effect.
		
		if ( soundplaying && audioContext != undefined ) 
		{
			var source = audioContext.createBufferSource();
			source.buffer = contactopensoundfx;
			source.loop = false;
			source.connect( audioContext.destination );
			source.buffer.gain = 0.3;
			source.start( 0 );
		}

		send = document.getElementById( "send" );
		response = document.getElementById( "response" );
		name = document.contact.name;
		mail = document.contact.email;
		subject = document.contact.subject;
		message = document.contact.message;
		contact = document.contact;
		
		try 
		{
			contact.addEventListener( "submit", function ( ) { return false; }, true );
		} 
		catch ( e ) 
		{
			contact.addEventListener( "onsubmit", function ( ) { return false; }, true );
		}
		
		send.onclick = function ( ) {

			var valid = '';
			var name = document.contact.name.value;
			var mail = document.contact.email.value;
			var subject = document.contact.subject.value;
			var message = document.contact.message.value;
			
			if ( name.length < 2 || name == "Name Here" ) 
			{
				valid += "<br> &#149; Did you put in a real name?";
			}
			if ( !mail.match(/^([a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,4}$)/i) || mail == "Email Here" ) 
			{
				valid += "<br> &#149; That e-mail address looks funky.";
			}
			if ( subject == "Select a Subject" )
			{
				valid += "<br> &#149; What is this message about?";
			}
			if ( message.length < 2 || message == "Message Here" ) 
			{
				valid += "<br> &#149; Did you even write a message?";
			}			
			if ( valid!='' ) 
			{
				response.style.display = "block";
				response.innerHTML = "WHOA! Wait a minute..." + valid;
			}
			else 
			{
				var datastr = 'name=' + name + '&subject=' + subject + '&email=' + mail + '&message=' + message;
				response.style.display = "block";
				response.innerHTML = "One sec, sending this off to HQ...";
				setTimeout( function ( ) { email( datastr ); }, 2000 );
			}
			return false;
		};		
	}
	
	// INITAUDIO FUNCTION //

	function initaudio( )
	{
		if ( audioContext != undefined )
		{
			function loadSound(  ) 
			{
				var bgsrequest = new XMLHttpRequest( );
				bgsrequest.open( 'GET', "assets/sound/ogg/background.ogg", true );
				bgsrequest.responseType = 'arraybuffer';
				bgsrequest.onload = function ( ) { try { audioContext.decodeAudioData( bgsrequest.response, function ( buffer ) {
					
							speakericon.style.visibility = "visible";

							var soundbuffer = buffer;
							var source = audioContext.createBufferSource();
							source.buffer = soundbuffer;
							source.loop = true;
							source.connect( audioContext.destination );
							source.buffer.gain = 0.0;
							source.start( 0 );

							backgroundsoundsource = source;
						} 
					); } catch( e ) { }				
				}
				bgsrequest.send();
				
				var popsrequest = new XMLHttpRequest( );
				popsrequest.open( 'GET', "assets/sound/ogg/pop.ogg", true );
				popsrequest.responseType = 'arraybuffer';
				popsrequest.onload = function ( ) { audioContext.decodeAudioData( popsrequest.response, function ( buffer ) {
							var soundbuffer = buffer;
							contactopensoundfx = soundbuffer;
						} 
					);				
				}
				popsrequest.send();
			}
			
			loadSound( );
			
			speakericon.onclick = function ( ) {
				
				if ( audioContext != undefined )
				{				
					if ( soundplaying )
					{		
						backgroundsoundsource.buffer.gain = 0.0;
						soundplaying = false;
						speakericon.alt = "Sound On";
						speakericon.title = "Sound On";
					}
					else
					{
						backgroundsoundsource.buffer.gain = 0.2;				
						soundplaying = true;
						speakericon.alt = "Sound Off";
						speakericon.title = "Sound Off";
						
					}
				}
			};		
		}
		else
		{
			backgroundsoundsource = document.createElement( "audio" );
			backgroundsoundsource.src = "assets/sound/ogg/background.ogg";			
			backgroundsoundsource.volume = 0.0;
			document.body.appendChild( backgroundsoundsource );
			
			backgroundsoundsource.addEventListener( "canplaythrough", function ( )
			{
				speakericon.style.visibility = "visible";
				
				backgroundsoundsource.play( );
				
				speakericon.onclick = function ( ) 
				{
					if ( backgroundsoundsource != undefined )
					{				
						if ( soundplaying )
						{		
							backgroundsoundsource.volume = 0.0;
							soundplaying = false;
							speakericon.alt = "Sound On";
							speakericon.title = "Sound On";
						}
						else
						{
							backgroundsoundsource.volume = 0.2;				
							soundplaying = true;
							speakericon.alt = "Sound Off";
							speakericon.title = "Sound Off";
							
						}
					}
				};
			}, false );
			
			backgroundsoundsource.addEventListener( 'ended', function ( ) 
			{
				
				this.currentTime = 0;
				this.play( );
				
			}, false );

			/*
			
			( elem = document.getElementById( "speakericon" ) ).parentNode.removeChild( elem );
			speakericon = document.createElement( "img" );
			speakericon.id = "speakericon";
			speakericon.className = "icon";
			speakericon.style.left = 1 + "%";			
			speakericon.style.top = 0.6645833 + "%";
			speakericon.alt = "Audio Disabled";
			speakericon.title = "Audio Disabled";
			speakericon.src = "assets/images/png/speaker_icon_disabled.png";
			document.body.appendChild( speakericon );
			speakericon.style.visibility = "visible";
			
			*/
		}
	}
	
	// PAUSERESUMEANIMATION FUNCTION //
	
	function pauseResumeAnimation( )
	{
		if ( animationOff )
		{
			disableAnimation = 0;
			animationOff = false;
			animationofficon.title = "Animation Pause";
			animationofficon.alt = "Animation Pause";
			animate( );
		}
		else
		{		
			disableAnimation = 1;
			animationOff = true;
			animationofficon.title = "Animation Resume";
			animationofficon.alt = "Animation Resume";
		}
	}
	
	// DESTROYTHREED FUNCTION //
	
	function destoryThreeD( )
	{
		pauseResumeAnimation( );
		
		cancelAnimationFrame( requestID );
		
		// REMOVE RESIZE EVENT //

		canvas.removeEventListener( 'resize', onWindowResize, false );
		
		// REMOVE MOUSE MOVE EVENT //
		
		canvas.removeEventListener( 'mousemove', onMouseMove, false );
		
		// REMOVE MOUSE DOWN EVENT //
		
		canvas.removeEventListener( 'mousedown', onMouseDown, true );
		
		// REMOVE MOUSE UP EVENT //
		
		canvas.removeEventListener( 'mouseup', onMouseUp, true );
		
		// STOP SOUND //
		
		if ( soundplaying )
		{		
			try
			{
			
				backgroundsoundsource.buffer.gain = 0.0;
				soundplaying = false;
				speakericon.alt = "Sound On";
				speakericon.title = "Sound On";
				backgroundsoundsource.stop( 0 );
			}
			catch( e )
			{
				backgroundsoundsource.pause( );
			}
		}
		
		// REMOVE AUDIOCONTEXT //
		
		audioContext = null;
		
		// REMOVE ALL NODES IN BODY TREE //
		
		while ( document.body.hasChildNodes( ) ) 
		{
			document.body.removeChild( document.body.lastChild );
		}
		
		twoD( );
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function twoD( )
{
	// GLOBALS //
	
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	try
	{
		var audioContext = new AudioContext();
	}
	catch( err )
	{
	}
	
	var canvas;
	var context2d;
	
	var backgroundsoundsource;
	var speakericon;
	
	var contactcontainer;
	var overContactForm = false;
	var contactopensoundfx;

	var delta = 0.0;	
	var then = 0.0;
	var date_now = Date.now;
	
	var globeRotAngle = 0.0;
	var sway = true;

	var mouseX;
	var mouseY;
	var overSign = null;
	
	var contactBoundingBox = { wO: 474, hO: 116, xO: 350, yO: 308, wS: 0.0, hS: 0.0, xS: 0.0, yS: 0.0, r: -19 }
	var contactBoundPoints = { ul: { x: 0, y: 0 } }
	var codeBoundingBox = { wO: 400, hO: 100, xO: 25, yO: 664, wS: 0.0, hS: 0.0, xS: 0.0, yS: 0.0, r: -42 }
	var codeBoundPoints = { ul: { x: 0, y: 0 } }
	
	var soundplaying = false;
	
	var disableAnimation = 0;
	var animationOff = false;

	var globe;
	var cloud;
	var clouds = new Array( );
	var moon;
	var satellite;
	
	var numofclouds = 5;
	
	// RUN // 
	
	initScene( );
	
	// INITSCENE FUNCTION //
	
	function initScene( )
	{
		// They cannot move the canvas.
		
		document.body.style.cursor = "default";
		
		// CREATE THE CANVAS //
		
		var canvascontainer = document.createElement( "div" );
		canvascontainer.id = "canvascontainer";
		document.body.appendChild( canvascontainer );
		canvascontainer.style.width = window.innerWidth + "px";
		canvascontainer.style.height = window.innerHeight + "px";		
		canvas = document.createElement( "canvas" );
		canvas.id = "canvas";
		canvas.innerHTML = "Your browser does not support the HTML5 canvas tag."
		//canvas.style.width = window.innerWidth + "px";
		//canvas.style.height = window.innerHeight + "px";
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvascontainer.appendChild( canvas );
		context2d = canvas.getContext( "2d" );
		
		// ICONS //
		
		speakericon = document.createElement( "img" );
		speakericon.id = "speakericon";
		speakericon.className = "icon";
		speakericon.style.left = 1 + "%";
		speakericon.alt = "Sound On";
		speakericon.title = "Sound On";
		speakericon.src = "assets/images/png/speaker_icon.png";
		document.body.appendChild( speakericon );
		speakericon.style.top = 100 + "%";
		speakericon.style.visibility = "hidden";
		
		var animationofficon = document.createElement( "img" );
		animationofficon.id = "animationofficon";
		animationofficon.className = "icon";
		animationofficon.style.left = 1 + "%";
		animationofficon.alt = "Animation Pause";
		animationofficon.title = "Animation Pause";
		animationofficon.src = "assets/images/png/stopwatch_icon.png";
		document.body.appendChild( animationofficon );
		animationofficon.style.top = 100 + "%";
		animationofficon.style.visibility = "visible";

		var gameicon = document.createElement( "img" );
		gameicon.id = "gameicon";
		gameicon.className = "icon";
		gameicon.style.left = .5 + "%";
		gameicon.alt = "Play POiNG";
		gameicon.title = "Play POiNG";
		gameicon.src = "assets/images/png/game_icon.png";
		document.body.appendChild( gameicon );
		gameicon.style.top = 100 + "%";
		gameicon.style.visibility = "visible";
		
		var twittericon = document.createElement( "img" );
		twittericon.id = "twittericon";
		twittericon.className = "icon";
		twittericon.style.left = .8 + "%";
		twittericon.style.borderRight = "0px";
		twittericon.alt = "Tweets";
		twittericon.title = "Tweets";
		twittericon.src = "assets/images/png/twitter_icon.png";
		document.body.appendChild( twittericon );
		twittericon.style.top = 100 + "%";
		twittericon.style.visibility = "visible";		
		
		// IMAGES //
		
		globe = new Image();
		globe.src = "assets/images/png/globe_top.png";
		globe.onload = function ( ) {			
			var aspectratio = globe.width / globe.height; 
			var height = window.innerHeight / 1.5;
			var width =  height * aspectratio;
			var x = ( window.innerWidth - width ) / 2;
			var y = ( window.innerHeight - height );
			var y = y + ( window.innerHeight * 0.080808081 );			
			drawRotatedGlobe( globe, x + ( width / 2 ), y + ( height / 1 ), width, height, -10 );
		}
		
		cloud = new Image();
		cloud.src = "assets/images/png/cloud.png";
		cloud.onload = function ( ) {
			
			var loop = numofclouds;
			
			while ( loop-- )
			{
				var aspectratio = cloud.width / cloud.height; 
				var height = window.innerHeight / getRandomInt( 4, 10 );
				var width =  height * aspectratio;
				var x = ( window.innerWidth - width ) / getRandomInt( 1, 60 );
				var y = height - getRandomInt( 50, 55 );		
				context2d.drawImage( cloud, x, y, width, height );
				clouds.push( { a: aspectratio, h: height, w: width, x: x, y: y, s: getRandomInt( 10, 50 ) } );
			}
		}
		
		var moonImg = new Image( );
		moonImg.src = "assets/images/png/moon.png";
		moonImg.onload = function ( ) {
			var aspectratio = moonImg.height / moonImg.width;			
			var height = .0001 * Math.pow( ( 0 - ( window.innerWidth / 2 ) ), 2 ) + 30;
			var width =  height * aspectratio;
			var y =  height + getRandomInt( 30, 40 );
			var x = 0;			
			drawRotatedMoon( moonImg, x + ( width / 2 ), y + ( height / 2 ), width, height, 0.0 );
			moon = { i: moonImg, a: aspectratio, h: height, w: width, x: x, y: y, s: getRandomInt( 50, 60 ), r: 0.0, wait: 0, timer: 0, waitTime: 150 };
		}
		
		var satelliteImg = new Image( );
		satelliteImg.src = "assets/images/png/satellite.png";
		satelliteImg.onload = function ( ) {
			var aspectratio = satelliteImg.width / satelliteImg.height;
			var x = getRandomInt( window.innerWidth - 50, window.innerWidth - 500 );			
			var height = .0001 * Math.pow( ( x - ( window.innerWidth / 2 ) ), 2 ) + 50;
			var width =  height * aspectratio;
			var y =  height + getRandomInt( 120, 300 );
			drawRotatedMoon( satelliteImg, x + ( width / 2 ), y + ( height / 2 ), width, height, 0.0 );
			satellite = { i: satelliteImg, a: aspectratio, h: height, w: width, x: x, y: y, s: getRandomInt( 70, 80 ), wait: 0, timer: 0, waitTime: 150 };
		}
		
		// OPENING ANIMATION //
		
		var iconFrom = { top: 100 };
		var iconTo   = { top:   7 };		
		iconAnimation = new TWEEN.Tween( iconFrom ).to( iconTo, 1500 );
		iconAnimation.easing( TWEEN.Easing.Back.InOut );
		iconAnimation.onUpdate( function( ) {
			speakericon.style.top = iconFrom.top - 6 + "%";
			animationofficon.style.top = iconFrom.top + "%";
			twittericon.style.top = iconFrom.top + 11.5 + "%";
			gameicon.style.top = iconFrom.top + 6 + "%";
		});
		iconAnimation.onComplete( function( ) {
			initaudio( );
			animationofficon.onclick = pauseResumeAnimation;
			twittericon.onclick  = function ( ) { window.open( "http://www.twitter.com/lettier/" ) };
			gameicon.onclick     = function ( ) { window.open( "http://www.lettier.com/poing/" ) };
		});
		
		var whiteout = document.createElement( "div" );
		whiteout.id = "whiteout";
		whiteout.style.width = window.innerWidth + "px";
		whiteout.style.height = window.innerHeight + "px";
		whiteout.innerHTML = "&nbsp;";		
		whiteout.style.opacity = "100";
		document.body.appendChild( whiteout );		
		opacityFrom = { x: 1.0 };
		opacityTo = { x: 0.0 };		
		whiteoutanimation = new TWEEN.Tween( opacityFrom ).to( opacityTo, 3500 );
		whiteoutanimation.onUpdate( function( ) {
			whiteout.style.opacity = "" + opacityFrom.x;
		});
		whiteoutanimation.onComplete( function( ) {
			document.getElementById( "whiteout" ).parentNode.removeChild( document.getElementById( "whiteout" ) );
			iconAnimation.start( );
		});
		
		window.setTimeout( function() { whiteoutanimation.start( ); }, 1000 );
		
		// RESIZE EVENT //

		canvas.addEventListener( 'resize', onWindowResize, false );
		
		// MOUSE MOVE EVENT //
		
		canvas.addEventListener( 'mousemove', onMouseMove, false );
		
		// MOUSE DOWN EVENT //
		
		canvas.addEventListener( 'mousedown', onMouseDown, true );
		
		// MOUSE UP EVENT //
		
		canvas.addEventListener( 'mouseup', onMouseUp, true );
		
		// START ANIMATION //
		
		requestAnimationFrame( animate );
	}
	
	// ONWNDOWRESIZE FUNCTION //
	
	function onWindowResize( e )
	{
	}
	
	// ONMOUSEMOVE FUNCTION //
	
	function onMouseMove( e )
	{		
		mouseX = e.pageX;
		mouseY = e.pageY;
		
		// OVER CONTACT BOUNDING BOX? //
		
		var newContactBoundingPointUl = rotate( translate( coordsToMatrix( contactBoundPoints.ul.x, contactBoundPoints.ul.y ), -contactBoundPoints.ul.x, -contactBoundPoints.ul.y  ), contactBoundingBox.r );
		var newMouseCoords = rotate( translate( coordsToMatrix( mouseX, mouseY ), -contactBoundPoints.ul.x, -contactBoundPoints.ul.y  ), contactBoundingBox.r + globeRotAngle );
		var mouseXPrime = newMouseCoords.elements[ 0 ][ 0 ];
		var mouseYPrime = newMouseCoords.elements[ 1 ][ 0 ];
		
		if ( mouseXPrime >= 0 && mouseXPrime <= contactBoundingBox.wS )
		{
			if ( mouseYPrime >= 0 && mouseYPrime <= contactBoundingBox.hS )
			{
				canvas.style.cursor = "pointer";
				overSign = "contact";
				return;
			}
			else
			{
				canvas.style.cursor = "default";
				overSign = null;
			}
		}
		else
		{
			canvas.style.cursor = "default";
			overSign = null;
		}
		
		// OVER CODE BOUNDING BOX? //
		
		newContactBoundingPointUl = rotate( translate( coordsToMatrix( codeBoundPoints.ul.x, codeBoundPoints.ul.y ), -codeBoundPoints.ul.x, -codeBoundPoints.ul.y  ), codeBoundingBox.r );
		newMouseCoords = rotate( translate( coordsToMatrix( mouseX, mouseY ), -codeBoundPoints.ul.x, -codeBoundPoints.ul.y  ), codeBoundingBox.r + globeRotAngle );
		mouseXPrime = newMouseCoords.elements[ 0 ][ 0 ];
		mouseYPrime = newMouseCoords.elements[ 1 ][ 0 ];
		
		if ( mouseXPrime >= 0 && mouseXPrime <= codeBoundingBox.wS )
		{
			if ( mouseYPrime >= 0 && mouseYPrime <= codeBoundingBox.hS )
			{
				canvas.style.cursor = "pointer";
				overSign = "code";
			}
			else
			{
				canvas.style.cursor = "default";
				overSign = null;
			}
		}
		else
		{
			canvas.style.cursor = "default";
			overSign = null;
		}
	}
	
	// ONMOUSEDOWN FUNCTION //
	
	function onMouseDown( e )
	{
	}
	
	// ONMOUSEUP FUNCTION //
	
	function onMouseUp( e )
	{
		if ( overSign != null && overContactForm != true )
		{
			if ( overSign == "contact" )
			{
				createContactDialog( );
			}
			else if ( overSign == "code" )
			{
				window.open( "http://www.github.com/lettier" );
			}
		}
	}
	
	function animate( )
	{
		if ( !disableAnimation ) requestAnimationFrame( animate );
		
		delta = 0;
		
		render( );
	}
	
	function render( )
	{
		// OPTIMIZATION //
		
		var wW = window.innerWidth;
		var wH = window.innerHeight;
		
		var math_pow = Math.pow;
		
		// END OPTIMIZATION //
		
		
		// DELTA BETWEEN FRAMES //
		
		var now = date_now( );
		
		delta = ( now - then ) / 1000;
		
		if ( delta > .1 ) delta = 0.1;
			
		then = now;

		// UPDATE ANY TWEENS //
		
		TWEEN.update();
		
		// CLEAR CANVAS MAKING IT READY FOR A REDRAW //
		
		context2d.clearRect( 0, 0, canvas.width, canvas.height );
		
		// MOON //
		
		if ( moon != undefined )
		{		
			if ( moon.wait == 0 )
			{
				if ( moon.x > 1 ) moon.h = .0001 * math_pow( ( moon.x - ( wW / 2 ) ), 2 ) + 30;
				moon.w = moon.h * moon.a;
				drawRotatedMoon( moon.i, moon.x + ( moon.w / 2 ), moon.y + ( moon.h / 2 ), moon.w, moon.h, moon.r );
				moon.r = moon.r - ( 20.0 * delta );
				if ( moon.r <= -360.0 ) moon.r = 0;
				moon.x = moon.x + ( moon.s * delta ); // Advanced x coordinate by speed.
				//moon.s = moon.s + .5; // Increase speed.
				if ( moon.x >= wW ) // Reset when cloud goes off screen.
				{
					var y = moon.h + getRandomInt( 30, 40 );		
					moon.s = getRandomInt( 50, 60 );
					moon.x = 0 - moon.w;
					moon.y = y;
					moon.wait = 1;
				}
			}
			else
			{
				moon.timer = moon.timer + 1;
				
				if ( moon.timer > moon.waitTime )
				{
					moon.timer = 0;
					moon.wait = 0;
				}
			}
		}
		
		// SATELLITE //
		
		if ( satellite != undefined )
		{		
			if ( satellite.wait == 0 )
			{
				if ( satellite.x < ( wW - 0 ) ) satellite.h = .0001 * math_pow( ( satellite.x - ( wW / 2 ) ), 2 ) + 50;
				satellite.w = satellite.h * satellite.a;
				context2d.drawImage( satellite.i, satellite.x, satellite.y, satellite.w, satellite.h );
				satellite.x = satellite.x - ( satellite.s * delta ); // Advanced x coordinate by speed.
				//satellite.s = satellite.s + .9; // Increase speed.
				if ( satellite.x <= ( -1 * satellite.w ) ) // Reset when cloud goes off screen.
				{
					var y = satellite.h + getRandomInt( 120, 300 );		
					satellite.s = getRandomInt( 70, 80 );
					satellite.x = wW;
					satellite.y = y;
					satellite.wait = 1;
				}
			}
			else
			{
				satellite.timer = satellite.timer + 1;
				
				if ( satellite.timer > satellite.waitTime )
				{
					satellite.timer = 0;
					satellite.wait = 0;
				}
			}
		}
		
		// GLOBE //
		
		if ( globe != undefined )
		{
			var aspectratio = globe.width / globe.height; 
			var height = wH / 1.5;
			var width =  height * aspectratio;
			var x = ( wW - width ) / 2.6;
			var y = ( wH - height );		
			var y = y + ( wH * 0.080808081 );
			
			if ( sway == true )
			{
				globeRotAngle = globeRotAngle - ( 1 * delta );
				
				if ( globeRotAngle < -5.0 )
				{
					sway = false;
					globeRotAngle = -5.0;
				}
			}
			else
			{
				globeRotAngle = globeRotAngle + ( 1 * delta );
				
				if ( globeRotAngle > 5.0 )
				{
					sway = true;
					globeRotAngle = 5.0;
				}
			}
			
			drawRotatedGlobe( globe, x + ( width / 2 ), y + ( height / 1 ), width, height, globeRotAngle );
		}
		
		// CLOUDS //
		
		if ( clouds[ 0 ] != undefined )
		{		
			var loop = numofclouds;
			
			while ( loop-- )
			{
				context2d.drawImage( cloud, clouds[ loop ].x, clouds[ loop ].y, clouds[ loop ].w, clouds[ loop ].h );
				clouds[ loop ].x = clouds[ loop ].x + ( clouds[ loop ].s * delta ); // Advanced x coordinate by speed.
				//clouds[ loop ].s = clouds[ loop ].s + getRandomInt( 1, 2 ); // Increase speed.
				if ( clouds[ loop ].x >= wW ) // Reset when cloud goes off screen.
				{
					var aspectratio = cloud.width / cloud.height; 
					var height = wH / getRandomInt( 4, 10 );
					var width =  height * aspectratio;
					var y = height - getRandomInt( 50, 55 );		
					clouds[ loop ].h = height;
					clouds[ loop ].w = width;
					clouds[ loop ].s = getRandomInt( 10, 50 );
					clouds[ loop ].x = 0 - clouds[ loop ].w;
					clouds[ loop ].y = y;
				}
			}
		}
	}
	
	// CREATECONTACTDIALOG FUNCTION //
	
	function createContactDialog( )
	{
		if ( contactcontainer != undefined )
		{
			document.getElementById( "contactcontainer" ).parentNode.removeChild( document.getElementById( "contactcontainer" ) );
			document.getElementById( "closebutton"      ).parentNode.removeChild( document.getElementById( "closebutton"      ) );
			nameClr = 0;
			mailClr = 0;
			msgClr  = 0;
		}
		
		contactcontainer = document.createElement( "div" );
		contactcontainer.id = "contactcontainer";
		document.body.appendChild( contactcontainer );
		contactcontainer.innerHTML = "" +
			"<form name=\"contact\" id=\"contact\" action=\"\" method=\"post\">" +
				"" +
				"<img id=\"mailicon\" src=\"assets/images/png/mail_icon.png\" alt=\"Contact\" title=\"Contact\"><font id=\"contactheader\"><b></b></font>" +
				"<br><br>" +
				"<input id=\"name\" class=\"input-form-text\" type=\"text\" name=\"name\" style=\"width:25.3em\" value=\"Name Here\" onFocus=\"clearForm( 'name' );\" title=\"Name Here\" alt=\"Name Here\">" +
				"<br><br>" +
				"<input id=\"email\" class=\"input-form-text\" type=\"text\" name=\"email\" style=\"width:25.3em\" value=\"Email Address Here\" onFocus=\"clearForm( 'email' );\" title=\"Email Here\" alt=\"Email Here\">" +
				"<br><br>" +
				"<select id=\"subject\" name=\"subject\" class=\"input-form-text\" style=\"width:25.8em\">" +
					"<option value=\"Select a Subject\" selected>Select a Subject</option>" +
					"<option value=\"General\">General</option>" +
					"<option value=\"Tech Support\">Tech Support</option>" +
					"<option value=\"Graphic Design\">Graphic Design</option>" +
					//"<option value=\"Advertising\">Advertising</option>" +
					//"<option value=\"LETTiERtv\">LETTiERtv</option>" +
					//"<option value=\"Music\">Music</option>" +
					//"<option value=\"Article Request\">Article Request</option>" +
				"</select>" +
				"<br><br>" +
				"<textarea id=\"message\" class=\"input-form-text\" rows=\"10\" name=\"message\" style=\"width:25.3em\" onFocus=\"clearForm( 'message' );\" title=\"Message Here\" alt=\"Message Here\">Message Here</textarea>" +
				"<br>" +
				"<table>" +
					"<tr>" +
						"<td style=\"vertical-align: top;\">" +
							"<input id=\"send\" class=\"input-form-send-button\" type=\"submit\" name=\"send\" value=\"Send\" title=\"Send\" alt=\"Send\">&nbsp;" +
							"<input id=\"close\" class=\"input-form-close-button\" type=\"button\" name=\"close\" value=\"Close\" title=\"Close\" alt=\"Close\">" +	
						"</td>" +
						"<td style=\"padding-left: 12px;\">" +
							"<div id=\"response\" class=\"input-form-response\"><br><br><br><br><br></div>" +
						"</td>" + 
					"</tr>" +
				"</table>" +
			"</form>";
					
		// Center form and mail icon.
					
		document.getElementById( "contact" ).style.marginLeft = ( window.innerWidth / 2 ) - ( document.getElementById( "contact" ).offsetWidth / 2 ) + "px";
		
		document.getElementById( "mailicon" ).style.marginLeft = ( document.getElementById( "contact" ).offsetWidth / 2 ) - ( document.getElementById( "mailicon" ).offsetWidth / 2 ) + "px";
					
		contactcontainer.onmouseover = function ( ) { overContactForm = true; };
		contactcontainer.onmouseout = function ( ) { overContactForm = false; };
		
		document.getElementById( "close" ).onclick = function ( ) {
			
			document.getElementById( "contactcontainer" ).parentNode.removeChild( document.getElementById( "contactcontainer" ) );
			nameClr = 0;
			mailClr = 0;
			msgClr  = 0;

			contactcontainer = undefined;
			overContactForm = false;
		};
		
		// Play the pop sound effect.
		if ( soundplaying && audioContext != undefined ) 
		{
			var source = audioContext.createBufferSource();
			source.buffer = contactopensoundfx;
			source.loop = false;
			source.connect( audioContext.destination );
			source.buffer.gain = 0.3;
			source.start( 0 );
		}

		send = document.getElementById( "send" );
		response = document.getElementById( "response" );
		name = document.contact.name;
		mail = document.contact.email;
		subject = document.contact.subject;
		message = document.contact.message;
		contact = document.contact;
		
		try 
		{
			contact.addEventListener( "submit", function ( ) { return false; }, true );
		} 
		catch ( e ) 
		{
			contact.addEventListener( "onsubmit", function ( ) { return false; }, true );
		}
		
		send.onclick = function ( ) {

			var valid = '';
			var name = document.contact.name.value;
			var mail = document.contact.email.value;
			var subject = document.contact.subject.value;
			var message = document.contact.message.value;
			
			if ( name.length < 2 || name == "Name Here" ) 
			{
				valid += "<br> &#149; Did you put in a real name?";
			}
			if ( !mail.match(/^([a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,4}$)/i) || mail == "Email Here" ) 
			{
				valid += "<br> &#149; That e-mail address looks funky.";
			}
			if ( subject == "Select a Subject" )
			{
				valid += "<br> &#149; What is this message about?";
			}
			if ( message.length < 2 || message == "Message Here" ) 
			{
				valid += "<br> &#149; Did you even write a message?";
			}			
			if ( valid!='' ) 
			{
				response.style.display = "block";
				response.innerHTML = "WHOA! Wait a minute..." + valid;
			}
			else 
			{
				var datastr = 'name=' + name + '&subject=' + subject + '&email=' + mail + '&message=' + message;
				response.style.display = "block";
				response.innerHTML = "One sec, sending this off to HQ...";
				setTimeout( function ( ) { email( datastr ); }, 2000 );
			}
			return false;
		};		
	}
	
	// INITAUDIO FUNCTION //

	function initaudio( )
	{
		if ( audioContext != undefined )
		{
			function loadSound(  ) 
			{
				var bgsrequest = new XMLHttpRequest( );
				bgsrequest.open( 'GET', "assets/sound/ogg/background.ogg", true );
				bgsrequest.responseType = 'arraybuffer';
				bgsrequest.onload = function ( ) { audioContext.decodeAudioData( bgsrequest.response, function ( buffer ) {				
							
							speakericon.style.visibility = "visible";

							var soundbuffer = buffer;
							var source = audioContext.createBufferSource();
							source.buffer = soundbuffer;
							source.loop = true;
							source.connect( audioContext.destination );
							source.buffer.gain = 0.0;
							source.start( 0 );

							backgroundsoundsource = source;
						} 
					);				
				}
				bgsrequest.send();
				
				var popsrequest = new XMLHttpRequest( );
				popsrequest.open( 'GET', "assets/sound/ogg/pop.ogg", true );
				popsrequest.responseType = 'arraybuffer';
				popsrequest.onload = function ( ) { audioContext.decodeAudioData( popsrequest.response, function ( buffer ) {				

							var soundbuffer = buffer;
							contactopensoundfx = soundbuffer;
						} 
					);				
				}
				popsrequest.send();
			}
			
			loadSound( );
			
			speakericon.onclick = function ( ) {
				
				if ( audioContext != undefined )
				{				
					if ( soundplaying )
					{		
						backgroundsoundsource.buffer.gain = 0.0;
						soundplaying = false;
						speakericon.alt = "Sound On";
						speakericon.title = "Sound On";
					}
					else
					{
						backgroundsoundsource.buffer.gain = 0.2;				
						soundplaying = true;
						speakericon.alt = "Sound Off";
						speakericon.title = "Sound Off";
						
					}
				}
			};		
		}
		else
		{
			backgroundsoundsource = document.createElement( "audio" );
			backgroundsoundsource.src = "assets/sound/ogg/background.ogg";			
			backgroundsoundsource.volume = 0.0;
			document.body.appendChild( backgroundsoundsource );
			
			backgroundsoundsource.addEventListener( "canplaythrough", function ( )
			{
				speakericon.style.visibility = "visible";
				
				backgroundsoundsource.play( );
				
				speakericon.onclick = function ( ) 
				{
					if ( backgroundsoundsource != undefined )
					{				
						if ( soundplaying )
						{		
							backgroundsoundsource.volume = 0.0;
							soundplaying = false;
							speakericon.alt = "Sound On";
							speakericon.title = "Sound On";
						}
						else
						{
							backgroundsoundsource.volume = 0.2;				
							soundplaying = true;
							speakericon.alt = "Sound Off";
							speakericon.title = "Sound Off";
							
						}
					}
				};
			}, true );
			
			backgroundsoundsource.addEventListener( 'ended', function ( ) 
			{
				this.currentTime = 0;
				this.play( );
				
			}, false );
			
			/*
			
			( elem = document.getElementById( "speakericon" ) ).parentNode.removeChild( elem );
			speakericon = document.createElement( "img" );
			speakericon.id = "speakericon";
			speakericon.className = "icon";
			speakericon.style.left = 1 + "%";			
			speakericon.style.top = 0.6645833 + "%";
			speakericon.alt = "Audio Disabled";
			speakericon.title = "Audio Disabled";
			speakericon.src = "assets/images/png/speaker_icon_disabled.png";
			document.body.appendChild( speakericon );
			speakericon.style.visibility = "visible";
			
			*/
		}
	}
	
	// PAUSERESUMEANIMATION FUNCTION //
	
	function pauseResumeAnimation( )
	{
		if ( animationOff )
		{
			disableAnimation = 0;
			animationOff = false;
			animationofficon.title = "Animation Pause";
			animationofficon.alt = "Animation Pause";
			animate( );
		}
		else
		{		
			disableAnimation = 1;
			animationOff = true;
			animationofficon.title = "Animation Resume";
			animationofficon.alt = "Animation Resume";
		}
	}
	
	// DRAWROTATEDGLOBE FUNCTION //

	function drawRotatedGlobe( image, pivotX, pivotY, width, height, angle ) 
	{ 
		// globeRotAngle = 0.0;
		
		// TRANS, ROT, AND DRAW GLOBE //
		
		context2d.save( ); 
		context2d.translate( pivotX, pivotY );
		context2d.rotate( globeRotAngle * ( Math.PI / 180 ) );		
		context2d.drawImage( image, -( width / 2 ), -height, width, height );
		
		// VISUALIZE MOUSE IN CANVAS //
		
		// ROT CONTEXT BACK INTO NORMAL POSITION, DRAW RECT, THEN ROT BACK // 
		
		/* UNCOMMENT TO SEE MOUSE COORDS IN CANVAS 
		
		context2d.rotate( -globeRotAngle * ( Math.PI / 180 ) );		
		context2d.beginPath();
		context2d.rect( -pivotX + ( mouseX - 10 ), -pivotY + ( mouseY - 10 ), 20, 20 );
		context2d.lineWidth = 7;
		context2d.strokeStyle = 'blue';
		context2d.stroke( );		
		context2d.rotate( globeRotAngle * ( Math.PI / 180 ) );
		
		*/
		
		// CONTACT BOX //
		
		contactBoundingBox.wS =   width * ( contactBoundingBox.wO / image.width  );
		contactBoundingBox.hS =  height * ( contactBoundingBox.hO / image.height );
		contactBoundingBox.xS =   width * ( contactBoundingBox.xO / image.width  );
		contactBoundingBox.yS =  height * ( contactBoundingBox.yO / image.height );
		
		/* UNCOMMENT TO SEE CONTACT BOUNDING BOX IN CANVAS SPACE
		
		context2d.translate( -( width / 2 ) + ( width * ( 350 / image.width ) ), -height + ( height * ( 308 / image.height ) ) );
		context2d.rotate( -19 * ( Math.PI / 180 ) );
		context2d.beginPath();
		context2d.rect( 0, 0, width * ( 474 / globe.width ), height * ( 116 / globe.height ) );
		context2d.lineWidth = 7;
		context2d.strokeStyle = 'red';
		context2d.stroke( );
		context2d.rotate( 19 * ( Math.PI / 180 ) );
		context2d.translate( -( -( width / 2 ) + ( width * ( 350 / image.width ) ) ), -( -height + ( height * ( 308 / image.height ) ) ) );
		
		*/
		
		// CODE BOX //
		
		codeBoundingBox.wS =   width * ( codeBoundingBox.wO / image.width  );
		codeBoundingBox.hS =  height * ( codeBoundingBox.hO / image.height );
		codeBoundingBox.xS =   width * ( codeBoundingBox.xO / image.width  );
		codeBoundingBox.yS =  height * ( codeBoundingBox.yO / image.height );
		
		/* UNCOMMENT TO SEE BOUNDING BOX
	
		context2d.translate( -( width / 2 ) + codeBoundingBox.xS, -height + codeBoundingBox.yS );
		context2d.rotate( codeBoundingBox.r * ( Math.PI / 180 ) );
		context2d.beginPath( );
		context2d.rect( 0, 0, codeBoundingBox.wS, codeBoundingBox.hS );
		context2d.lineWidth = 7;
		context2d.strokeStyle = 'red';
		context2d.stroke( );
		
		*/
		
		// RESTORE ORIGINAL TRANSFORMATION / RESET CANVAS SPACE TO MATCH SCREEN SPACE //
		
		context2d.restore();
		
		// TRANSLATE AND TRANSFORM RECT CANVAS COORDS TO SCREEN COORDS
		
		// CONTACT BOX //
		
		var rectCoordsRotTransRotTrans = translate( rotate( translate( rotate( coordsToMatrix( 0, 0 ), -contactBoundingBox.r ), -( -( width / 2 ) + contactBoundingBox.xS ), -( -height + contactBoundingBox.yS ) ), -globeRotAngle ), -pivotX, -pivotY );
		upperLeftX = rectCoordsRotTransRotTrans.elements[ 0 ][ 0 ];
		upperLeftY = rectCoordsRotTransRotTrans.elements[ 1 ][ 0 ];
		upperLeftX *= -1;
		upperLeftY *= -1;
		
		contactBoundPoints.ul.x = upperLeftX;
		contactBoundPoints.ul.y = upperLeftY;
		
		// DRAW BOUNDING SQUARES AROUND TRANSFORMED POINTS USED IN MOUSE OVER DETECTION //
		
		/* UNCOMMENT TO SEE BOUNDING POINTS FOR CONTACT BOUNDING BOX TRANSFORMED INTO SCREEN SPACE
		
		context2d.beginPath();
		context2d.rect( upperLeftX - 10, upperLeftY - 10, 20, 20 );
		context2d.lineWidth = 7;
		context2d.strokeStyle = 'green';
		context2d.stroke( );
		
		*/
		
		// TRANSFORM BOUNDING POINT FOR CODE BOUNDING BOX //
		
		rectCoordsRotTransRotTrans = translate( rotate( translate( rotate( coordsToMatrix( 0, 0 ), -codeBoundingBox.r ), -( -( width / 2 ) + codeBoundingBox.xS ), -( -height + codeBoundingBox.yS ) ), -globeRotAngle ), -pivotX, -pivotY );
		upperLeftX = rectCoordsRotTransRotTrans.elements[ 0 ][ 0 ];
		upperLeftY = rectCoordsRotTransRotTrans.elements[ 1 ][ 0 ];
		upperLeftX *= -1;
		upperLeftY *= -1;
		
		codeBoundPoints.ul.x = upperLeftX;
		codeBoundPoints.ul.y = upperLeftY;
		
		/* UNCOMMENT TO SEE BOUNDING BOX BOUND POINT
		
		context2d.beginPath();
		context2d.rect( upperLeftX - 10, upperLeftY - 10, 20, 20 );
		context2d.lineWidth = 7;
		context2d.strokeStyle = 'green';
		context2d.stroke( );
		
		*/
				
	}
	
	// DRAWROTATEDMOON FUNCTION //
	
	function drawRotatedMoon( image, pivotX, pivotY, width, height, angle ) 
	{ 
		context2d.save(); 
		context2d.translate( pivotX, pivotY );
		context2d.rotate( angle * ( Math.PI / 180 ) );		
		context2d.drawImage( image, -( width / 2 ), -( height / 2 ), width, height );
		context2d.restore();  
	}
	
	// GETRANDOMINT FUNCTION
	
	function getRandomInt( min, max ) 
	{
		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
	}
	
	function coordsToMatrix( x , y )
	{
		var m = Matrix.create( [
			[ x ],
			[ y ],
			[ 1 ]
		] );
		
		return m;
	}
	
	function rotate( m, angle )
	{
		var rot = Matrix.create( [
			[  Math.cos( angle * ( Math.PI / 180 ) ), Math.sin( angle * ( Math.PI / 180 ) ), 0 ],
			[ -Math.sin( angle * ( Math.PI / 180 ) ), Math.cos( angle * ( Math.PI / 180 ) ), 0 ],
			[                                      0,                                     0, 1 ]
		] );
		
		return rot.x( m );
	}
	
	function translate( m, dx, dy )
	{
		var trans = Matrix.create( [
			[ 1, 0, dx ],
			[ 0, 1, dy ],
			[ 0, 0,  1 ]
		] );		
		
		return trans.x( m );
	}
}

// CANRUNWEBGL FUNCTION //

function canRunWebGL( canvas ) 
{  
	var gl = null;
	var exts = null;
	
	// DOES IT EVEN KNOW ABOUT WEBGL? //
	
	try 
	{  
		gl = canvas.getContext( "webgl" ) || canvas.getContext( "experimental-webgl" );
		exts = gl.getSupportedExtensions();
		webglexts = exts;
		console.log( "Browser knows about WebGL.");			
		console.log( "WebGL extensions found.");			
		console.log( exts ); 
	}  
	catch( e )
	{
		console.error( "Browser does not know about WebGL.");
		document.body.removeChild( canvas );
		return false;
	}
	
	// IT CAN RUN WEBGL BUT DOES IT HAVE THE RIGHT EXTENSIONS NEEDED? //

	var extsNeeded = [
		"OES_standard_derivatives",
		"WEBGL_lose_context", 			
		"EXT_texture_filter_anisotropic",
	];
	
	var found = 0;
	
	var loop  = extsNeeded.length;
	
	while ( loop-- )
	{
		var loop2 = exts.length;
		
		while ( loop2-- )
		{
			if ( extsNeeded[ loop ] === exts[ loop2 ].replace( "WEBKIT_", "" ).replace( "MOZ_", "" ) )
			{
				console.log( "Found " + extsNeeded[ loop ] + "." );
				found += 1;
				break;
			}
		}
	}
	
	if ( found >= extsNeeded.length )
	{
		document.body.removeChild( canvas );
		console.log( "All required WebGL extensions found." );
		return true;
	}
	else
	{
		console.error( "Could not find the needed WebGL extensions." );
		console.error( "Needed " + extsNeeded.length + ". Found only " + found + "." );
		document.body.removeChild( canvas );
		return false;			
	}		
}

// LOG FUNCTION //
	
function log( datastr )
{
	function getXmlHttp() 
	{
		// Create the variable that will contain the instance of the XMLHttpRequest object (initially with null value).
		var xmlHttp = null;

		if ( window.XMLHttpRequest ) 
		{	// for Forefox, IE7+, Opera, Safari, ...
			xmlHttp = new XMLHttpRequest();
		}
		else if ( window.ActiveXObject ) 
		{	// for Internet Explorer 5 or 6
			xmlHttp = new ActiveXObject( "Microsoft.XMLHTTP" );
		}

		return xmlHttp;
	}
	
	// sends data to a php mail handler (cMail.php), via POST, and displays the received answer in the response box.
	function ajaxrequest( php_file ) 
	{
		var request =  getXmlHttp( ); // call the function for the XMLHttpRequest instance

		request.open( "POST", php_file, true ); // set the request

		// adds  a header to tell the PHP script to recognize the data as is sent via POST		
		request.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
		request.send( datastr ); // calls the send() method with data as parameter

		// Check request status
		// If the response is received completely, will be transferred to the response box.		
		request.onreadystatechange = function( ) 
		{
			if ( request.readyState == 4 )
			{
				//if ( response != undefined ) console.log( reponse.responseText );
			}
			else
			{
				//console.error( "Error:" + request.readyState );
			}
		}
	}
	
	ajaxrequest( 'assets/scripts/php/vData.php' );
}