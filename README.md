# ajaxlib
A small javascript ajax library (2k minified)

Load using a normal script tag and call using ajaxLib.execute
```html
<script src="ajaxlib.min.js"></script>
<script>ajaxLib.execute({<OPTIONS HERE>})</script>
```
The options parameter are explained in detail below:
```html
	ajaxLib.execute
	@description - { Sends an AJAX request to sever and handles success or error }
	@param - {object}
			success: {Function}		Function call or inline function to handle ajax success.
			error: {Function}		Function call or inline function to handle ajax error.
			url: {String}			URL to make call to. Can be relative i.e. '/users/person1' or FQDN i.e. 'https://www.example.com/users/person1'
			method: {String}		Transmission type (Default GET) GET, POST, PUT, DELETE etc.
			async: {Boolean}		Set asynchronous true or false. (Default true).
			dataSent: {String}		TEXT or JSON (Default 'TEXT') Used by generateParameters() to determine to send JSON or TEXT
			dataReceived: {String}	TEXT or JSON (Default 'TEXT') Type of data recieved by the request.
			headers: {Object}		Object for creating HTTP Headers to be sent with request e.g. Authorization, Content-Type, Cache-Control etc i.e. "Content-Type": "application/json"
			parameters: {Object}	User generated values that will be used as the parameters for the request. In a GET command they become the query string, in POST they are added to the body request
	@returns { data to success or error function }
```

Some usage examples:

```html
// Examples
// All options
ajaxLib.execute({
	success: function(successVal) {
		alert('AJAX success: ' + successVal);
	}),
	error: function(errorVal) {
		alert('AJAX error' + errorVal);
	},
	url: 'http://127.0.0.1/getPersonData.php',
	method: 'GET',
	async: true,
	dataSent: 'JSON',
	dataReceived: 'JSON',
	headers: {
		"Content-Type": "application/json"
	},
	parameters: {
		firstname: 'John',
		surname: 'Smith',
		idNumber: 'A136253'
	}
});

// Minimal options
ajaxLib.execute({
	success: function(successVal) {
		alert('AJAX success: ' + successVal);
	},
	error: function(errorVal) {
		alert('AJAX error' + errorVal);
	},
	url: 'https://httpbin.org/uuid',
	dataReceived: 'JSON'
});
```
