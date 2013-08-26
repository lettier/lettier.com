// GLOBALS //

var nameClr = 0;
var mailClr = 0;
var msgClr  = 0;
var send;
var response;
var name;
var mail;
var subject;
var message;
var contact;

// CLEARFORM FUNCTION //

function clearForm( entry ) 
{
	if ( entry == "name" && nameClr == 0 )
	{   
		document.getElementById( entry ).value = "";
		nameClr = 1;
	}
	else if ( entry == "email" && mailClr == 0 )
	{                
		document.getElementById( entry ).value = "";
		mailClr = 1;                
	}
	else if ( entry == "message" && msgClr == 0 )
	{                
		document.getElementById( entry ).value = "";
		msgClr = 1;                
	}
}

// EMAIL FUNCTION //

function email( datastr )
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
				response.innerHTML = request.responseText;				
				setTimeout( function ( ) { resetForm( ); }, 8000 );
			}
			else
			{
				// error
			}
		}
	}

	ajaxrequest( 'assets/scripts/php/cMail.php' );
}

// RESETFORM FUNCTION //

function resetForm( )
{
	document.contact.name.value = "Name Here";
	document.contact.email.value = "Email Here";
	document.getElementById( "subject" ).selectedIndex = 0;
	document.contact.message.value = "Message Here";
	document.getElementById( "response" ).innerHTML = "";
	nameClr = 0;
	mailClr = 0;
	msgClr  = 0; 
}