/*
 * 
 * David Lettier (C) 2014.
 * 
 * http:/www.lettier.com/
 * 
 * Handles all contact form aspects.
 * 
 */

// Globals.

var name_clear     = 0;
var mail_clear     = 0;
var message_clear  = 0;

function initialize_contact_form( )
{

	var overlay_content_container = document.getElementById( "overlay_content_container" );
	
	var contact_form        = document.getElementById( "contact_form" );
	var name_input_field    = document.getElementById( "contact_form_name_input_field" );
	var email_input_field   = document.getElementById( "contact_form_email_input_field" );
	var subject_input_field = document.getElementById( "contact_form_subject_selection_field" );
	var message_input_field = document.getElementById( "contact_form_message_input_field" );
	var send_button         = document.getElementById( "contact_form_send_button" );

	size_contact_form( );

	name_clear     = 0;
	mail_clear     = 0;
	message_clear  = 0;

	try
	{
		
		contact_form.addEventListener( "submit", function ( ) { return false; }, true );
		
	}
	catch ( error )
	{
		
		contact_form.addEventListener( "onsubmit", function ( ) { return false; }, true );
		
	}
	
	send_button.onclick = function ( ) {

		var overlay_content_container = document.getElementById( "overlay_content_container" );
		
		var validation_string   = '';
		var name_value          = document.contact_form.name.value;
		var mail_value          = document.contact_form.email.value;
		var subject_value       = document.contact_form.subject.value;
		var message_value       = document.contact_form.message.value;
		var response_container  = document.getElementById( "contact_form_response_container" );

		if ( name_value.length < 2 || name_value == "Name Here" ) 
		{
			
			validation_string += "<br> &#149; Did you put in a real name?";
			
		}
		
		if ( !mail_value.match(/^([a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,4}$)/i) || mail_value == "Email Here" ) 
		{
			
			validation_string += "<br> &#149; That e-mail address looks funky.";
			
		}
		
		if ( subject_value == "Select a Subject" )
		{
			
			validation_string += "<br> &#149; What is this message about?";
			
		}
		
		if ( message_value.length < 2 || message_value == "Message Here" ) 
		{
			
			validation_string += "<br> &#149; Did you even write a message?";
			
		}
		
		if ( validation_string != '' )
		{
			
			response_container.innerHTML = "WHOA! Wait a minute..." + validation_string;
			
		}
		else
		{
			
			var data_string  = "name="     + name_value; 
			data_string     += "&subject=" + subject_value;
			data_string     += "&email="   + mail_value;
			data_string     += "&message=" + message_value;
			
			response_container.innerHTML = "One second, sending this off to HQ...";
			
			setTimeout( function ( ) { emailer( data_string ); }, 2000 );
			
		}
		
		size_contact_form( );
		
		return false;
		
	};

}

// Emailer function.

function emailer( data_string )
{
	
	function get_xml_http( ) 
	{
		
		// Create the variable that will contain the instance of the XMLHttpRequest object (initially with a null value).
		
		var xml_http = null;

		if ( window.XMLHttpRequest ) 
		{	
			
			// For Forefox, IE7+, Opera, Safari, etc.
		
			xml_http = new XMLHttpRequest( );
			
		}
		else if ( window.ActiveXObject ) 
		{	
			
			// For Internet Explorer 5 or 6.
			
			xml_http = new ActiveXObject( "Microsoft.XMLHTTP" );
			
		}

		return xml_http;
		
	}
	
	// Sends the data string to the PHP mail handler via POST and displays the received answer in the response container.
	
	function ajax_request( php_file, data_string )
	{
		
		var request =  get_xml_http( ); // Call the function for the XMLHttpRequest instance.

		request.open( "POST", php_file, true ); // Set the request.

		// Adds a header to tell the PHP script to recognize the data as is sent via POST.
		
		request.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
		request.send( data_string ); // Calls the send( ) method with data as parameter.

		// Check request status.
		// If the response is received completely, it will be loaded into the response box.
		
		request.onreadystatechange = function ( )
		{
			
			if ( request.readyState === 4 )
			{

				if ( request.status === 200 )
				{
					
					document.getElementById( "contact_form_response_container" ).innerHTML = request.responseText;
					
					setTimeout( function ( ) { reset_contact_form( ); }, 8000 );
					
				} 
				else 
				{
					
					console.warn( "Emailer request failed: " + request.responseText );
					
				}
				
			}
			else
			{
			
			}
			
		}
		
	}

	ajax_request( "assets/scripts/php/contact_form_mailer.php", data_string );
	
}

// Clear form function.

function clear_contact_form( entry ) 
{
	
	if ( entry === "contact_form_name_input_field" && name_clear === 0 )
	{
		
		document.getElementById( entry ).value = "";
		name_clear = 1;
		
	}
	else if ( entry === "contact_form_email_input_field" && mail_clear === 0 )
	{
		
		document.getElementById( entry ).value = "";
		mail_clear = 1;
		
	}
	else if ( entry === "contact_form_message_input_field" && message_clear === 0 )
	{
		
		document.getElementById( entry ).value = "";
		message_clear = 1;
		
	}
	
}

// Reset form function.

function reset_contact_form( )
{
	
	document.contact_form.name.value            = "Name Here";
	document.contact_form.email.value           = "Email Here";
	document.contact_form.subject.selectedIndex = 0;
	document.contact_form.message.value         = "Message Here";
	document.getElementById( "contact_form_response_container" ).innerHTML = "";
	
	name_clear     = 0;
	mail_clear     = 0;
	message_clear  = 0;
	
}

// Size the contact form function.

function size_contact_form( )
{
	
	try
	{
	
		var overlay_content_container = document.getElementById( "overlay_content_container" );
		
		var contact_form        = document.getElementById( "contact_form" );
		var name_input_field    = document.getElementById( "contact_form_name_input_field" );
		var email_input_field   = document.getElementById( "contact_form_email_input_field" );
		var subject_input_field = document.getElementById( "contact_form_subject_selection_field" );
		var message_input_field = document.getElementById( "contact_form_message_input_field" );
		var send_button         = document.getElementById( "contact_form_send_button" );

		name_input_field.style.width    = overlay_content_container.clientWidth + - 20 + "px";
		email_input_field.style.width   = overlay_content_container.clientWidth + - 20 + "px";
		subject_input_field.style.width = overlay_content_container.clientWidth + - 20 + 6 + "px";
		message_input_field.style.width = overlay_content_container.clientWidth + - 20 + "px";
		
		if ( overlay_content_container.scrollHeight > overlay_content_container.clientHeight )
		{
		
			name_input_field.style.width    = overlay_content_container.offsetWidth + - 35 + "px";
			email_input_field.style.width   = overlay_content_container.offsetWidth + - 35 + "px";
			subject_input_field.style.width = overlay_content_container.offsetWidth + - 35 + 6 + "px";
			message_input_field.style.width = overlay_content_container.offsetWidth + - 35 + "px";
		
		}
		
	}
	catch ( error ) { }
	
}
