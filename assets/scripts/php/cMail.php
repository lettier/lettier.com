<?php

	/*
	* 
	* LETTIER 
	* 
	* http://www.lettier.com/
	* 
	* Handles mail form.
	* 
	*/
	
	$to = "contact@lettier.com";
	$name_field = $_POST[ 'name' ];
	$msg_type = $_POST[ 'subject' ];
	$email_field = $_POST[ 'email' ];
	$message = $_POST[ 'message' ];
	$headers = "From: $email_field";
	$tic_num = date( "Y_m_j_is" );
	$subject = "LETTIER.COM - MAIL FROM $name_field SUBJECT $msg_type TICKET NUMBER $tic_num.";

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
			echo "Let us sanitize...<br>";
		}
		
		return "$field";	
	}
	
	$mailcheck = spamcheck( $email_field );
	
	if ( $mailcheck == TRUE )
	{
		$message = stripem( $message );
		$name_field = stripem( $name_field );
		$body = "Ticket Number: $tic_num\nFrom: $name_field\nSubject: $msg_type\nE-Mail: $email_field\nMessage: $message";
		if ( mail( $to, $subject, $body, $headers ) ) 
		{
			echo "Got it!<br>Your ticket number is:<br> <b>" . $tic_num . "</b>.";
			$subject = "RE: LETTIER.COM - MAIL FROM $name_field SUBJECT $msg_type TICKET NUMBER $tic_num.";
			$headers = "From: no-reply@lettier.com";
			$body = "Thanks $name_field for contacting Lettier! While a crack team of grammar enthusiasts craft the perfect message, I wanted to let you know you were heard loud and clear. Here is what I got:\n\n--------------------\nTicket Number: $tic_num\nFrom: $name_field\nSubject: $msg_type\nE-Mail: $email_field\nMessage: $message\n--------------------\n\nPlease be on the look out for a less robotic response in the near future.\n\nThanks again,\nLettier";
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