<?php
	
	/*
	* 
	* David Lettier (C) 2014.
	* 
	* http://www.lettier.com/
	* 
	* Handles the contact form data server side.
	* 
	*/
	
	require( '/virtual/users/e14157-14235/storage/vars.php' );
	
	$to = $e;
	
	$name_field    = $_POST[ 'name' ];
	$message_type  = $_POST[ 'subject' ];
	$email_field   = $_POST[ 'email' ];
	$message_field = $_POST[ 'message' ];
	
	$headers = "From: $email_field";
	
	$ticket_number = date( "Y_m_j_is" );
	
	$subject = "LETTIER.COM - MAIL FROM $name_field SUBJECT $message_type TICKET NUMBER $ticket_number.";

	function spam_check( $field )
	{
		
		$field = filter_var( $field, FILTER_SANITIZE_EMAIL );
		
		if ( filter_var( $field, FILTER_VALIDATE_EMAIL ) )
		{
			
			return TRUE;
			
		}
		else
		{
			
			return FALSE;
			
		}
	}
	
	function sanitize_string( $field )
	{
		
		$temp  = $field;
		$field = filter_var( $field, FILTER_SANITIZE_STRING );
		
		if ( $field != $temp )
		{
			
			echo "Let us sanitize...<br>";
			
		}
		
		return "$field";
		
	}
	
	$mail_check = spam_check( $email_field );
	
	if ( $mail_check == TRUE )
	{
		
		$message_field = sanitize_string( $message_field );
		$name_field    = sanitize_string( $name_field );
		$body          = "Ticket Number: $ticket_number\nFrom: $name_field\nSubject: $message_type\nE-Mail: $email_field\nMessage: $message_field";
		
		if ( mail( $to, $subject, $body, $headers ) ) 
		{
			
			echo "Got it!<br>Your ticket number is:<br> <b>" . $ticket_number . "</b>.";
			
			$subject = "RE: LETTIER.COM - MAIL FROM $name_field SUBJECT $messag_type TICKET NUMBER $ticket_number.";
			$headers = "From: no-reply@lettier.com";
			$body    = "Thanks $name_field for contacting Lettier!\n\n" .
			           "While a crack team of grammar enthusiasts craft the perfect message, " .
			           "I wanted to let you know you were heard loud and clear. Here is what I got:" . 
			           "\n\n--------------------\nTicket Number: $ticket_number\nFrom: $name_field\nSubject: " .
			           "$message_type\nE-Mail: $email_field\nMessage: $message_field\n--------------------\n\nPlease " .
			           "be on the look out for a less robotic response in the near future.\n\nThanks again,\nLettier";
			
			mail( $email_field, $subject, $body, $headers );
			
		}
		else 
		{
			
			echo "Oh boy, this is not good.";
			
		}
		
	}
	else
	{
		
		echo "Alright spammer, scram.";
		
	}
	
?>
