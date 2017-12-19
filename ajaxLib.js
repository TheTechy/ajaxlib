// ajaxLib.js
// Copyright(C) 2016 George Duff
// MIT Licensed

/* 
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
*/

// Examples
/*	// All options
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
*/

/*
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
*/

(function(){
    "use strict";
    function define_ajaxLib(){
        var ajaxLib = {};
        var generateParameters = function(method, sendType, parameters){
            var encodedString = "";
            if(method == "GET"){
                encodedString = "?";
                for(var prop in parameters) {
                    if(parameters.hasOwnProperty(prop)){
                        if(encodedString.length > 1){encodedString += '&'};
                        encodedString += encodeURIComponent(prop) + '=' + encodeURIComponent(parameters[prop]);
                    }
                }
                return encodedString;
            }else if(method !== "GET" && sendType !== "JSON"){ //we are sending form data?
                for(var prop in parameters) {
                    if(parameters.hasOwnProperty(prop)){
                        if(encodedString.length > 0){encodedString += '&'};
                        encodedString += encodeURIComponent(prop) + '=' + encodeURIComponent(parameters[prop]);
                    }
                }
                return encodedString;
            }else{
                return JSON.stringify(parameters);
            }
        };

        ajaxLib.execute = function(options){
            //** use typeof / instanceof for checks
            //** Validate the required parameters
            typeof options.uploadFiles === "undefined" ? options.uploadFiles = null : options.uploadFiles = options.uploadFiles;
            typeof options.success === "undefined" ? options.success = null : options.success = options.success;
            typeof options.error === "undefined" ? options.error = alert : options.error = options.error;
            typeof options.url === "undefined" ? options.url = "http://127.0.0.1" : options.url = options.url;
            typeof options.method === "undefined" ? options.method = "GET" : options.method = options.method;

            //** Validate the optional parameters
            typeof options.async === "undefined" ? options.async = true : options.async = options.async;
            typeof options.dataSent === "undefined" ? options.dataSent = "TEXT" : options.dataSent = options.dataSent;
            typeof options.dataReceived === "undefined" ? options.dataReceived = "TEXT" : options.dataReceived = options.dataReceived;
            //** By default, send as form data. This will not effect GET requests
            typeof options.headers === "undefined" ? options.headers = {"Content-type": "application/x-www-form-urlencoded"} : options.headers = options.headers;
            typeof options.parameters === "undefined" ? options.parameters = {} : options.parameters = options.parameters;

            //** Create a new XMLHttpRequest
            if(window.XMLHttpRequest){
                var xmlhttp = new XMLHttpRequest();
            };

            xmlhttp.onreadystatechange = function(){
                if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
                    if(options.dataReceived == "JSON"){
                        options.success(JSON.parse(xmlhttp.responseText));
                    }else{
                        options.success(xmlhttp.responseText);
                    }
                }else if(xmlhttp.readyState == 4 && xmlhttp.status == 400){
                    options.error(xmlhttp.responseText);
                }
            };

            if(options.method.toUpperCase() == "GET"){
                xmlhttp.open("GET", options.url + generateParameters(options.method, options.dataSent, options.parameters), options.async);
                var counter = 0; //** Build request headers
                for(var k in options.headers){
                    if(options.headers.hasOwnProperty(k)){
                        xmlhttp.setRequestHeader(Object.keys(options.headers)[counter++], options.headers[k]);
                    }
                };
                xmlhttp.send();
            }else{
                xmlhttp.open(options.method, options.url, options.async);
                var counter = 0; //** Build request headers
                for(var k in options.headers){
                    if(options.headers.hasOwnProperty(k)){
                        xmlhttp.setRequestHeader(Object.keys(options.headers)[counter++], options.headers[k]);
                    }
                };
                //xmlhttp.send(options.formData, generateParameters(options.method, options.dataSent, options.parameters));
                xmlhttp.send(generateParameters(options.method, options.dataSent, options.parameters));
            }
        };

        //Return an instance of ajaxLib
        return ajaxLib;
    };

    //define the ajaxLib library in the global namespace if it doesn't already exist
	if(typeof(ajaxLib) === "undefined"){
		window.ajaxLib = define_ajaxLib();
	}else{
		console.log("ajaxLib already defined.");
	}
})();