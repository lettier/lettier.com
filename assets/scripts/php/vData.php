<?php

	/*
	 * 
	 * David Lettier (C) 2013.
	 * 
	 * http://www.lettier.com/
	 * 
	 * Records visitor information.
	 * 
	 */

	require( '' ); // needed for user id / pass to database			
	include( "simple_html_dom.php" );	
	
	$link = mysql_connect( "localhost", $x, $y ) or die( mysql_error( ) ); 
	
	date_default_timezone_set( 'America/New_York' );
	$date = date( 'l jS \of F Y h:i:s A' );
	$ip = mysql_real_escape_string( $_SERVER['REMOTE_ADDR'] );
	$hostaddress = gethostbyaddr( $ip );
	$browser = mysql_real_escape_string( $_SERVER[ 'HTTP_USER_AGENT' ] );
	$referred = mysql_real_escape_string( $_SERVER[ 'HTTP_REFERER' ] );
	$webgl =  mysql_real_escape_string( $_POST[ 'webgl' ] );
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
	elseif ( $ip == "" )
	{
		// do nothing
	}
	else // no spider or bot, log it
	{
		mysql_select_db( "visitors0" ) or die( mysql_error( ) ); 
		$result = mysql_query( "INSERT INTO `visitors0`.`VISITORS` ( `DATE`, `IP`, `LOCATION`, `HOSTADDRESS`, `BROWSER`, `REFERRED`, `WEBGL`) VALUES ( '$date', '$ip', '$location', '$hostaddress', '$browser', '$referred', '$webgl' );" ); 
		if ( $result )
		{
			//echo "Success.";
		}
		else
		{
			echo mysql_error( $link );
		}
	}
?> 