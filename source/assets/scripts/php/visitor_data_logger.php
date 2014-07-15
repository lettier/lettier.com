<?php
	
	/*
	* 
	* David Lettier (C) 2014.
	* 
	* http://www.lettier.com/
	* 
	* Records visitor information.
	* 
	*/
	
	require( '/virtual/users/e14157-14235/storage/vars.php' );
	
	$link = mysql_connect( 'localhost', $a, $b ) or die( mysql_error( ) ); 
	
	date_default_timezone_set( 'America/New_York' );
	
	$date        = date( 'l jS \of F Y h:i:s A' );
	$ip          = mysql_real_escape_string( $_SERVER[ 'REMOTE_ADDR' ] );
	$hostaddress = mysql_real_escape_string( gethostbyaddr( $ip ) );
	$browser     = mysql_real_escape_string( $_SERVER[ 'HTTP_USER_AGENT' ] );
	$referred    = mysql_real_escape_string( $_SERVER[ 'HTTP_REFERER' ] );
	$webgl_exts  = mysql_real_escape_string( $_POST[ 'WEBGL_EXTS' ] );
	$xml         = new SimpleXMLElement( file_get_contents( "http://freegeoip.net/xml/" . $ip ) );
	
	$location = '';
	
	$i = 0;
	
	foreach( $xml as $entry )
	{
	  
		if ( $i != 0 )
		{
	  
	                $location .= (string) $entry . "\n";
	                
	        }
	        
	        $i += 1;
	  
	}
	
	$location = mysql_real_escape_string( $location );
	
// 	if ( strlen( stristr( $browser, "spider" ) ) > 0 ) // Do not log spiders.
// 	{
// 		
// 		// Do nothing.
// 		
// 	}
// 	elseif ( strlen( stristr( $browser, "bot" ) ) > 0 ) // Do not log bots.
// 	{
// 		
// 		// Do nothing.
// 		
// 	}
// 	else // No spider or bot so log the information to the database.
// 	{
// 		
		mysql_select_db( "lettier0" ) or die( mysql_error( ) );
		
		$result = mysql_query( "INSERT INTO `lettier0`.`VISITORS` ( `DATE`, `IP`, `LOCATION`, `HOSTADDRESS`, `BROWSER`, `REFERRED`, `WEBGL_EXTS`) VALUES ( '$date', '$ip', '$location', '$hostaddress', '$browser', '$referred', '$webgl_exts' );" ); 
		
		if ( $result )
		{
			
			// Success.
			
		}
		else
		{
			
			echo mysql_error( $link );
			
		}
		
// 	}
	
?> 
