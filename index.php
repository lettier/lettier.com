<!DOCTYPE HTML>
<html itemscope itemtype="http://schema.org/Article">
	<head>
		<title>LETTiER</title>
		<link rel="icon" type="image/png" href="http://www.lettier.com/assets/images/favicon.ico">
		<meta charset="UTF-8">
		<meta name="author" content="David C Lettier: contact[at]lettier.com">
		<meta name="description" content="LETTiER is here.">
		<meta name="keywords" content="david,curtis,lettier,multimedia,graphics,pcrepair,recording,studio">
		<meta itemprop="image" content="http://www.lettier.com/assets/images/fblike.jpg">
		<meta property="og:image" content="http://www.lettier.com/assets/images/fblike.jpg">
		<meta property="fb:admins" content="514755937">
		<link type="text/css" href="assets/css/lettier.css" rel="stylesheet" media="all">
		<script type="text/javascript" src="http://code.jquery.com/jquery-1.4.4.min.js"></script>
		<script type="text/javascript" src="assets/scripts/jquery.mousewheel.min.js"></script>
		<script type="text/javascript" src="assets/scripts/loadBar.min.js"></script>
		<script type="text/javascript" src="assets/scripts/scrollBar.min.js"></script>
	</head>
	<body>
		<script type="text/javascript">
		
			document.documentElement.style.overflow = "hidden"; // NEEDED FOR IE

			// GLOBALS //	

			var onMain = 1;			
			var wglAble = 1;
			
			var art_cat = "<?  print $_GET[ "art_cat" ]; ?>";
			var art_id = "<?  print $_GET[ "art_id" ]; ?>";
			
			var escapeKey = jQuery.Event( "keypress", { keyCode: 27 } );
			escapeKey.keyCode = 27;
			
			// TEST MOBILE PLATFORM AND WEBGL CAPABILITIES //

			function testWebGL( canvas ) {  
				gl = null;
				try {  
					gl = canvas.getContext( "webgl" ) || canvas.getContext( "experimental-webgl" );  
				}  
				catch( e ) {}
				if ( !gl ) {  
					wglAble = 0;
				}
				document.body.removeChild( canvas );
			}		

			test = document.createElement( 'canvas' );
			document.body.appendChild( test );		
			testWebGL( test );
			
			(function(a){jQuery.browser.mobile=/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);
			
			if ( jQuery.browser.mobile ) // MOBILE PLATFORM? //
			{				
				if ( art_cat )
				{
					if ( art_id )
					{
						window.location = "http://www.lettier.com/mobile.php?art_cat=" + "<?  print $_GET[ "art_cat" ]; ?>" + "&art_id=" + "<?  print $_GET[ "art_id" ]; ?>";
					}
					else
					{
						window.location = "http://www.lettier.com/mobile.php";
					}
				}
				else
				{
					window.location = "http://www.lettier.com/mobile.php";
				}
			}
			else if ( wglAble == 1 ) // 3D ABLE //
			{
				loadBar.init( "page-load-bar", "#888888", 24 );
				
				$.getScript( "assets/scripts/Three.js", function () {

					$.getScript( "assets/scripts/Tween.js", function () {
					
						$.getScript( "assets/scripts/index3d.min.js", function() 
						{							
							init3D( );
							animate3D( );
							
							// 3D EVENT HANDLERS //
						
							document.addEventListener( 'mousemove', onDocumentMouseMove, false );
							document.addEventListener( 'mousedown', onDocumentMouseDown, false );
							document.addEventListener(  'keypress',           handleKey, false );
							document.onkeydown = handleKey;							
							
							if  ( art_cat )
							{
								if ( art_id )
								{
									$( document ).bind( "loadpermlink", function ( event, cat, id ) { loadpermlink( event, cat, id ); } );					
								}
							}

							loadBar.increment( );
							
						} );
						
						loadBar.increment( );
						
					} );
					
					loadBar.increment( );
					
				} );
				
				if ( art_cat )
				{
					if ( art_id )
					{
						window.setTimeout( function () { $( document ).trigger( "loadpermlink", [ art_cat, art_id ] ); }, 7000 );
					}
				}
			}
			else // CAN ONLY HANDLE 2D //
			{
				$.getScript( "assets/scripts/index2d.min.js", function () 
				{ 
					init2D( );
					
					if  ( art_cat )
					{
						if ( art_id )
						{
							$( document ).bind( "loadpermlink", function ( event, cat, id ) { loadpermlink( event, cat, id ); } );					
						}
					}				
				} );
				
				if ( art_cat )
				{
					if ( art_id )
					{
						window.setTimeout( function () { $( document ).trigger( "loadpermlink", [ art_cat, art_id ] ); }, 1000 );
					}
				}
			}			
			// END TEST //		
		</script>
		<noscript>			
			<div class="noscript-div-clip">
				<img src="assets/images/m_clipboard.png" class="noscript-img-clip" alt="Clipboard_png">
				<div class="noscript-div-form">
					<form name="contact" action="index.php" method="get">
						<br>
						<span class="main-header"><b>CONTACT</b></span>
						<br><br>
						<input class="input-form-text" type="text" name="name" size="35" value="NAME HERE" title="Name Here">
						<br><br>
						<input class="input-form-text" type="text" name="email" size="35" value="EMAIL ADDRESS HERE" title="Email Here">
						<br><br>
						<select name="subject" class="input-form-text">
							<option value="--SELECT A SUBJECT--" selected>--SELECT A SUBJECT--</option>
							<option value="General">General</option>
							<option value="Tech Support">Tech Support</option>
							<option value="Graphic Design">Graphic Design</option>
							<option value="Advertising">Advertising</option>
							<option value="LETTiERtv">LETTiERtv</option>
							<option value="Music">Music</option>
							<option value="Article Request">Article Request</option>
						</select> 
						<br><br>
						<textarea class="input-form-text" rows="10" name="message" cols="45" title="Message Here">MESSAGE HERE</textarea>
						<br><br>
						<table>
							<tr>
								<td>
									<input id="send" class="input-form-send-button" type="submit" name="send" value="" title="Send">		
								</td>
								<td>
									<div class="noscript-input-form-response">
									<?php
				
										if ( !empty( $_GET[ "name" ] ) )
										{
											$to = "contact@lettier.com";
											$name_field = $_GET[ "name" ];
											$msg_type = $_GET[ "subject" ];
											$email_field = $_GET[ "email" ];
											$message = $_GET[ "message" ];
											$headers = "From: $email_field";
											$subject = "NOSCRIPT - LETTiER.COM - MAIL FROM $name_field ABOUT $msg_type.";
											$tic_num = date( "Y_m_j_is" );
											
											if ( !empty( $name_field ) && $name_field != "NAME HERE" )  
											{ 
												if ( !empty( $email_field ) && $email_field != "EMAIL ADDRESS HERE" )
												{
													if ( !empty( $message ) && $message != "MESSAGE HERE" )
													{
														if ( $msg_type != "--SELECT A SUBJECT--" )
														{
															function spamcheck( $field )
															{
																$field = filter_var( $field, FILTER_SANITIZE_EMAIL );

																if( filter_var( $field, FILTER_VALIDATE_EMAIL ) )
																{
																	return TRUE;
																}
																else
																{
																	return FALSE;
																}
															}
															
															function stripem( $field )
															{
																$temp = $field;
																$field = filter_var( $field, FILTER_SANITIZE_STRING );
																if ( $field != $temp )
																{
																	echo "Let's get rid of this HTML code...<br>";
																}
																
																return "$field";	
															}
															
															$mailcheck = spamcheck( $email_field );
															
															if ( $mailcheck == TRUE )
															{
																$message = stripem( $message );
																$body = "Ticket Number: $tic_num\nFrom: $name_field\nSubject: $msg_type\nE-Mail: $email_field\nMessage: $message";
																if ( mail( $to, $subject, $body, $headers ) ) 
																{
																	echo "LETTiER got it!<br>Your ticket number is <b>" . $tic_num . "</b>.";
																	$subject = "RE: LETTiER.COM - MAIL FROM $name_field ABOUT $msg_type.";
																	$headers = "From: no-reply@lettier.com";
																	$body = "Thanks $name_field for contacting LETTiER! While a crack team of grammar enthusiasts craft the perfect message, we wanted to let you know we heard you loud and clear. Here is what we got:\n\n--------------------\nTicket Number: $tic_num\nFrom: $name_field\nSubject: $msg_type\nE-Mail: $email_field\nMessage: $message\n--------------------\n\nPlease be on the look out for a less robotic response in the near future.\n\nThanks again,\nLETTiER";
																	mail( $email_field, $subject, $body, $headers );
																}
																else 
																{
																	echo "Oh boy, this is not good.";
																}
															}
															else
															{
																echo "Your email looks weird. Fix it.";
															}
														}
														else
														{
															echo "You didn't pick a subject.";
														}
													}
													else
													{
														echo "You didn't fill in your message.";
													}
												}
												else
												{
													echo "You didn't fill in your email.";
												}
											} 
											else
											{
												echo "You didn't fill in your name.";
											}				
										}
										else
										{
											echo "You should turn Javascript on. Go ahead, you know you want to.";
										}
									?>
									</div>
								</td>
							</tr>
						</table>
					</form>
				</div>
			</div>
		</noscript>
		<!--BEGIN PHP VISTOR CODE-->
		<?php
			require( '/virtual/users/e14157-14235/storage/vars.php' ); // needed for user id / pass to database			
			include( "assets/scripts/simple_html_dom.php" );		
			
			date_default_timezone_set( 'America/New_York' );
			$date = date( 'l jS \of F Y h:i:s A' );
			$ip = $_SERVER['REMOTE_ADDR'];
			$hostaddress = gethostbyaddr($ip);
			$browser = $_SERVER[ 'HTTP_USER_AGENT' ];
   			$referred = $_SERVER[ 'HTTP_REFERER' ];
			$html = file_get_html( "https://ipdb.at/ip/" . $ip );
			$a = $html->find( "ul[id=ip-info] li" , 0 );
			$a = $a->plaintext; $a = preg_replace('/\s\s+/', '', $a );
			$b = $html->find( "ul[id=ip-info] li" , 1 );
			$b = $b->plaintext; $b = preg_replace('/\s\s+/', '', $b );
			$c = $html->find( "ul[id=ip-info] li" , 2 );
			$c = $c->plaintext; $c = preg_replace('/\s\s+/', '', $c );
			$d = $html->find( "ul[id=ip-info] li" , 3 );
			$d = $d->plaintext; $d = preg_replace('/\s\s+/', '', $d );
			$e = $html->find( "ul[id=ip-info] li" , 4 );
			$e = $e->plaintext;	$e = preg_replace('/\s\s+/', '', $e );		
			$location = $a . "\n" . $b . "\n" . $c . "\n" . $d . "\n" . $e;			
			
			if ( strlen( stristr( $browser, 'spider' ) ) > 0 ) // do not log spiders or bots
			{
				// do nothing
			}
			elseif ( strlen( stristr( $browser, 'bot' ) ) > 0 )
			{
				// do nothing
			}
			elseif ( $ip == "98.14.9.187" )
			{
				// do nothing
			}
			else // no spider or bot, log it
			{
				mysql_connect( "localhost", $x, $y ) or die( mysql_error( ) ); 
				mysql_select_db( "visitors0" ) or die( mysql_error( ) ); 
				mysql_query( "INSERT INTO `visitors0`.`VISITORS` ( `DATE`, `IP`, `LOCATION`, `HOSTADDRESS`, `BROWSER`, `REFERRED` ) VALUES ( '$date', '$ip', '$location', '$hostaddress', '$browser', '$referred' ); " ); 
			}
		?> 
		<!--END PHP VISTOR CODE-->
    </body>
</html>