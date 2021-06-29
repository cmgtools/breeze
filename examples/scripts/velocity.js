/**
 * Velocity - v1.0.0-alpha1 - 2021-06-29
 * Description: Velocity is a JavaScript library which provide utilities, ui components and MVC framework implementation.
 * License: GPL-3.0-or-later
 * Author: Bhagwat Singh Chouhan
 */

/**
 * The base file of Velocity Framework to bootstrap the required namespace and components.
 */

// == Global Namespace ====================

var cmt = cmt || {};


/**
 * The base file of Velocity Framework to bootstrap the required namespace and components 
 * specific to core utilities. The core utilities is a collection of commonly used utility 
 * functions.
 */

// == Global Namespace ====================

cmt.utils = cmt.utils || {};


// == Ajax Utility ========================

cmt.utils.ajax = {

	triggerPost: function( url, data, csrf ) {

		// Generate form data for submission
		var dataUrl	= null;

		if( typeof( csrf ) === 'undefined' ) csrf = true;

		// Append CSRF token if available
		if( csrf && null != jQuery( 'meta[name=csrf-token]' ) ) {

			var csrfParam 	= jQuery( 'meta[name=csrf-param]' ).attr( 'content' );
			var csrfToken 	= jQuery( 'meta[name=csrf-token]' ).attr( 'content' );

			data += "&" + csrfParam + "=" + csrfToken;
		}

		// Trigger request
		jQuery.post( url, data );
	}

};


/**
 * Browser utility provides commonly used browser feature detection methods.
 */

// == Browser Utility =====================

cmt.utils.browser = {

	/**
	 * Detect whether browser supports xhr.
	 */
	isXhr: function() {

		var xhr	= new XMLHttpRequest();

		return xhr.upload;
	},

	/**
	 * Detect whether browser supports file api.
	 */
	isFileApi: function() {

		return window.File && window.FileList && window.FileReader;
	},

	/**
	 * Detect whether browser supports form data.
	 */
	isFormData: function() {

		return !! window.FormData;
	},

	/**
	 * Detect whether browser supports canvas.
	 */
	isCanvas: function() {

		var elem = document.createElement( 'canvas' );
		
		var canvasSupported = !!( elem.getContext && elem.getContext( '2d' ) );

		return canvasSupported;
	},

	/**
	 * Detect whether browser supports canvas data url feature.
	 */
	isCanvasDataUrl: function() {

		// Used image/png for testing purpose

		var cvsTest	= document.createElement( "canvas" );
		var data	= cvsTest.toDataURL( "image/png" );
		
		var toDataUrlSupported = data.indexOf( "data:image/png" ) == 0;

		return toDataUrlSupported;
	},
	
	/**
	 * Detect whether browser supports history api.
	 */
	isHistory: function() {

		return !( typeof history.pushState === 'undefined' );
	}

};


/**
 * Data utility provides methods to convert form elements to json format and to manipulate
 * url parameters. The json data can be used to send request to server side apis.
 *
 * It also provide other methods to manipulate data.
 */

// == Data Utility ========================

cmt.utils.data = {

	// The week days
	weekDays: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],

	/**
	 * It reads elementId and convert the input fields present within the element to parameters url.
	 */
	serialiseElement: function( elementId, csrf ) {

		var dataArr = [];

		var elements = null;

		if( typeof( csrf ) === 'undefined' ) csrf = true;

		if( typeof elementId == 'string' ) {

			elements = jQuery( '#' + elementId ).find( ':input' ).get();
		}
		else {

			elements = elementId.find( ':input' ).get();
		}

		jQuery.each( elements, function() {

			if ( this.name && !this.disabled && ( this.checked || /select|textarea/i.test( this.nodeName ) || /text|hidden|password/i.test( this.type ) ) ) {

				var val = jQuery( this ).val();

				dataArr.push( encodeURIComponent( this.name ) + "=" + encodeURIComponent( val ) );
			}
		});

		// Form the data url having all the parameters
		var dataUrl = dataArr.join( "&" ).replace( /%20/g, "+" );

		// Append CSRF token if available
		if( csrf && null != jQuery( 'meta[name=csrf-token]' ) ) {

			var csrfParam 	= jQuery( 'meta[name=csrf-param]' ).attr( 'content' );
			var csrfToken 	= jQuery( 'meta[name=csrf-token]' ).attr( 'content' );

			dataUrl += "&" + csrfParam + "=" + csrfToken;
		}

		return dataUrl;
	},

	/**
	 * It reads elementId and convert the input fields present within the element to json.
	 */
	elementToJson: function( elementId, csrf ) {

		var dataArr = [];

		var elements = null;

		if( typeof( csrf ) === 'undefined' ) csrf = true;

		if( typeof elementId == 'string' ) {

			elements = jQuery( '#' + elementId ).find( ':input' ).get();
		}
		else {

			elements = elementId.find( ':input' ).get();
		}

		jQuery.each( elements, function() {

			if ( this.name && !this.disabled && ( this.checked || /select|textarea/i.test( this.nodeName ) || /text|hidden|password/i.test( this.type ) ) ) {

				var val = jQuery( this ).val();

				dataArr.push( { name: this.name, value: val } );
			}
		});

		return cmt.utils.data.generateJsonMap( dataArr, csrf );
	},

	/**
	 * It reads formId and convert the input fields present within the form to parameters url. It use the serialize function provided by jQuery.
	 */
	serialiseForm: function( formId, csrf ) {

		// Generate form data for submission
		var dataUrl	= null;

		if( typeof( csrf ) === 'undefined' ) csrf = true;

		if( typeof formId == 'string' ) {

			dataUrl	= jQuery( '#' + formId ).serialize();
		}
		else {

			dataUrl	= formId.serialize();
		}

		// Append CSRF token if available
		if( csrf && null != jQuery( 'meta[name=csrf-token]' ) ) {

			var csrfParam 	= jQuery( 'meta[name=csrf-param]' ).attr( 'content' );
			var csrfToken 	= jQuery( 'meta[name=csrf-token]' ).attr( 'content' );

			dataUrl += "&" + csrfParam + "=" + csrfToken;
		}

		return dataUrl;
	},

	/**
	 * It reads formId and convert the form input fields to a Json Array.
	 */
	formToJson: function( formId, csrf ) {

		// Generate form data for submission
		var formData = null;

		if( typeof( csrf ) === 'undefined' ) csrf = true;

		if( typeof formId == 'string' ) {

			formData = jQuery( '#' + formId ).serializeArray();
		}
		else {

			formData = formId.serializeArray();
		}

		return cmt.utils.data.generateJsonMap( formData, csrf );
	},

	/**
	 * It reads an data array having name value pair and convert it to json format.
	 */
	generateJsonMap: function( dataArray, csrf ) {

		var json = {};

		// Append csrf token if required
		if( csrf && null != jQuery( 'meta[name=csrf-token]' ) ) {

			var csrfParam   = jQuery( 'meta[name=csrf-param]' ).attr( 'content' );
			var csrfToken 	= jQuery( 'meta[name=csrf-token]' ).attr( 'content' );

			dataArray.push( { name: csrfParam, value: csrfToken } );
		}

		jQuery.map( dataArray, function(n, i) {

			var _ = n.name.indexOf('[');

			if (_ > -1) {

				var o = json;
				_name = n.name.replace(/\]/gi, '').split('[');

				for (var i=0, len=_name.length; i<len; i++) {

					if (i == len-1) {

						if (o[_name[i]]) {

							if (typeof o[_name[i]] == 'string') {

								o[_name[i]] = [o[_name[i]]];
							}

							o[_name[i]].push(n.value);
						}

						else o[_name[i]] = n.value || '';
					}

					else o = o[_name[i]] = o[_name[i]] || {};
				}
			}
			else {

				if (json[n.name] !== undefined) {

					if (!json[n.name].push) {

						json[n.name] = [json[n.name]];
					}

					json[n.name].push(n.value || '');
				}
				else {

					json[n.name] = n.value || '';
				}
			}
		});

		return json;
	},

	/**
	 * It appends CSRF param at the end of request data
	 */
	appendCsrf: function( requestData ) {

		// Append csrf token
		if( null != jQuery( 'meta[name=csrf-token]' ) ) {

			var csrfParam   = jQuery( 'meta[name=csrf-param]' ).attr( 'content' );
			var csrfToken 	= jQuery( 'meta[name=csrf-token]' ).attr( 'content' );

			requestData = requestData + '&' + csrfParam + '=' + csrfToken;
		}

		return requestData;
	},

	/**
	 * Return parameter value for given name and url.
	 */
	getParameterByName: function( param, url ) {

	    if( !url ) {

	    	url = window.location.href;
	    }

	    param = param.replace(/[\[\]]/g, "\\$&");

	    var regex 	= new RegExp("[?&]" + param + "(=([^&#]*)|&|#|$)");
		var results = regex.exec( url );

	    if( !results ) {

			return null;
	    }

	    if( !results[ 2 ] ) {

	    	return '';
	    }

	    return decodeURIComponent( results[ 2 ].replace( /\+/g, " " ) );
	},

	/**
	 * Add/Update parameter for the given URL.
	 */
	updateUrlParam: function( sourceUrl, e, t ) {

		var n;
		var r 	= "";
		var i 	= jQuery( "<a />" ).attr( "href", sourceUrl )[ 0 ];
		var s,o	= /\+/g;
		var u	= /([^&=]+)=?([^&]*)/g;
		var a	= function( e ) { return decodeURIComponent( e.replace( o, " " ) ); };
		var f 	= i.search.substring( 1 );
		n		= {};

		while( s = u.exec( f ) ) {

			n[ a( s[1] ) ] = a( s[2] );
		}

		if( !e && !t ) {

			return n;
		}
		else if( e && !t ) {

			return n[e];
		}
		else {

			n[e]	= t;
			var l	= [];

			for( var c in n ) {

				l.push( encodeURIComponent( c ) + "=" + encodeURIComponent( n[c] ) );
			}

			if( l.length > 0 ) {

				r = "?" + l.join( "&" );
			}

			return i.origin + i.pathname + r;
		}
	},

	/**
	 * Remove parameter from the given url.
	 */
	removeParam: function( sourceUrl, key ) {

	    var baseUrl 	= sourceUrl.split( "?" )[ 0 ];
		var param		= null;
		var paramsArr 	= [];
		var queryString = ( sourceUrl.indexOf( "?" ) !== -1 ) ? sourceUrl.split( "?" )[ 1 ] : "";

	    if( queryString !== "" ) {

	        paramsArr = queryString.split( "&" );

	        for( var i = paramsArr.length - 1; i >= 0; i -= 1 ) {

	            param = paramsArr[ i ].split( "=" )[ 0 ];

	            if( param === key ) {

	                paramsArr.splice( i, 1 );
	            }
	        }

	        baseUrl = baseUrl + "?" + paramsArr.join( "&" );
	    }

		if( baseUrl.slice( -1 ) == '?' ) {

			baseUrl	= baseUrl.slice( 0, -1 );
		}

	    return baseUrl;
	},

	/**
	 * Add or Update url param
	 */
	updateUriParam: function( uri, key, value ) {

		var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");

		var separator = uri.indexOf('?') !== -1 ? "&" : "?";

		if( uri.match( re ) ) {

			return uri.replace( re, '$1' + key + "=" + value + '$2' );
		}
		else {

			return uri + separator + key + "=" + value;
		}
	},

	/**
	 * Refresh current grid.
	 */
	refreshGrid: function() {

		var pageUrl	= window.location.href;

		pageUrl = cmt.utils.data.removeParam( pageUrl, 'page' );
		pageUrl = cmt.utils.data.removeParam( pageUrl, 'per-page' );

		window.location	= pageUrl;
	},

	/**
	 * Check whether given element has attribute
	 */
	hasAttribute: function( element, attribute ) {

		var attr = element.attr( attribute );

		if( typeof attr !== typeof undefined && attr !== false ) {

			return true;
		}

		return false;
	},

	/**
	 * Late binder to bind CL Editor for elements hidden at start.
	 */
	bindEditor: function( selector ) {

		var lateBinder = jQuery( selector );

		if( jQuery.cleditor && !lateBinder.parent().hasClass( 'cleditorMain' ) ) {

			var controls = 'bold italic underline strikethrough subscript superscript | font size style | color highlight removeformat | bullets numbering | outdent indent | alignleft center alignright justify | undo redo | rule link unlink | source';

			lateBinder.cleditor( { docType: '<!DOCTYPE html>', controls: controls, height: 165 } );
		}
		else if( lateBinder.parent().hasClass( 'cleditorMain' ) ) {

			if( lateBinder.hasClass( 'add' ) ) {

				lateBinder.val( '' ).blur();
			}
			else {

				lateBinder.val( lateBinder.val() ).blur();
			}
		}
	},

	/**
	 * Convert the data URI to Blog
	 */
	dataURItoBlob: function( dataURI ) {

		var byteString = atob( dataURI.split( ',' )[ 1 ] );
		var mimeString = dataURI.split( ',' )[ 0 ].split( ':' )[ 1 ].split( ';' )[ 0 ];

		var buffer	= new ArrayBuffer( byteString.length );
		var data	= new DataView( buffer );

		for( var i = 0; i < byteString.length; i++ ) {

			data.setUint8( i, byteString.charCodeAt( i ) );
		}

		return new Blob( [ buffer ], { type: mimeString } );
	}

};


// Inheritance - Crockford's approach to add inheritance. It works for all browsers. 
// Object.create() is standard way to support inheritance, but still not supported by all browsers.

// == Crockford's Inheritance =============

Function.prototype.inherits = function( parent ) {

	var d = 0;
	var p = ( this.prototype = new parent() );

	this.prototype.uber	= function( name ) {

		var f;
		var r;
		var t = d;
		var v = parent.prototype;

		if( t ) {

			while( t ) {

	              v  = v.constructor.prototype;
	              t -= 1;
			}

			f = v[ name ];
		}
		else {

			f = p[ name ];

			if( f == this[ name ] ) {

				f = v[ name ];
			}
		}

		d += 1;
		r  = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
		d -= 1;

		return r;
	};
};

// == Hash Tag - Clear - SNS Login ========

if( window.location.hash == '#_=_' ) {

    if( history.replaceState ) {

        var cleanHref = window.location.href.split( '#' )[ 0 ];

        history.replaceState( null, null, cleanHref );
    }
    else {

        window.location.hash = '';
    }
}

// == Object Size =========================

// Static method to get the size of associative arrays
Object.size = function( arr ) {

    var size = 0;

	// Iterate over all properties
    for( var key in arr ) {

        if( arr.hasOwnProperty( key ) ) {
			
			size++;
		}
    }

    return size;
};


/**
 * Image utility provides commonly used image processing methods.
 */

// == Image Utility =======================

cmt.utils.image = {

	/**
	 * It returns an array having width and height for the given image and target 
	 * dimensions maintaining aspect ratio.
	 */
	arDimensions: function( image, targetWidth, targetHeight ) {

	        var ratio 	= 0;
	        var width 	= image.width;
	        var height 	= image.height;

	        // Check if the current width is larger than the max
	        if( width > targetWidth ) {

	            ratio 	= targetWidth / width;
	            height 	= height * ratio;
	            width 	= width * ratio;
	        }

	        // Check if current height is larger than max
	        if( height > targetHeight ) {

	            ratio 	= targetHeight / height;
	            width 	= width * ratio;
	        }

	        return new Array( width, height );
	},

	/**
	 * It draws the provided image file at center of canvas.
	 */
	drawAtCanvasCenter: function( canvas, imageUrl ) {

		if( null != canvas && null != imageUrl ) {

			var width		= canvas.width;
			var height		= canvas.height;

			var context 	= canvas.getContext( '2d' );
		    var image 		= new Image();
		    var image_url 	= window.URL || window.webkitURL;
		    var image_src 	= image_url.createObjectURL( imageUrl );
		    image.src 		= image_src;

		    image.onload = function() {

		        var dims = cmt.utils.image.arDimensions( image, width, height );

				context.translate( width/2, height/2 );

		        context.drawImage( image, -(dims[0] / 2), -(dims[1] / 2), dims[0], dims[1] );

				context.translate( -(width/2), -(height/2) );

		        image_url.revokeObjectURL( image_src );
		    };
		}
	}

};


/**
 * IntlTel utility provides methods to format the mobile and phone numbers.
 */

// == Intl Tel Utility ====================

cmt.utils.intltel = {

	initIntlTelInput: function( ccode ) {

		var cc = null != ccode ? ccode : 'us';

		if( !jQuery().intlTelInput ) {

			return;
		}

		jQuery( '.intl-tel-field-mb' ).intlTelInput({
			formatOnDisplay: false,
			separateDialCode: true,
			initialCountry: cc,
			numberType: "MOBILE",
			preventInvalidNumbers: true
		});

		jQuery( '.intl-tel-field-ph' ).intlTelInput({
			formatOnDisplay: false,
			separateDialCode: true,
			initialCountry: cc,
			numberType: "FIXED_LINE",
			preventInvalidNumbers: true
		});

		jQuery( '.intl-tel-field' ).each( function() {

			cmt.utils.intltel.populateIntlField( jQuery( this ) );
		});

		jQuery( '.intl-tel-field' ).on( 'blur', function() {

			cmt.utils.intltel.validateIntlField( jQuery( this ) );
		});

		jQuery( '.intl-tel-number' ).closest( '.form' ).on( 'submit', function() {

			var result = true;

			jQuery( this ).find( '.intl-tel-field' ).each( function() {

				var field = jQuery( this );

				if( !cmt.utils.intltel.validateIntlField( field ) ) {

					result = false;
				}
			});

			return result;
		});
	},

	initIntlTelField: function( field ) {

		if( !jQuery().intlTelInput ) {

			return;
		}

		if( null == field || field.length == 0 ) {

			return;
		}

		var type = cmt.utils.data.hasAttribute( field, 'data-intl-type' ) ? field.attr( 'data-intl-type' ) : 'mobile'; // mobile or phone

		switch( type ) {

			case 'mobile': {

				cmt.utils.intltel.initMobileField( field );

				break;
			}
			case 'phone': {

				cmt.utils.intltel.initPhoneField( field );

				break;
			}
		}
	},

	initMobileField: function( field ) {

		var cc		= cmt.utils.data.hasAttribute( field, 'data-ccode' ) ? field.attr( 'data-ccode' ) : 'us';
		var ccOnly	= cmt.utils.data.hasAttribute( field, 'data-ccode-only' ) ? field.attr( 'data-ccode-only' ) : null;

		if( null != ccOnly ) {

			field.intlTelInput({
				formatOnDisplay: false,
				separateDialCode: true,
				initialCountry: cc,
				numberType: "MOBILE",
				preventInvalidNumbers: true,
				onlyCountries: [ ccOnly ]
			});
		}
		else {

			field.intlTelInput({
				formatOnDisplay: false,
				separateDialCode: true,
				initialCountry: cc,
				numberType: "MOBILE",
				preventInvalidNumbers: true
			});
		}
		cmt.utils.intltel.populateIntlField( field );

		field.on( 'blur', function() {

			cmt.utils.intltel.validateIntlField( field );
		});

		field.closest( '.form' ).on( 'submit', function() {

			var result = true;

			if( !cmt.utils.intltel.validateIntlField( field ) ) {

				result = false;
			}

			return result;
		});
	},

	initPhoneField: function( field ) {

		var cc = cmt.utils.data.hasAttribute( field, 'data-ccode' ) ? field.attr( 'data-ccode' ) : 'us';

		jQuery( '.intl-tel-field-ph' ).intlTelInput({
			formatOnDisplay: false,
			separateDialCode: true,
			initialCountry: cc,
			numberType: "FIXED_LINE",
			preventInvalidNumbers: true
		});

		cmt.utils.intltel.populateIntlField( field );

		field.on( 'blur', function() {

			cmt.utils.intltel.validateIntlField( field );
		});

		field.closest( '.form' ).on( 'submit', function() {

			var result = true;

			if( !cmt.utils.intltel.validateIntlField( field ) ) {

				result = false;
			}

			return result;
		});
	},

	validateIntlField: function( field ) {

		var parent	= field.closest( '.form-group' );
		var val		= field.val();
		var ccode	= "+" + field.intlTelInput( 'getSelectedCountryData' ).dialCode;

		if( val == '' && field.hasClass( 'intl-tel-required' ) ) {

			parent.find( '.help-block' ).html( 'Mobile cannot be blank.' );

			return false;
		}
		else if( val.length > 0 && !field.intlTelInput( 'isValidNumber' ) ) {

			parent.find( '.help-block' ).html( 'Mobile number format is wrong.' );

			return false;
		}
		else {

			parent.find( '.help-block' ).html( '' );
		}

		// Format Standard - ITU-T E.164
		// field.intlTelInput( 'getNumber', intlTelInputUtils.numberFormat.E164 )

		var number = field.intlTelInput( 'getNumber' );

		if( number !== ccode ) {

			parent.find( '.intl-tel-number' ).val( field.intlTelInput( 'getNumber' ) );
		}
		else {

			parent.find( '.intl-tel-number' ).val( '' );
		}

		return true;
	},

	populateIntlField: function( field ) {

		var parent	= field.closest( '.form-group' );
		var val		= parent.find( '.intl-tel-number' );

		if( val.length > 0 ) {

			field.intlTelInput( 'setNumber', val.val() );
		}
	}
};


/**
 * Object utility provides methods to initialise or manipulate objects.
 */

// == Object Utility ======================

cmt.utils.object = {

	/**
	 * Return object/instance associated to given string with namespace. It also check the type of Object.
	 */
	strToObject: function( str ) {

	    var arr = str.split( "." );

		var objClass = ( window || this );

	    for( var i = 0, arrLength = arr.length; i < arrLength; i++ ) {

	        objClass = objClass[ arr[ i ] ];
	    }

		var obj = new objClass;

		if ( typeof obj !== 'object' ) {

			throw new Error( str +" not found" );
		}

		return obj;
	},

	// Check whether the given object has property
	hasProperty: function( object, property ) {

		var prototype = object.__proto__ || object.constructor.prototype;

		return ( property in object ) && ( !( property in prototype ) || prototype[ property ] !== object[ property ] );
	},

	/**
	 * Check whether the given object exists and it's type is function
	 */
	isFunction: function( name ) {

		return typeof window[ name ] === "function";
	}

};


/**
 * UI utility provides methods to format or manage UI elements.
 */

// == UI Utility ==========================

cmt.utils.ui = {

	/**
	 * Aligns child element content at the center of parent vertically and horizontally. It expect parent to be positioned.
	 */
	alignMiddle: function( parent, child ) {

		var parent	= jQuery( parent );
		var child	= jQuery( child );

		var parentHeight	= parent.height();
		var parentWidth		= parent.width();
		var childHeight		= child.height();
		var childWidth		= child.width();

		if( childHeight <= parentHeight && childWidth <= parentWidth ) {

			var top		= (parentHeight - childHeight) / 2;
			var left	= (parentWidth - childWidth) / 2;

			child.css( { "position": "absolute", "top": top, "left": left } );
		}
	},

	// Initialise Custom Select
	initSelect: function( selector ) {
		
		jQuery( selector ).cmtSelect( { iconHtml: '<span class="cmti cmti-chevron-down"></span>' } );
	},

	// Initialise Custom Select
	initSelectElement: function( element ) {
		
		element.cmtSelect( { iconHtml: '<span class="cmti cmti-chevron-down"></span>' } );
	},
	
	// Initialise Actions
	initActions: function( selector ) {
		
		var actions = jQuery( selector );

		// Actions
		actions.cmtActions();
		actions.find( '.cmt-auto-hide' ).cmtAutoHide();
	},
	
	// Initialise Actions
	initActionsElement: function( element ) {

		// Actions
		element.cmtActions();
		element.find( '.cmt-auto-hide' ).cmtAutoHide();
	}
};


/**
 * Validators utility provides methods to validate given value.
 */

// == Validators ==========================

cmt.utils.validation = {

	errors: {
		'email' : 'Please provide a valid email address.'
	},

	isEmail: function( email ) {

		var validator = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

		return validator.test( email );
	},

	getEmailError: function() {

		return this.errors[ 'email' ];
	}
};


/**
 * The base file of Velocity Framework to bootstrap the required namespace and components 
 * specific to components library.
 */

// == Global Namespace ====================

cmt.components = cmt.components || {};


/**
 * The base file of Velocity Framework to bootstrap the required namespace and components 
 * specific to base of components library.
 */

// == Global Namespace ====================

cmt.components.base = cmt.components.base || {};

// == Components Manager ==================

cmt.components.Root = function( options ) {

	this.components = []; // Alias, Path map

	this.activeComponents = []; // Alias, Component
}

/**
 * It maps the component to registry by accepting alias and path.
 *
 * @param {string} alias
 * @param {string} path
 */
cmt.components.Root.prototype.mapComponent = function( alias, path ) {

	if( this.components[ alias ] == undefined ) {

		this.components[ alias ] = path;
	}
}

/**
 * It returns the component from active components.
 *
 * @param {string} alias
 * @param {object} options
 * @param {boolean} factory
 * @returns {cmt.components.base.BaseComponent}
 */
cmt.components.Root.prototype.getComponent = function( alias, options, factory ) {

	options = typeof options !== 'undefined' ? options : { };

	if( this.components[ alias ] == undefined ) throw 'Component with alias ' + alias + ' is not registered.';

	// Create and return the instance
	if( factory ) {

		var component = cmt.utils.object.strToObject( this.components[ alias ] );

		// Initialise Component
		component.init( options );

		return component;
	}

	// Create singleton instance if not exist
	if( this.activeComponents[ alias ] == undefined ) {

		var component = cmt.utils.object.strToObject( this.components[ alias ] );

		// Initialise Component
		component.init( options );

		// Add singleton to active registry
		this.activeComponents[ alias ] = component;
	}

	return this.activeComponents[ alias ];
}

/**
 * It set and update the active components.
 *
 * @param {string} alias
 * @param {cmt.components.base.BaseComponent} component
 */
cmt.components.Root.prototype.setComponent = function( alias, component ) {

	if( this.activeComponents[ alias ] == undefined ) {

		this.activeComponents[ alias ] = component;
	}
}

/**
 * It maps the component to registry and add it to active components.
 *
 * @param {string} alias
 * @param {string} classpath
 * @param {object} options
 * @returns {cmt.components.base.BaseComponent}
 */
cmt.components.Root.prototype.registerComponent = function( alias, classpath, options ) {

	this.mapComponent( alias, classpath );

	return this.getComponent( alias, options );
};

cmt.components.root = new cmt.components.Root();


cmt.components.base.BaseComponent = function( options ) {

};

// Initialise --------------------

cmt.components.base.BaseComponent.prototype.init = function( options ) {

	// Initialise component
};


cmt.components.base.ActionsComponent = function() {

	this.counter = 0;

	this.documentHeight = 0;
	this.screenWidth	= 0;

	this.options = null;
};

cmt.components.base.ActionsComponent.inherits( cmt.components.base.BaseComponent );

cmt.components.base.ActionsComponent.prototype.defaults = {
	listAlignment: 'left' // Can be either left or right
};

// Initialise --------------------

cmt.components.base.ActionsComponent.prototype.init = function( options ) {

	// Configure Object
	this.documentHeight = jQuery( document ).height();
	this.screenWidth	= jQuery( window ).width();

	// Merge Options
	this.options = jQuery.extend( {}, this.defaults, options );
};

cmt.components.base.ActionsComponent.prototype.initElements = function( elements ) {

	var self = this;

	// Iterate and initialise the jQuery elements
	elements.each( function() {

		var element = jQuery( this );

		self.initElement( element );

		self.counter++;
	});
};

cmt.components.base.ActionsComponent.prototype.initElement = function( element ) {

	var self = this;

	var index = self.counter;
	
	var screenWidth = self.screenWidth;

	var data	= element.find( '.actions-list-data' );
	var align	= self.options.listAlignment;

	// Target
	element.find( '.actions-list-title' ).attr( 'data-target', '#actions-list-data-' + index );

	// Identifier
	element.attr( 'data-idx', index );
	data.attr( 'data-idx', index );

	// Configure Ids
	element.attr( 'id', 'actions-list-' + index );
	data.attr( 'id', 'actions-list-data-' + index );

	// Detach
	data = data.detach();

	// Append to Body
	data.appendTo( 'body' );

	// Alignment
	if( cmt.utils.data.hasAttribute( data, 'data-alignment' ) ) {

		align = data.attr( 'data-alignment' );
	}

	element.find( '.actions-list-title' ).click( function() {

		if( data.is( ':hidden' ) ) {

			var offset	= element.offset();
			var show	= align;

			var dataTop		= offset.top + element.height();
			var dataLeft	= offset.left;
			var dataRight	= screenWidth - offset.left - element.width();

			var dataWidth = data.width();

			// Swap Alignment - Left to Right
			if( align == 'left' && ( offset.left + dataWidth + 5 ) > screenWidth ) {

				show = 'right';
			}
			// Swap Alignment - Right to Left
			else if( align == 'right' && ( offset.left + dataWidth + 5 ) > element.width() ) {

				show = 'left';
			}

			if( show == 'left' ) {

				data.css( { top: dataTop, left: dataLeft } );
			}
			else if( show == 'right' ) {

				data.css( { top: dataTop, right: dataRight } );
			}

			data.slideDown( 'slow' );
		}
		else {

			data.slideUp( 'slow' );
		}
	});
};


// == Collage =============================

cmt.components.base.Collage = function() {

	// Max Images
	this.limit = 5;
	
	// Image Counter
	this.counter = 0;

	// Images Arrangement - 1 to 5 images
	this.config = [
		// 1 image - One row having 1 image
		[
			{ cr: { w: "f", h: "xl" } }
		],
		// 2 images - One row having 2 images
		[
			{ cl: { w: "h", h: "l" } },
			{ cb: { w: "0", h: "l" } },
			{ cl: { w: "h", h: "l" } }
		],
		// 3 images - One row having 1 image in first column and 2 images in 2nd column
		[
			{ cl: { w: "h", h: "xl" } },
			{ cb: { w: "0", h: "xl" } },
			{ cle: { w: "h", h: "xl", c: [
				{ cr: { w: "f", h: "m" } },
				{ cr: { w: "f", h: "m" } }
			] } }
		],
		// 4 images - First row having 1 image, Second row having 3 images
		[
			{ cr: { w: "f", h: "xl" } },
			{ cre: { w: "f", h: "l", c: [
				{ cl: { w: "ot", h: "l" } },
				{ cb: { w: "1", h: "l" } },
				{ cl: { w: "ot", h: "l" } },
				{ cb: { w: "1", h: "l" } },
				{ cl: { w: "ot", h: "l" } }
			] } }
		],
		// 5 images - First row having 2 images, Second row having 3 images
		[
			{ cre: { w: "f", h: "xl", c: [
				{ cl: { w: "h", h: "xl" } },
				{ cb: { w: "0", h: "xl" } },
				{ cl: { w: "h", h: "xl" } }
			] } },
			{ cre: { w: "f", h: "l", c: [
				{ cl: { w: "ot", h: "l" } },
				{ cb: { w: "0", h: "l" } },
				{ cl: { w: "ot", h: "l" } },
				{ cb: { w: "0", h: "l" } },
				{ cl: { w: "ot", h: "l" } }
			] } }
		]
	];
};

cmt.components.base.Collage.prototype.generateView = function( element ) {

	var slides	= element.children();
	var config	= this.config[ slides.length - 1 ];

	var html = this.generateConfigView( config, slides );

	return html;
};

cmt.components.base.Collage.prototype.generateConfigView = function( config, slides, wrapper ) {

	var html = null != wrapper ? "<div class=\"" + wrapper + "\">" : "<div class=\"crl-wrap\">";

	for( var i = 0; i < config.length; i++ ) {

		var con		= config[ i ];
		var slide	= jQuery( slides[ this.counter ] );

		if( cmt.utils.object.hasProperty( con, "cr" ) ) {
			
			slide.addClass( "cr-wrap" );

			html += "<div class=\"cr cr-w-" + con.cr.w + " cr-h-" + con.cr.h + "\">" + slides[ this.counter ].outerHTML + "</div>";

			this.counter++;
		}
		else if( cmt.utils.object.hasProperty( con, "cl" ) ) {
			
			slide.addClass( "cl-wrap" );

			html += "<div class=\"cl cl-w-" + con.cl.w + " cl-h-" + con.cl.h + "\">" + slides[ this.counter ].outerHTML + "</div>";

			this.counter++;
		}
		else if( cmt.utils.object.hasProperty( con, "cb" ) ) {

			html += "<div class=\"cb cb-w-" + con.cb.w + " cb-h-" + con.cb.h + "\"></div>";
		}
		else if( cmt.utils.object.hasProperty( con, "cle" ) ) {

			html += "<div class=\"cl cl-w-" + con.cle.w + " cl-h-" + con.cle.h + "\">";

			if( cmt.utils.object.hasProperty( con.cle, "c" ) ) {

				html += this.generateConfigView( con.cle.c, slides, "cle-wrap" );
			}

			html += "</div>";
		}
		else if( cmt.utils.object.hasProperty( con, "cre" ) ) {

			html += "<div class=\"cr cr-w-" + con.cre.w + " cr-h-" + con.cre.h + "\">";

			if( cmt.utils.object.hasProperty( con.cre, "c" ) ) {

				html += this.generateConfigView( con.cre.c, slides, "cre-wrap" );
			}

			html += "</div>";
		}
	}

	return html + "</div>";	
};


cmt.components.base.GalleryComponent = function() {

	// Id Tracker
	this.counter = 1;

	// Id & Index Prefix
	this.idKey		= 'cmt-gallery-';
	this.indexKey	= 'gl-';

	// All Galleries
	this.galleries = {};

	// Component Options
	this.options = null;
};

cmt.components.base.GalleryComponent.inherits( cmt.components.base.BaseComponent );

cmt.components.base.GalleryComponent.prototype.defaults = {
	// Listener Callback for item click
	onItemClick: null,
	// Collage
	collage: false,
	collageLimit: 5,
	collageConfig: null,
	// Lightbox
	lightbox: false,
	lightboxBkg: true, // Image as Background or Wrap the Image
	lightboxId: 'lightbox-slider'
};

// == Gallery Component ====================

cmt.components.base.GalleryComponent.prototype.init = function( options ) {

	// Merge Options
	this.options = jQuery.extend( {}, this.defaults, options );
};

cmt.components.base.GalleryComponent.prototype.resetOptions = function( options ) {

	// Merge Options
	this.options = jQuery.extend( {}, this.defaults, options );
};

cmt.components.base.GalleryComponent.prototype.initGalleries = function( elements ) {

	var self = this;

	// Iterate and initialise the jQuery elements
	elements.each( function() {

		var element = jQuery( this );

		var gallery = new cmt.components.base.Gallery( self, element );

		gallery.init();

		element.attr( 'id', self.idKey + self.counter );
		element.attr( 'data-idx', self.counter );

		self.galleries[ self.indexKey + self.counter ] = gallery;

		self.counter++;
	});
};

cmt.components.base.GalleryComponent.prototype.normaliseGalleries = function() {

	var galleries = this.galleries;

	// Iterate and normalise all the galleries
    for( var key in galleries ) {

		galleries[ key ].normalise();
    }
};

cmt.components.base.GalleryComponent.prototype.addItem = function( galleryKey, itemHtml ) {

	this.galleries[ this.indexKey + galleryKey ].addItem( itemHtml );
};

cmt.components.base.GalleryComponent.prototype.removeItem = function( galleryKey, itemKey ) {

	this.galleries[ this.indexKey + galleryKey ].removeItem( itemKey );
};

// == Gallery ==============================

cmt.components.base.Gallery = function( component, element ) {

	// Component & Options
	this.component	= component;
	this.options	= component.options;

	// The Element
	this.element = element;

	// Dimensions
	this.width	= 0;
	this.height	= 0;
	this.itemWidth	= 0;
	this.itemsCount = 0;

	// Items
	this.itemsWrapper = null;

	this.items = null;
};

cmt.components.base.Gallery.prototype.init = function() {

	// Gallery View
	this.initView();

	// Init Items based on configuration params
	this.normalise();

	// Indexify the Items
	this.indexItems();
};

// Update View
cmt.components.base.Gallery.prototype.initView = function() {

	var self = this;

	var options = this.options;
	var items	= this.element.children();

	// Generate Collage
	if( options.collage && items.length > 0 && items.length <= options.collageLimit ) {

		this.element.css( 'height', 'auto' );

		var collage = new cmt.components.base.Collage();

		collage.limit	= options.collageLimit;
		collage.config	= null != options.collageConfig ? options.collageConfig : collage.config;

		var html = collage.generateView( this.element );

		this.element.html( html );

		this.items = this.element.find( '.cl-wrap, .cr-wrap' );

		// Set items position
		this.items.each( function() {

			var currentItem = jQuery( this );

			self.resetItem( currentItem );
		});
	
		// Index
		this.indexItems();

		return;
	}

	// Add item class to all the items
	items.each( function() {

		var item = jQuery( this );

		item.addClass( 'gallery-item' );
	});

	items = this.element.find( '.gallery-item' ).detach();

	// Items
	var view = '<div class="gallery-items-wrap"><div class="gallery-items"></div></div>';

	this.element.html( view );

	this.itemsWrapper = this.element.find( '.gallery-items' );

	this.element.find( '.gallery-items' ).append( items );
};

// Normalise the items
cmt.components.base.Gallery.prototype.normalise = function() {

	var self	= this;
	var element	= this.element;

	// Dimensions
	this.width	= element.width();
	this.height	= element.height();

	// Items
	this.items = element.find( '.gallery-item' );

	this.itemWidth	= this.items.outerWidth();
	this.itemsCount	= this.items.length;

	// Set items position
	this.items.each( function() {

		var currentItem = jQuery( this );

		currentItem.css( { 'width': self.itemWidth } );

		self.resetItem( currentItem );
	});
};

// Index the items
cmt.components.base.Gallery.prototype.indexItems = function() {

	// Set items position
	this.items.each( function( index ) {

		var currentItem = jQuery( this );

		currentItem.attr( 'data-idx', index );
	});
}

// Add Item
cmt.components.base.Gallery.prototype.addItem = function( itemHtml ) {

	// Set items position
	this.items.each( function() {

		var currentItem = jQuery( this );

		var newIndex = parseInt( currentItem.attr( 'data-idx' ) ) + 1;

		currentItem.attr( 'data-idx', newIndex );
	});

	var item = this.itemsWrapper.find( '.gallery-item[data-idx=1]' );

	if( item.length == 0 ) {

		this.itemsWrapper.append( itemHtml );

		item = this.itemsWrapper.find( ':first-child' )[ 0 ];
		item = jQuery( item );
	}
	else {

		this.itemsWrapper.find( '.gallery-item[data-idx=1]' ).before( itemHtml );

		item = item.prev();
	}

	item.attr( 'data-idx', 0 );
	item.addClass( 'gallery-item' );

	// Normalise items
	this.normalise();
};

// Remove Item
cmt.components.base.Gallery.prototype.removeItem = function( itemKey ) {

	// Remove
	this.itemsWrapper.find( '.gallery-item[data-idx=' + itemKey + ']' ).remove();

	// Set items position
	this.items.each( function() {

		var currentItem = jQuery( this );

		var index = parseInt( currentItem.attr( 'data-idx' ) );

		if( index > itemKey ) {

			currentItem.attr( 'data-idx', ( index - 1 ) );
		}
	});

	// Normalise items
	this.normalise();
};

cmt.components.base.Gallery.prototype.resetItem = function( item ) {

	var self = this;

	var options = this.options;
	var element	= this.element;

	if( null !== options.onItemClick ) {

		// remove existing click event
		item.unbind( 'click' );

		// reset click event
		item.click( function() {

			options.onItemClick( element, item, item.attr( 'data-idx' ) );
		});
	}

	if( options.lightbox ) {

		item.click( function() {

			self.showLightbox( item, item.attr( 'data-idx' ) );
		});
	}
};

// Move to left on clicking next button
cmt.components.base.Gallery.prototype.showLightbox = function( item, itemId ) {

	var self		= this;
	var element		= this.element;
	var lightboxId	= this.options.lightboxId;
	var lightbox	= jQuery( '#' + lightboxId );

	// Configure
	var screenWidth		= jQuery( window ).width();
	var screenHeight	= jQuery( window ).height();

	var lightboxData = lightbox.find( '.lightbox-data' );

	var widthRatio	= screenWidth/12;
	var heightRatio	= screenHeight/12;

	lightboxData.css( { top: heightRatio/2, left: widthRatio/2, width: ( widthRatio * 11 ), height: ( heightRatio * 11 ) } );

	if( self.options.lightboxBkg ) {
		
		lightbox.find( '.lightbox-data-bkg' ).addClass( 'lightbox-bkg-wrap' );
	}

	var sliderHtml = '<div class="slider slider-basic slider-lightbox">';

	// Prepare Slider
	element.find( '.gallery-item, .item, .cl-wrap, .cr-wrap' ).each( function() {

		var item	= jQuery( this );
		var slId	= item.attr( 'data-idx' );

		var thumbUrl = item.attr( 'thumb-url' );
		var imageUrl = item.attr( 'image-url' );

		if( itemId == slId ) {

			sliderHtml += '<div class="active"><div class="bkg-image" style="background-image: url(' + thumbUrl + ');" image-url="' + imageUrl + '"></div></div>';

			if( self.options.lightboxBkg ) {

				lightbox.find( '.lightbox-data-bkg' ).css( 'background-image', 'url(' + imageUrl + ')' );
			}
			else {
				
				lightbox.find( '.lightbox-data-bkg' ).html( '<img src="' + imageUrl + '"/>' );
			}
		}
		else {

			sliderHtml += '<div><div class="bkg-image" style="background-image: url(' + thumbUrl + ');" image-url="' + imageUrl + '"></div></div>';
		}
	});

	sliderHtml += '</div>';

	lightboxData.find( '.wrap-gallery' ).html( sliderHtml );

	if( lightbox.hasClass( 'popup-modal' ) ) {

		jQuery( 'body' ).css( { 'overflow': 'hidden', 'height': jQuery( window ).height() } );
	}

	lightbox.fadeIn( 'slow' );

	lightboxData.find( '.slider-lightbox' ).cmtSlider({
		lControlContent: '<i class="fa fa-2x fa-angle-left valign-center"></i>',
		rControlContent: '<i class="fa fa-2x fa-angle-right valign-center"></i>',
		circular: false,
		onSlideClick: self.setLightboxBkg
	});
}

cmt.components.base.Gallery.prototype.setLightboxBkg = function( slider, slide, slideId ) {

	var imageUrl = slide.find( '.bkg-image' ).attr( 'image-url' );

	var bkg = slider.closest( '.lightbox-slider-wrap' ).find( '.lightbox-data-bkg' );

	slider.find( '.slide' ).removeClass( 'active' );
	slide.addClass( 'active' );

	bkg.hide();

	if( bkg.hasClass( 'lightbox-bkg-wrap' ) ) {

		bkg.css( 'background-image', 'url(' + imageUrl + ')');
	}
	else {
		
		bkg.html( '<img src="' + imageUrl + '"/>' );
	}

	bkg.fadeIn( 'slow' );
}


cmt.components.base.SliderComponent = function() {

	// Id Tracker
	this.counter = 1;

	// Id & Index Prefix
	this.idKey		= 'cmt-slider-';
	this.indexKey	= 'sl-';

	// All Sliders
	this.sliders = {};

	// Component Options
	this.options = null;
};

cmt.components.base.SliderComponent.inherits( cmt.components.base.BaseComponent );

cmt.components.base.SliderComponent.prototype.defaults = {
	// Normaliser
	normalise: true,
	// Controls
	controls: true,
	lControlContent: null,
	rControlContent: null,
	// Callback - Content is less than slider
	smallerContent: null,
	// Listener Callback for slide click
	onSlideClick: null,
	// Listener Callback for pre processing
	preSlideChange: null,
	// Listener Callback for post processing
	postSlideChange: null,
	circular: true,
	// Scrolling
	autoScroll: false,
	autoScrollType: 'left',
	autoScrollDuration: 5000,
	stopOnHover: true,
	// Collage
	collage: false,
	collageLimit: 5,
	collageConfig: null,
	// Lightbox
	lightbox: false,
	lightboxBkg: true, // Image as Background or Wrap the Image
	lightboxId: 'lightbox-slider'
};

// == Slider Component ====================

cmt.components.base.SliderComponent.prototype.init = function( options ) {

	// Merge Options
	this.options = jQuery.extend( {}, this.defaults, options );
};

cmt.components.base.SliderComponent.prototype.resetOptions = function( options ) {

	// Merge Options
	this.options = jQuery.extend( {}, this.defaults, options );
};

cmt.components.base.SliderComponent.prototype.initSliders = function( elements ) {

	var self = this;

	// Iterate and initialise the jQuery elements
	elements.each( function() {

		var element = jQuery( this );

		var slider = new cmt.components.base.Slider( self, element );

		slider.init();

		element.attr( 'id', self.idKey + self.counter );
		element.attr( 'data-idx', self.counter );

		self.sliders[ self.indexKey + self.counter ] = slider;

		self.counter++;
	});
};

cmt.components.base.SliderComponent.prototype.normaliseSliders = function() {

	var sliders = this.sliders;

	// Iterate and normalise all the sliders
    for( var key in sliders ) {

		sliders[ key ].normalise();
    }
};

cmt.components.base.SliderComponent.prototype.getSlider = function( sliderKey ) {

	return this.sliders[ this.indexKey + sliderKey ];
};

cmt.components.base.SliderComponent.prototype.addSlide = function( sliderKey, slideHtml ) {

	this.sliders[ this.indexKey + sliderKey ].addSlide( slideHtml );
};

cmt.components.base.SliderComponent.prototype.removeSlide = function( sliderKey, slideKey ) {

	this.sliders[ this.indexKey + sliderKey ].removeSlide( slideKey );
};

cmt.components.base.SliderComponent.prototype.scrollToPosition = function( sliderKey, position, animate ) {

	this.sliders[ this.indexKey + sliderKey ].scrollToPosition( position, animate );
};

cmt.components.base.SliderComponent.prototype.scrollToSlide = function( sliderKey, slideKey, animate ) {

	this.sliders[ this.indexKey + sliderKey ].scrollToSlide( slideKey, animate );
};

cmt.components.base.SliderComponent.prototype.showPrevSlide = function( sliderKey ) {

	this.sliders[ this.indexKey + sliderKey ].showPrevSlide();
};

cmt.components.base.SliderComponent.prototype.showNextSlide = function( sliderKey ) {

	this.sliders[ this.indexKey + sliderKey ].showNextSlide();
};

// == Slider ==============================

cmt.components.base.Slider = function( component, element ) {

	// Component & Options
	this.component	= component;
	this.options	= component.options;

	// The Element
	this.element = element;

	// Controls
	this.leftControl	= null;
	this.rightControl	= null;

	// Dimensions
	this.width	= 0;
	this.height	= 0;
	this.slideWidth	= 0;
	this.slidesCount = 0;

	// Slides
	this.filmstrip = null;

	this.slides = null;
};

cmt.components.base.Slider.prototype.init = function() {

	var settings = this.options;

	// Slider View
	this.initView();

	// Init Slides based on configuration params
	if( settings.normalise ) {

		this.normalise();
	}

	// Indexify the Slides
	this.indexSlides();

	if( settings.autoScroll ) {

		this.startAutoScroll();
	}
};

// Update View
cmt.components.base.Slider.prototype.initView = function() {

	var self = this;

	var options = this.options;
	var slides	= this.element.children();

	// Generate Collage
	if( options.collage && slides.length > 0 && slides.length <= options.collageLimit ) {

		this.element.css( 'height', 'auto' );

		var collage = new cmt.components.base.Collage();

		collage.limit	= options.collageLimit;
		collage.config	= null != options.collageConfig ? options.collageConfig : collage.config;

		var html = collage.generateView( this.element );

		this.element.html( html );

		this.slides = this.element.find( '.cl-wrap, .cr-wrap' );

		// Set slides position on filmstrip
		this.slides.each( function() {

			var currentSlide = jQuery( this );

			self.resetSlide( currentSlide );
		});

		// Index
		this.indexSlides();

		return;
	}

	// Add slide class to all the slides
	slides.each( function() {

		var slide = jQuery( this );

		slide.addClass( 'slider-slide' );
	});

	slides = this.element.find( '.slider-slide' ).detach();

	// Slides
	var view = '<div class="slider-slides-wrap"><div class="slider-slides"></div></div>';

	// Controls
	if( options.controls ) {

		view += '<div class="slider-control slider-control-left"></div><div class="slider-control slider-control-right"></div>';
	}

	this.element.html( view );

	this.element.find( '.slider-slides' ).append( slides );

	this.slides = this.element.find( '.slider-slide' );
};

// Make filmstrip of all slides
cmt.components.base.Slider.prototype.normalise = function() {

	var self	= this;
	var options = this.options;
	var element	= this.element;

	// Controls
	if( options.controls ) {

		this.leftControl	= element.find( '.slider-control-left' );
		this.rightControl	= element.find( '.slider-control-right' );
	}

	// Dimensions
	this.width	= element.width();
	this.height	= element.height();

	// Slides
	this.filmstrip = element.find( '.slider-slides' );

	this.slides = element.find( '.slider-slide' );

	this.slideWidth		= this.slides.outerWidth();
	this.slidesCount	= this.slides.length;

	// Filmstrip Width
	this.filmstrip.width( this.slideWidth * this.slidesCount );

	// Initialise Slide position
	var currentPosition	= 0;

	// Set slides position on filmstrip
	this.slides.each( function() {

		var currentSlide = jQuery( this );

		currentSlide.css( { 'width': self.slideWidth, 'left': currentPosition } );

		currentPosition += self.slideWidth;

		self.resetSlide( currentSlide );
	});

	if( this.filmstrip.width() < element.width() ) {

		// Notify the Callback for lower width
		if( null !== options.smallerContent ) {

			options.smallerContent( element, this.filmstrip );
		}
	}

	// Initialise controls
	if( options.controls ) {

		this.initControls();
	}
};

// Index the slides
cmt.components.base.Slider.prototype.indexSlides = function() {

	// Set slides position on filmstrip
	this.slides.each( function( index ) {

		var currentSlide = jQuery( this );

		currentSlide.attr( 'data-idx', index );
	});
}

// Initialise the Slider controls
cmt.components.base.Slider.prototype.initControls = function() {

	var self	= this;
	var options = this.options;
	var element	= this.element;

	if( this.filmstrip.width() < element.width() ) {

		this.leftControl.hide();
		this.rightControl.hide();

		return;
	}
	else {

		this.leftControl.show();
		this.rightControl.show();
	}

	// Show Controls
	var lControlContent	= options.lControlContent;
	var rControlContent	= options.rControlContent;

	// Init Listeners
	this.leftControl.html( lControlContent );
	this.rightControl.html( rControlContent );

	if( !options.circular ) {

		this.leftControl.hide();
		this.rightControl.show();
	}

	this.leftControl.unbind( 'click' );

	this.leftControl.click( function() {

		if( options.circular ) {

			self.showPrevSlide();
		}
		else {

			self.moveToRight();
		}
	});

	this.rightControl.unbind( 'click' );

	this.rightControl.click( function() {

		if( options.circular ) {

			self.showNextSlide();
		}
		else {

			self.moveToLeft();
		}
	});
};

// Add Slide
cmt.components.base.Slider.prototype.addSlide = function( slideHtml ) {

	// Set slides position on filmstrip
	this.slides.each( function() {

		var currentSlide = jQuery( this );

		var newIndex = parseInt( currentSlide.attr( 'data-idx' ) ) + 1;

		currentSlide.attr( 'data-idx', newIndex );
	});

	var slide = this.filmstrip.find( '.slider-slide[data-idx=1]' );

	if( slide.length == 0 ) {

		this.filmstrip.append( slideHtml );

		slide = this.filmstrip.find( ':first-child' )[ 0 ];
		slide = jQuery( slide );
	}
	else {

		this.filmstrip.find( '.slider-slide[data-idx=1]' ).before( slideHtml );

		slide = slide.prev();
	}

	slide.attr( 'data-idx', 0 );
	slide.addClass( 'slider-slide' );

	// Normalise slides
	this.normalise();
};

// Remove Slide
cmt.components.base.Slider.prototype.removeSlide = function( slideKey ) {

	// Remove
	this.filmstrip.find( '.slider-slide[data-idx=' + slideKey + ']' ).remove();

	// Set slides position on filmstrip
	this.slides.each( function() {

		var currentSlide = jQuery( this );

		var index = parseInt( currentSlide.attr( 'data-idx' ) );

		if( index > slideKey ) {

			currentSlide.attr( 'data-idx', ( index - 1 ) );
		}
	});

	// Normalise slides
	this.normalise();
};

cmt.components.base.Slider.prototype.resetSlide = function( slide ) {

	var self = this;

	var options = this.options;
	var element	= this.element;

	if( null !== options.onSlideClick ) {

		// remove existing click event
		slide.unbind( 'click' );

		// reset click event
		slide.click( function() {

			options.onSlideClick( element, slide, slide.attr( 'data-idx' ) );
		});
	}

	if( options.lightbox ) {

		slide.click( function() {

			self.showLightbox( slide, slide.attr( 'data-idx' ) );
		});
	}
};

// == Slides Movement ==

// Calculate and re-position slides to form filmstrip
cmt.components.base.Slider.prototype.resetSlides = function() {

	var self = this;

	var currentPosition	= 0;

	this.slides = this.filmstrip.find( '.slider-slide' );

	// reset filmstrip
	this.filmstrip.css( { left: 0 + 'px', 'right' : '' } );

	this.slides.each( function() {

		jQuery( this ).css( { 'left': currentPosition + 'px', 'right' : '' } );

		currentPosition += self.slideWidth;
	});
};

// Show Previous Slide on clicking next button
cmt.components.base.Slider.prototype.showNextSlide = function() {

	var self	= this;
	var options = this.options;
	var element	= this.element;

	var firstSlide = this.slides.first();

	// do pre processing
	if( null !== options.preSlideChange ) {

		options.preSlideChange( element, firstSlide, firstSlide.attr( 'data-idx' ) );
	}

	// do animation - animate slider
	this.filmstrip.animate(
		{ left: -this.slideWidth },
		{
			duration: 500,
			complete: function() {

				// Remove first and append to last
				var firstSlide = self.slides.first();

				firstSlide.insertAfter( self.slides.eq( self.slides.length - 1 ) );
				firstSlide.css( 'right', -self.slideWidth );

				self.resetSlides();
			}
		}
	);

	firstSlide = this.slides.first();

	// do post processing
	if( null !== options.postSlideChange ) {

		options.postSlideChange( element, firstSlide, firstSlide.attr( 'data-idx' ) );
	}
}

// Show Next Slide on clicking previous button
cmt.components.base.Slider.prototype.showPrevSlide = function() {

	var self	= this;
	var options = this.options;
	var element	= this.element;

	var firstSlide = this.slides.first();

	// do pre processing
	if( null !== options.preSlideChange ) {

		options.preSlideChange( element, firstSlide, firstSlide.attr( 'data-idx' ) );
	}

	// Remove last and append to first
	var lastSlide = this.slides.last();

	lastSlide.insertBefore( this.slides.eq( 0 ) );
	lastSlide.css( 'left', -this.slideWidth );

	// do animation - animate slider
	this.filmstrip.animate(
		{ left: this.slideWidth },
		{
			duration: 500,
			complete: function() {

				var slider = jQuery( this ).parent();

				self.resetSlides( slider );
			}
		}
	);

	firstSlide = this.slides.first();

	// do post processing
	if( null !== options.postSlideChange ) {

		options.postSlideChange( element, firstSlide, firstSlide.attr( 'data-idx' ) );
	}
}

// Slider Auto scroll
cmt.components.base.Slider.prototype.startAutoScroll = function() {

	var self = this;

	var slider		= this.element;
	var settings	= this.options;

	setInterval( function() {

		if( settings.autoScrollType == 'left' ) {

			var mouseIn = slider.attr( 'mouse-over' );

			if( settings.stopOnHover && null != mouseIn && mouseIn ) {

				return;
			}

			self.showNextSlide();
		}
		else if( settings.autoScrollType == 'right' ) {

			var mouseIn = slider.attr( 'mouse-over' );

			if( settings.stopOnHover && null != mouseIn && mouseIn ) {

				return;
			}

			self.showPrevSlide( slider );
		}

	}, settings.autoScrollDuration );
}

// Move to left on clicking next button
cmt.components.base.Slider.prototype.moveToLeft = function() {

	var self		= this;
	var settings	= this.options;
	var element		= this.element;

	var firstSlide		= this.slides.first();
	var slideWidth		= firstSlide.outerWidth();

	var sliderWidth		= element.outerWidth();
	var filmWidth		= this.filmstrip.outerWidth();
	var filmLeft		= this.filmstrip.position().left;

	var moveBy			= slideWidth;
	var leftPosition	= filmLeft - moveBy;
	var remaining		= filmWidth + leftPosition;

	if( remaining > ( sliderWidth - moveBy ) ) {

		// do animation - animate slider
		this.filmstrip.animate(
			{ left: leftPosition },
			{
				duration: 500,
				complete: function() {

					var filmWidth	= self.filmstrip.outerWidth();
					var filmLeft	= self.filmstrip.position().left;

					var leftPosition	= filmLeft - moveBy;
					var remaining		= filmWidth + leftPosition;

					if( remaining < ( sliderWidth - moveBy ) ) {

						if( settings.controls ) {

							self.rightControl.hide();
						}
					}

					if( settings.controls && self.leftControl.is( ':hidden' ) ) {

						self.leftControl.fadeIn( 'fast' );
					}
				}
			}
		);
	}
}

// Move to right on clicking prev button
cmt.components.base.Slider.prototype.moveToRight = function() {

	var self		= this;
	var settings	= this.options;

	var filmLeft = this.filmstrip.position().left;

	var moveBy			= this.slideWidth;
	var leftPosition	= filmLeft;

	if( leftPosition < -( this.slideWidth/2 ) ) {

		leftPosition = filmLeft + moveBy;

		// do animation - animate slider
		this.filmstrip.animate(
			{ left: leftPosition },
			{
				duration: 500,
				complete: function() {

					var filmLeft = self.filmstrip.position().left;

					if( filmLeft > -( self.slideWidth/2 ) ) {

						if( settings.controls ) {

							self.leftControl.hide();
						}

						self.filmstrip.position( { at: "left top" } );
					}

					if( settings.controls && self.rightControl.is( ':hidden' ) ) {

						self.rightControl.fadeIn( 'fast' );
					}
				}
			}
		);
	}
	else {

		if( settings.controls ) {

			this.leftControl.hide();
		}

		this.filmstrip.position( { at: "left top" } );
	}
};

// Scroll the filmstrip to given position
// Works only if - controls - false, autoScroll - false, slides count is at least 3
cmt.components.base.Slider.prototype.scrollToPosition = function( position, animate ) {

	var self		= this;
	var settings	= this.options;
	var element		= this.element;

	var sliderWidth	= element.outerWidth();

	var filmWidth	= this.filmstrip.outerWidth();
	var filmLeft	= this.filmstrip.position().left;

	var scrollScope	= filmWidth - ( 2 * sliderWidth );

	position = parseInt( position );

	var scrollTo = parseInt( ( scrollScope * position ) / 100 );

	if( !animate ) {

		// Extreme Left
		if( position == 0 ) {

			this.filmstrip.position( { at: "left top" } );
		}
		// Extreme Right
		else if( position == 100 ) {

			this.filmstrip.css( 'left', -( filmWidth - sliderWidth ) );
		}
		// Move
		else {

			this.filmstrip.css( 'left', -( sliderWidth + scrollTo ) );
		}
	}
};

// Scroll the filmstrip to given slide
// Works only if - controls - false, autoScroll - false, slides count is at least 3
cmt.components.base.Slider.prototype.scrollToSlide = function( skideKey, animate ) {

	var self		= this;
	var settings	= this.options;
	var element		= this.element;

	var filmWidth	= this.filmstrip.outerWidth();
	var filmLeft	= this.filmstrip.position().left;

	var moveTo = this.slideWidth * skideKey;

	if( !animate ) {

		// Extreme Left
		if( skideKey == 0 ) {

			this.filmstrip.position( { at: "left top" } );
		}
		// Move
		else {

			this.filmstrip.css( 'left', -moveTo );
		}
	}
};

// Show the slider images in lightbox slider
cmt.components.base.Slider.prototype.showLightbox = function( slide, slideId ) {

	var self		= this;
	var element		= this.element;
	var lightboxId	= this.options.lightboxId;
	var lightbox	= jQuery( '#' + lightboxId );
	var bkg			= lightbox.find( '.lightbox-data-bkg' );

	// Configure
	var screenWidth		= jQuery( window ).width();
	var screenHeight	= jQuery( window ).height();

	var lightboxData = lightbox.find( '.lightbox-data' );

	var widthRatio	= screenWidth/12;
	var heightRatio	= screenHeight/12;

	lightboxData.css( { top: heightRatio/2, left: widthRatio/2, width: ( widthRatio * 11 ), height: ( heightRatio * 11 ) } );

	if( self.options.lightboxBkg ) {

		bkg.addClass( 'lightbox-bkg-wrap' );
	}

	var sliderHtml = '<div class="slider slider-basic slider-lightbox">';

	// Prepare Gallery
	element.find( '.slider-slide, .slide, .cl-wrap, .cr-wrap' ).each( function() {

		var slide	= jQuery( this );
		var slId	= slide.attr( 'data-idx' );

		var thumbUrl = slide.attr( 'thumb-url' );
		var imageUrl = slide.attr( 'image-url' );

		if( slideId == slId ) {

			sliderHtml += '<div class="active"><div class="bkg-image" style="background-image: url(' + thumbUrl + ');" image-url="' + imageUrl + '"></div></div>';

			if( self.options.lightboxBkg ) {

				bkg.css( 'background-image', 'url(' + imageUrl + ')' );
			}
			else {

				bkg.html( '<img src="' + imageUrl + '"/>' );
			}
		}
		else {

			sliderHtml += '<div><div class="bkg-image" style="background-image: url(' + thumbUrl + ');" image-url="' + imageUrl + '"></div></div>';
		}
	});

	sliderHtml += '</div>';

	lightboxData.find( '.wrap-gallery' ).html( sliderHtml );

	if( lightbox.hasClass( 'popup-modal' ) ) {

		jQuery( 'body' ).css( { 'overflow': 'hidden', 'height': jQuery( window ).height() } );
	}

	bkg.attr( 'data-idx', slideId );
	bkg.attr( 'data-max', element.find( '.slider-slide' ).length );

	lightbox.fadeIn( 'slow' );

	// Sliders
	lightboxData.find( '.slider-lightbox' ).cmtSlider({
		lControlContent: '<i class="fa fa-2x fa-angle-left valign-center"></i>',
		rControlContent: '<i class="fa fa-2x fa-angle-right valign-center"></i>',
		circular: true,
		onSlideClick: self.setLightboxBkg
	});

	lightboxData.find( '.lightbox-control' ).unbind( 'click' );

	lightboxData.find( '.lightbox-control-left' ).click( function() {

		var slider	= lightboxData.find( '.slider-lightbox' ).cmtSlider( 'getSlider' );
		var element	= slider.element;

		slider.showPrevSlide();

		var slideId = parseInt( bkg.attr( 'data-idx' ) );
		var total	= parseInt( bkg.attr( 'data-max' ) );

		if( ( slideId == 0 ) ) {

			self.setLightboxBkg( element, element.find( '[data-idx=' + ( total - 1 ) + ']'), ( total - 1 ) );
		}
		else {

			self.setLightboxBkg( element, element.find( '[data-idx=' + ( slideId - 1 ) + ']'), ( slideId - 1 ) );
		}
	});

	lightboxData.find( '.lightbox-control-right' ).click( function() {

		var slider	= lightboxData.find( '.slider-lightbox' ).cmtSlider( 'getSlider' );
		var element	= slider.element;

		slider.showNextSlide();

		var slideId = parseInt( bkg.attr( 'data-idx' ) );
		var total	= parseInt( bkg.attr( 'data-max' ) );

		if( ( slideId == 0 && total == 1 ) || ( slideId == ( total - 1 ) ) ) {

			self.setLightboxBkg( element, element.find( '[data-idx=0]'), 0 );
		}
		else if( slideId == 0 && total > 1 ) {

			self.setLightboxBkg( element, element.find( '[data-idx=1]'), 1 );
		}
		else {

			self.setLightboxBkg( element, element.find( '[data-idx=' + ( slideId + 1 ) + ']'), ( slideId + 1 ) );
		}
	});
}

cmt.components.base.Slider.prototype.setLightboxBkg = function( slider, slide, slideId ) {

	var imageUrl = slide.find( '.bkg-image' ).attr( 'image-url' );

	var bkg = slider.closest( '.lightbox-slider-wrap' ).find( '.lightbox-data-bkg' );

	slider.find( '.slider-slide' ).removeClass( 'active' );
	slide.addClass( 'active' );

	bkg.hide();

	if( bkg.hasClass( 'lightbox-bkg-wrap' ) ) {

		bkg.css( 'background-image', 'url(' + imageUrl + ')');
	}
	else {

		bkg.html( '<img src="' + imageUrl + '"/>' );
	}

	bkg.attr( 'data-idx', slideId );
	bkg.attr( 'data-max', slider.find( '.slider-slide' ).length );

	bkg.fadeIn( 'slow' );
}


/**
 * The base file of Velocity Framework to bootstrap the required namespace and components 
 * specific to jQuery implementation of components library.
 */

// == Global Namespace ====================

cmt.components.jquery = cmt.components.jquery || {};


/**
 * Accordian plugin can be used to for accordian to control multiple elements with header.
 * Only one element will have active view.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtAccordian = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 	= cmtjq.extend( {}, cmtjq.fn.cmtAccordian.defaults, options );
		var accordians	= this;

		// Iterate and initialise all the accordians
		accordians.each( function() {

			var accordian = cmtjq( this );

			init( accordian );
		});

		// return control
		return;

		// == Private Functions == //

		function init( accordian ) {

			var triggers	= accordian.find( '.accordian-trigger' );
			var views		= accordian.find( '.accordian-view' );

			views.hide();

			// Activate first
			if( settings.showFirst ) {

				jQuery( views[ 0 ] ).addClass( 'active' );
				jQuery( views[ 0 ] ).slideDown( 'slow' );
			}

			// Listen click
			triggers.click( function() {
				
				var trigger		= jQuery( this );
				var view		= trigger.next( '.accordian-view' );
				var activeView	= accordian.find( '.accordian-view.active' );

				if( trigger.hasClass( 'active' ) ) {
					
					trigger.removeClass( 'active' );
					activeView.removeClass( 'active' );
					
					activeView.slideUp( 'slow' );
				} 
				else {

					// Deactivate
					activeView.slideUp( 'slow' );

					activeView.removeClass( 'active' );
					triggers.removeClass( 'active' );

					// Activate
					jQuery( this ).addClass( 'active' );
					jQuery( view ).addClass( 'active' );
					view.slideDown( 'slow' );
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtAccordian.defaults = {
		showFirst: false
	};

})( jQuery );


/**
 * Actions list having hidden action list displayed when user click on list title.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtActions = function( options ) {

		var component = null;

		// Init Elements
		try {

			component = cmt.components.root.getComponent( 'actions' );

			component.initElements( this );
		}
		// Init Component and Elements
		catch( err ) {

			component = cmt.components.root.registerComponent( 'actions', 'cmt.components.base.ActionsComponent', options );

			component.initElements( this );
		}

		// return control
		return;
	};

})( jQuery );


/**
 * Auto Suggest is jQuery plugin which change the default behaviour of input field. It shows
 * auto suggestions as user type and provide options to select single or multiple values.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtAutoFill = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings	= cmtjq.extend( {}, cmtjq.fn.cmtAutoFill.defaults, options );
		var fillers		= this;

		// Iterate and initialise all the fillers
		fillers.each( function() {

			var filler = cmtjq( this );

			init( filler );
		});

		// return control
		return;

		// == Private Functions == //

		function init( filler ) {

			// TODO: add logic to handle single and multi selects

			// Auto Fill
			filler.find( '.auto-fill-text' ).blur( function() {

				//var wrapFill = jQuery( this ).closest( '.wrap-fill' );

				//wrapFill.find( '.wrap-auto-list' ).slideUp();

				// Clear fields
				//wrapFill.find( '.fill-clear' ).val( '' );

				filler.find( '.auto-fill-items' ).slideUp();
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtAutoFill.defaults = {
		// default config
	};

})( jQuery );


/**
 * Actions list having hidden list displayed when user click on list title.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtAutoHide = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings	= cmtjq.extend( {}, cmtjq.fn.cmtFormInfo.defaults, options );
		var triggers	= this;

		// Iterate and initialise all the menus
		triggers.each( function() {

			var trigger = cmtjq( this );

			init( trigger );
		});

		// return control
		return;

		// == Private Functions == //

		function init( trigger ) {

			var target = jQuery( trigger.attr( 'data-target' ) );

			jQuery( window ).click( function( e ) {

				if ( !trigger.is( e.target ) && trigger.has( e.target ).length === 0 && !target.is( e.target ) && target.has( e.target ).length === 0 ) {

					jQuery( target ).slideUp();

					trigger.removeClass( 'active' );
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtAutoHide.defaults = {
		animation: 'slide'
	};

})( jQuery );


/**
 * Block component used to configure page blocks. It can be used to configure blocks height, css and parallax nature.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtBlock = function( options ) {

		// == Init == //

		// Configure Blocks
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtBlock.defaults, options );
		var blocks			= this;
		var screenHeight	= cmtjq( window ).height();
		var screenWidth		= cmtjq( window ).width();
		var blocksConfig	= settings.blocks;
		var blocksKeys		= Object.keys( blocksConfig );

		// Iterate and initialise all the page blocks
		blocks.each( function() {

			var block = cmtjq( this );

			init( block );
		});

		// Initialise parallax
		if( settings.backgroundParallax ) {

			cmtjq( window ).scroll( scrollBackground );
		}

		// return control
		return;

		// == Private Functions == //

		// Initialise Block
		function init( block ) {

			var blockAttr = settings.blockAttr;

			// -- Apply Block Specific Settings
			if( cmt.utils.data.hasAttribute( block, blockAttr ) && cmtjq.inArray( block.attr( blockAttr ), blocksKeys ) >= 0 ) {

				var blockConfig				= blocksConfig[ block.attr( blockAttr ) ];
				var height					= blockConfig[ 'height' ];
				var autoHeight				= blockConfig[ 'autoHeight' ];
				var fullHeight				= blockConfig[ 'fullHeight' ];
				var halfHeight				= blockConfig[ 'halfHeight' ];
				var qtfHeight				= blockConfig[ 'qtfHeight' ];
				var heightAuto				= blockConfig[ 'heightAuto' ];
				var heightAutoMobile		= blockConfig[ 'heightAutoMobile' ];
				var heightAutoMobileWidth	= blockConfig[ 'heightAutoMobileWidth' ];
				var css 					= blockConfig[ 'css' ];

				// Check whether pre-defined height is required
				if( null != height && height ) {

					block.css( { 'height': height + 'px' } );
				}

				// Apply auto height
				if( null != heightAuto && heightAuto ) {

					if( null != autoHeight && autoHeight ) {

						block.css( { 'height': 'auto' } );
					}
					else if( null != height && height ) {

						block.css( { 'height': 'auto', 'min-height': height + 'px' } );
					}
					else if( null != fullHeight && fullHeight ) {

						block.css( { 'height': 'auto', 'min-height': screenHeight + 'px' } );
					}
					else if( null != halfHeight && halfHeight ) {

						block.css( { 'height': 'auto', 'min-height': ( screenHeight / 2 ) + 'px' } );
					}
					else if( null != qtfHeight && qtfHeight ) {

						block.css( { 'height': 'auto', 'min-height': ( screenHeight * ( 3/4 ) ) + 'px' } );
					}
					else {

						block.css( { 'height': 'auto' } );
					}
				}

				// Apply Full Height
				if( null == height && null == heightAuto && ( null != fullHeight && fullHeight ) ) {

					block.css( { 'height': screenHeight + 'px' } );
				}

				// Apply Half Height
				if( null == height && null == heightAuto && ( null != halfHeight && halfHeight ) ) {

					block.css( { 'height': ( screenHeight / 2 ) + 'px' } );
				}

				// Apply Quarter to Full Height
				if( null == height && null == heightAuto && ( null != qtfHeight && qtfHeight ) ) {

					block.css( { 'height': ( screenHeight * ( 3/4 ) ) + 'px' } );
				}

				// Check whether min height and height auto is required for mobile to handle overlapped content
				if( null != heightAutoMobile && heightAutoMobile ) {

					if( window.innerWidth <= heightAutoMobileWidth ) {

						if( fullHeight ) {

							block.css( { 'height': 'auto', 'min-height': screenHeight + 'px' } );

							var contentWrap = block.children( '> .block-content-wrap' );

							if( contentWrap.length > 0 && contentWrap.hasClass( 'valign-center' ) ) {

								contentWrap.removeClass( 'valign-center' );
							}
						}
						else {

							block.css( { 'height': 'auto' } );
						}
					}
				}

				// adjust content wrap and block height in case content height exceeds
				var contentWrap	= block.find( '> .block-content-wrap' );
				var content		= block.find( '> .block-content' );

				if( contentWrap.length > 0 && content.length > 0 && ( content.height() > contentWrap.height() ) ) {

					var newHeight 	= ( content.height() + 100 ) + 'px';
					var diff		= content.height() - contentWrap.height();

					contentWrap.height( newHeight );

					newHeight = ( block.height() + diff + 100 ) + 'px';

					block.height( newHeight );
				}

				// Check whether additional css is required
				if( null != css && css ) {

					block.css( css );
				}
			}
			// -- Apply Common Settings for all the Blocks
			else {

				// Apply Auto Height
				if( settings.autoHeight ) {

					if( settings.autoHeight ) {

						block.css( { 'height': 'auto' } );
					}
				}

				// Apply Full Height
				if( settings.fullHeight ) {

					if( settings.heightAuto ) {

						block.css( { 'height': 'auto', 'min-height': screenHeight + 'px' } );
					}
					else {

						block.css( { 'height': screenHeight + 'px' } );
					}
				}

				// Apply Half Height
				if( settings.halfHeight ) {

					if( settings.heightAuto ) {

						block.css( { 'height': 'auto', 'min-height': ( screenHeight / 2 ) + 'px' } );
					}
					else {

						block.css( { 'height': ( screenHeight / 2 ) + 'px' } );
					}
				}

				// Apply Quarter to Full Height
				if( settings.qtfHeight ) {

					if( settings.heightAuto ) {

						block.css( { 'height': 'auto', 'min-height': ( screenHeight * ( 3/4 ) ) + 'px' } );
					}
					else {

						block.css( { 'height': ( screenHeight * ( 3/4 ) ) + 'px' } );
					}
				}
			}
		}

		// Initialise parallax
		function scrollBackground() {

			var winHeight 	= cmtjq( window ).height();
		    var winTop 		= cmtjq( window ).scrollTop();
		    var winBottom 	= winTop + winHeight;
		    var winCurrent 	= winTop + winHeight / 2;

		    blocks.each( function( i ) {

		        var block 			= cmtjq( this );
		        var blockHeight 	= block.height();
		        var blockTop 		= block.offset().top;
		        var blockBottom 	= blockTop + blockHeight;
		        var background		= block.children( '.block-bkg-parallax' );

		        if( null != background && background.length > 0 && winBottom > blockTop && winTop < blockBottom ) {

					var bkgWidth 		= background.width();
	            	var bkgHeight 		= background.height();
		            var min 			= 0;
		            var max 			= bkgHeight - winHeight * 0.5;
		            var heightOverflow 	= blockHeight < winHeight ? bkgHeight - blockHeight : bkgHeight - winHeight;
		            blockTop 			= blockTop - heightOverflow;
		            blockBottom 		= blockBottom + heightOverflow;
		            var value 			= min + (max - min) * ( winCurrent - blockTop ) / ( blockBottom - blockTop );

		            background.css( 'background-position', '50% ' + value + 'px' );
		        }
		    });
		}
	};

	// Default Settings
	cmtjq.fn.cmtBlock.defaults = {
		blockAttr: 'cmt-block',
		// Controls
		autoHeight: true,
		fullHeight: false,
		halfHeight: false,
		qtfHeight: false,
		heightAuto: false,
		backgroundParallax: true,
		blocks: {
			/* An array of blocks which need extra configuration. Ex:
			<Block Selector>: {
				height: 250,
				autoHeight: false,
				fullHeight: false,
				halfHeight: false,
				qtfHeight: false,
				heightAuto: false,
				heightAutoMobile: false,
				heightAutoMobileWidth: 1024,
				css: { color: 'white' }
			}
			*/
		}
	};

})( jQuery );


/**
 * It's a custom checkbox plugin used to make origin checkbox submit value everytime.
 */

( function( cmtjq ) {

// TODO: Add option for multi select

	cmtjq.fn.cmtCheckbox = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 	= cmtjq.extend( {}, cmtjq.fn.cmtCheckbox.defaults, options );
		var checkboxes	= this;

		// Iterate and initialise all the fox sliders
		checkboxes.each( function() {

			var checkbox = cmtjq( this );

			init( checkbox );
		});

		// return control
		return;

		// == Private Functions == //

		function init( checkbox ) {

			if( checkbox.is( '[disabled]' ) ) {

				return;
			}

			var field 	= checkbox.find( "input[type='checkbox']" );
			var input 	= checkbox.find( "input[type='hidden']" );

			if( input.val() == 1 ) {

				field.prop( 'checked', true );
				field.val( 1 );
			}

			field.change( function() {

				if( field.is( ':checked' ) ) {

 					input.val( 1 );
					field.val( 1 );

					input.trigger( 'change' );
 				}
 				else {

 					input.val( 0 );
					field.val( 0 );

					input.trigger( 'change' );
 				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtCheckbox.defaults = {
		// options
	};

})( jQuery );


/**
 * Collapsible plugin can be used to keep the title visible, but show or hide content.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtCollapsible = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings		= cmtjq.extend( {}, cmtjq.fn.cmtCollapsible.defaults, options );
		var collapsibles	= this;

		// Iterate and initialise all the collapsibles
		collapsibles.each( function() {

			var collapsible = cmtjq( this );

			init( collapsible );
		});

		// return control
		return;

		// == Private Functions == //

		function init( collapsible ) {

			var trigger	= collapsible.find( '.cmt-collapsible-trigger' );
			var header	= collapsible.find( '.cmt-collapsible-header' );
			var view	= collapsible.find( '.cmt-collapsible-content' );

			// Hide View
			if( settings.hideView ) {

				view.hide();
			}

			// Listen click
			trigger.click( function() {

				view.slideToggle();
			});

			// Header Trigger
			if( settings.headerTrigger ) {

				header.click( function() {

					view.slideToggle();
				});
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtCollapsible.defaults = {
		hideView: true,
		headerTrigger: true
	};

})( jQuery );


/**
 * The Counter Widget increment or decrement numerical value of a field.
 */

( function( cmtjq ) {

// TODO: Add option for multi select

	cmtjq.fn.cmtCounter = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings	= cmtjq.extend( {}, cmtjq.fn.cmtCounter.defaults, options );
		var counters	= this;

		// Iterate and initialise all the fox sliders
		counters.each( function() {

			var counter = cmtjq( this );

			init( counter );
		});

		// return control
		return;

		// == Private Functions == //

		function init( counter ) {

			var min		= cmt.utils.data.hasAttribute( counter, 'data-min' ) ? counter.attr( 'data-min' ) : settings.min;
			var max		= cmt.utils.data.hasAttribute( counter, 'data-max' ) ? counter.attr( 'data-max' ) : settings.max;
			var cval	= cmt.utils.data.hasAttribute( counter, 'data-val' ) ? counter.attr( 'data-val' ) : settings.val;

			min		= parseInt( min );
			max		= parseInt( max );
			cval	= parseInt( cval );

			var incBtn	= counter.find( '.counter-inc' );
			var decBtn	= counter.find( '.counter-dec' );
			var field	= counter.find( '.counter-val' );

			// Set value
			field.val( cval );

			if( min == cval ) {

				decBtn.addClass( 'disabled' );
			}
			else {

				decBtn.removeClass( 'disabled' );
			}

			if( max == cval ) {

				incBtn.addClass( 'disabled' );
			}
			else {

				incBtn.removeClass( 'disabled' );
			}

			incBtn.click( function() {

				cval = parseInt( field.val() );

				if( cval < max ) {

					cval++;

					field.val( cval );
					field.change();

					if( cval >= max ) {

						incBtn.addClass( 'disabled' );
						decBtn.removeClass( 'disabled' );

					}
					else {

						incBtn.removeClass( 'disabled' );
						decBtn.removeClass( 'disabled' );

					}
				}
			});

			decBtn.click( function() {

				cval = parseInt( field.val() );

				if( cval > min ) {

					cval--;

					field.val( cval );
					field.change();

					if( cval <= min ) {

						decBtn.addClass( 'disabled' );
						incBtn.removeClass( 'disabled' );

					}
					else {

						decBtn.removeClass( 'disabled' );
						incBtn.removeClass( 'disabled' );
					}
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtCounter.defaults = {
		min: 0,
		max: 10,
		val: 0
	};

})( jQuery );


/**
 * CmtFieldGroup plugin allows to show/hide group of fields using checkbox within the element.
 */

( function( cmtjq ) {

// TODO: Add option for multi select

	cmtjq.fn.cmtFieldGroup = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtFieldGroup.defaults, options );
		var fieldGroups		= this;

		// Iterate and initialise all the fox sliders
		fieldGroups.each( function() {

			var fieldGroup = cmtjq( this );

			init( fieldGroup );
		});

		// return control
		return;

		// == Private Functions == //

		function init( fieldGroup ) {

			var checkbox	= fieldGroup.find( "input[type='checkbox']" );
			var radio		= fieldGroup.find( "input[type='radio']" );
			var reverse		= cmt.utils.data.hasAttribute( fieldGroup, 'data-reverse' );

			if( checkbox.length > 0 ) {

				if( checkbox.prop( 'checked' ) ) {

					checkPositive( fieldGroup, reverse );
				}
				else {

					checkNegative( fieldGroup, reverse );
				}

				fieldGroup.click( function() {

					if( checkbox.prop( 'checked' ) ) {

						checkPositive( fieldGroup, reverse );
					}
					else {

						checkNegative( fieldGroup, reverse );
					}
				});
			}
			else if( radio.length == 1 ) {

				var status = fieldGroup.find( "input[type='radio']:checked" ).length;

				if( status == 1 ) {

					checkPositive( fieldGroup, reverse );
				}
				else if( status == 0 ) {

					checkNegative( fieldGroup, reverse );
				}

				fieldGroup.find( "input[type='radio']" ).change( function() {

					status = fieldGroup.find( "input[type='radio']:checked" ).length;

					if( status == 1 ) {

						checkPositive( fieldGroup, reverse );
					}
					else if( status == 0 ) {

						checkNegative( fieldGroup, reverse );
					}
				});
			}
			else if( radio.length > 1 ) {

				var status = parseInt( fieldGroup.find( "input[type='radio']:checked" ).val() );

				if( status == 1 ) {

					checkPositive( fieldGroup, reverse );
				}
				else if( status == 0 ) {

					checkNegative( fieldGroup, reverse );
				}

				fieldGroup.find( "input[type='radio']" ).change( function() {

					status = parseInt( fieldGroup.find( "input[type='radio']:checked" ).val() );

					if( status == 1 ) {

						checkPositive( fieldGroup, reverse );
					}
					else if( status == 0 ) {

						checkNegative( fieldGroup, reverse );
					}
				});
			}
		}

		function checkPositive( fieldGroup, reverse ) {

			var target	= fieldGroup.attr( 'group-target' );
			var alt		= fieldGroup.attr( 'group-alt' );

			if( reverse ) {

				jQuery( '.' + target ).hide();
				jQuery( '.' + alt ).show();
			}
			else {

				jQuery( '.' + target ).show();
				jQuery( '.' + alt ).hide();
			}
		}

		function checkNegative( fieldGroup, reverse ) {

			var target	= fieldGroup.attr( 'group-target' );
			var alt		= fieldGroup.attr( 'group-alt' );

			if( reverse ) {

				jQuery( '.' + target ).show();
				jQuery( '.' + alt ).hide();
			}
			else {

				jQuery( '.' + target ).hide();
				jQuery( '.' + alt ).show();
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtFieldGroup.defaults = {
		// options
	};

})( jQuery );


/**
 * File Uploader plugin can be used to upload files. The appropriate backend code should be able to handle the file sent by this plugin.
 * It works fine for CMSGears using it's File Uploader and Avatar Uploader widgets.
 *
 * It also support two special cases using special classes as listed below:
 *
 * file-uploader-direct - To upload several files in a row.
 *
 * file-uploader-chooser - Always Show File Wrap and Chooser and keep Dragger hidden.
 */

// TODO: Validate for max file size if possible

// File Uploader Plugin
( function( cmtjq ) {

	cmtjq.fn.cmtFileUploader = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtFileUploader.defaults, options );
		var fileUploaders	= this;
		var cameraStream	= null;
		var videoPlayer		= null;

		// Iterate and initialise all the uploaders
		fileUploaders.each( function() {

			var fileUploader = cmtjq( this );

			init( fileUploader, cameraStream, videoPlayer );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Uploader
		function init( fileUploader, cameraStream, videoPlayer ) {

			initBtnChooser( fileUploader );

			initBtnCapture( fileUploader, cameraStream, videoPlayer );

			// Always Show File Wrap and Chooser and keep Dragger hidden
			if( fileUploader.hasClass( 'file-uploader-chooser' ) ) {

				fileUploader.find( '.chooser-wrap' ).show();
				fileUploader.find( '.file-wrap' ).show();
				fileUploader.find( '.file-dragger' ).hide();
			}

			initUploader( fileUploader );
		}

		function initBtnChooser( fileUploader ) {

			// Show/Hide file chooser - either of the option must exist to choose file
			var btnChooser	= fileUploader.find( '.btn-chooser' );

			if( btnChooser.length > 0 ) {

				if( settings.direct || fileUploader.hasClass( 'file-uploader-direct' ) ) {

					fileUploader.addClass( 'file-uploader-direct' );

					btnChooser.hide();

					if( settings.toggle ) {

						fileUploader.find( '.chooser-wrap' ).show();
						fileUploader.find( '.file-wrap' ).hide();
					}
				}

				btnChooser.click( function() {

					if( settings.toggle ) {

						// Swap Chooser and Dragger
						fileUploader.find( '.chooser-wrap' ).fadeToggle( 'slow' );
						fileUploader.find( '.file-wrap' ).fadeToggle( 'fast' );
					}

					// Hide Postaction
					fileUploader.find( '.post-action' ).hide();

					// Reset Chooser
					fileUploader.find( '.file-chooser .input' ).val( "" );

					// Reset Canvas and Progress
					resetUploader( fileUploader );
				});
			}
		}

		function initBtnCapture( fileUploader, cameraStream, videoPlayer ) {

			// Capture Button
			var btnCapture = fileUploader.find( '.btn-capture' );

			if( btnCapture.length > 0 ) {

				btnCapture.click( function() {

					var camera = parseInt( btnCapture.attr( 'data-camera' ) );

					// Enable Camera
					if( camera == 0 ) {

						var stream = 'mediaDevices' in navigator;

						// Start Camera
						if( stream ) {

							navigator.mediaDevices.getUserMedia( { video: true } )
							.then( function( mediaStream ) {

								videoPlayer = fileUploader.find( '.file-camera .video' )[ 0 ];

								videoPlayer.srcObject = mediaStream;

								cameraStream = mediaStream;

								videoPlayer.play();
							})
							.catch( function( err ) {

								console.log( "Unable to access camera: " + err );
							});
						}
						else {

							alert( 'Your browser does not support media devices.' );

							return;
						}

						btnCapture.attr( 'data-camera', 1 );

						fileUploader.find( '.file-preloader .file-preloader-bar' ).html( '' );
					}
					// Disable Camera
					else {

						if( null != cameraStream ) {

							var track = cameraStream.getTracks()[0];

							track.stop();

							cameraStream = null;

							if( null != videoPlayer ) {

								videoPlayer.load();
							}
						}

						btnCapture.attr( 'data-camera', 0 );
					}

					if( settings.toggle ) {

						// Swap Chooser and Dragger
						fileUploader.find( '.chooser-wrap' ).fadeToggle( 'slow' );
						fileUploader.find( '.file-wrap' ).fadeToggle( 'fast' );
					}

					// Hide Postaction
					fileUploader.find( '.post-action' ).hide();

					// Reset Canvas and Progress
					resetUploader( fileUploader );
				});

				jQuery( '.file-capture' ).click( function() {

					if( null != cameraStream ) {

						uploadCapture( fileUploader, cameraStream, videoPlayer );
					}
				});
			}
		}

		function initUploader( fileUploader ) {

			// Modern Uploader
			if ( cmt.utils.browser.isFileApi() ) {

				// Traditional way using input
				var inputField = fileUploader.find( '.file-chooser .input' );

				inputField.change( function( event ) {

					handleFile( event, fileUploader );
				});

				// Modern way using Drag n Drop
				var dragElement = fileUploader.find( '.file-dragger .drag-wrap' );

				dragElement.bind( 'dragover', function( event ) {

					handleDragging( event );
				});

				dragElement.bind( 'dragleave', function( event ) {

					handleDragging( event );
				});

				dragElement.bind( 'drop', function( event ) {

					handleFile( event, fileUploader );
				});
			}
			// Form Data Uploader
			else if( cmt.utils.browser.isFormData() ) {

				var directory	= fileUploader.attr( 'directory' );
				var type		= fileUploader.attr( 'type' );
				var gen			= fileUploader.attr( 'gen' );
				var inputField 	= fileUploader.find( '.file-chooser .input' );

				inputField.change( function( event ) {

					uploadTraditionalFile( fileUploader, directory, type, gen );
				});
			}
		}

		function resetUploader( fileUploader ) {

			// Clear Old Values
			if( cmt.utils.browser.isCanvas() && fileUploader.attr( 'type' ) == 'image' ) {

				var canvasArr = fileUploader.find( '.file-dragger canvas, .file-camera .canvas' );

				if( canvasArr.length > 0 ) {

					var canvas	= canvasArr[ 0 ];
					var context = canvas.getContext( '2d' );

					context.clearRect( 0, 0, canvas.width, canvas.height );
				}
			}

			var progressContainer = fileUploader.find( '.file-preloader .file-preloader-bar' );

			// Modern Uploader
			if( cmt.utils.browser.isFileApi() ) {

				progressContainer.css( "width", "0%" );
			}
			// Form Data Uploader
			else if( cmt.utils.browser.isFormData() ) {

				progressContainer.html( "" );
			}
		}

		function handleDragging( event ) {

			event.stopPropagation();
			event.preventDefault();

			event.target.className = ( event.type == "dragover" ? "dragger-hover" : "" );
		}

		function handleFile( event, fileUploader ) {

			var directory	= fileUploader.attr( 'directory' );
			var type		= fileUploader.attr( 'type' );
			var gen			= fileUploader.attr( 'gen' );

			// cancel event and add hover styling
			handleDragging( event );

			// FileList
			var files = event.target.files || event.originalEvent.dataTransfer.files;

			// Draw if image
			if( settings.preview && cmt.utils.browser.isCanvas() && type == 'image' ) {

				var canvas = fileUploader.find( '.file-dragger canvas' );

				if( canvas.length > 0 ) {

					canvas.show();

					cmt.utils.image.drawAtCanvasCenter( canvas[0], files[0] );
				}
			}

			// Upload File
			uploadFile( fileUploader, directory, type, gen, files[0] );
		}

		function uploadFile( fileUploader, directory, type, gen, file ) {

			var xhr 				= new XMLHttpRequest();
			var fileType			= file.type.toLowerCase();
			var isValidFile			= jQuery.inArray( fileType, settings.fileFormats );
			var progressContainer	= fileUploader.find( '.file-preloader .file-preloader-bar' );
			var formData 			= new FormData();

			// append form data
			formData.append( 'file', file );

			// reset progress bar
			progressContainer.css( "width", "0%" );

			// upload file
			if( xhr.upload && isValidFile ) {

				// Upload progress
				xhr.upload.onprogress = function( e ) {

					if( e.lengthComputable ) {

						var progress = Math.round( ( e.loaded * 100 ) / e.total );

						progressContainer.css( "width", progress + "%" );
					}
				};

				// file received/failed
				xhr.onreadystatechange = function( e ) {

					if ( xhr.readyState == 4 ) {

						if( xhr.status == 200 ) {

							var jsonResponse = JSON.parse( xhr.responseText );

							if( jsonResponse[ 'result' ] == 1 ) {

								var responseData = jsonResponse[ 'data' ];

								if( settings.uploadListener ) {

									settings.uploadListener( fileUploader, directory, type, gen, responseData );
								}
								else {

									fileUploaded( fileUploader, directory, type, gen, responseData );
								}
							}
							else {

								var responseData = jsonResponse[ 'errors' ];

								alert( responseData.error );
							}

							// Reset Canvas and Progress
							resetUploader( fileUploader );
						}
					}
				};

				var urlParams = siteUrl + fileUploader.attr( 'uploader' ) + "?directory=" + encodeURIComponent( directory ) + "&type=" + encodeURIComponent( type ) + "&gen=" + encodeURIComponent( gen );

				// start upload
				xhr.open("POST", urlParams, true );
				xhr.send( formData );
			}
			else {

				alert( "File format not allowed." );
			}
		}

		// TODO; Test it well
		function uploadTraditionalFile( fileUploader, directory, type, gen ) {

			var progressContainer	= fileUploader.find( '.file-preloader .file-preloader-bar' );
			var fileList			= fileUploader.find( '.file-chooser .input' );
			var file 				= fileList.files[ 0 ];
			var formData 			= new FormData();
			fileName 				= file.name;

			// Show progress
			progressContainer.html( 'Uploading file' );

			formData.append( 'file', file );

			var urlParams = siteUrl + fileUploader.attr( 'uploader' ) + "?directory=" + encodeURIComponent( directory ) + "&type=" + encodeURIComponent( type ) + "&gen=" + encodeURIComponent( gen );

			jQuery.ajax({
			  type:			"POST",
			  url: 			urlParams,
			  data: 		formData,
		      cache: 		false,
		      contentType: 	false,
		      processData: 	false,
			  dataType:		'json',
			}).done( function( response ) {

				progressContainer.html( 'File uploaded' );

				if( response['result'] == 1 ) {

					if( settings.uploadListener ) {

						settings.uploadListener( fileUploader, directory, type, gen, response[ 'data' ] );
					}
					else {

						fileUploaded( fileUploader, directory, type, gen, response[ 'data' ] );
					}
				}
				else {

					var errors = response[ 'errors' ];

					alert( errors.error );
				}

				// Reset Canvas and Progress
				resetUploader( fileUploader );
			});
		}

		function uploadCapture( fileUploader, cameraStream, videoPlayer ) {

			var directory	= fileUploader.attr( 'directory' );
			var type		= fileUploader.attr( 'type' );
			var gen			= fileUploader.attr( 'gen' );
			var canvas		= fileUploader.find( '.file-camera .canvas' );
			var fileName	= canvas.attr( 'data-name' );
			canvas			= canvas[ 0 ];
			var context		= canvas.getContext( '2d' );

			context.drawImage( videoPlayer, 0, 0, canvas.width, canvas.height );

			var dataURI		= canvas.toDataURL( "image/png" );
			var imageData	= cmt.utils.data.dataURItoBlob( dataURI );

			var progressContainer = fileUploader.find( '.file-preloader .file-preloader-bar' );

			var formData = new FormData();

			// Show progress
			progressContainer.html( 'Uploading file' );

			formData.append( 'file', imageData, fileName );

			var urlParams = siteUrl + fileUploader.attr( 'uploader' ) + "?directory=" + encodeURIComponent( directory ) + "&type=" + encodeURIComponent( type ) + "&gen=" + encodeURIComponent( gen );

			jQuery.ajax({
			  type:			"POST",
			  url: 			urlParams,
			  data: 		formData,
		      cache: 		false,
		      contentType: 	false,
		      processData: 	false,
			  dataType:		'json',
			}).done( function( response ) {

				progressContainer.html( 'File uploaded' );

				if( response['result'] == 1 ) {

					if( settings.uploadListener ) {

						settings.uploadListener( fileUploader, directory, type, gen, response[ 'data' ] );
					}
					else {

						fileUploaded( fileUploader, directory, type, gen, response[ 'data' ] );

						if( null != cameraStream ) {

							var track = cameraStream.getTracks()[ 0 ];

							track.stop();

							cameraStream = null;

							if( null != videoPlayer ) {

								videoPlayer.load();
							}
						}

						fileUploader.find( '.btn-capture' ).attr( 'data-camera', 0 );
					}
				}
				else {

					var errors = response[ 'errors' ];

					alert( errors.error );
				}

				// Reset Canvas and Progress
				resetUploader( fileUploader );
			});
		}

		// default post processor for uploaded files.
		function fileUploaded( fileUploader, directory, type, gen, result ) {

			var fileName = result[ 'name' ] + "." + result[ 'extension' ];

			if( null == type || typeof type == 'undefined' ) {

				type = result[ 'type' ];
			}

			switch( type ) {

				case "image": {

					fileUploader.find( '.file-data' ).html( "<img src='" + result['tempUrl'] + "' class='fluid' />" );

					updateFileData( fileUploader, type, result );

					break;
				}
				case "video": {

					fileUploader.find( '.file-data' ).html( "<video src='" + result['tempUrl'] + "' controls class='fluid'>Video not supported.</video>" );

					updateFileData( fileUploader, type, result );

					break;
				}
				case "document":
				case "mixed":
				case "compressed":
				case "shared": {

					fileUploader.find( '.file-data' ).html( "<i class='" + settings.docSuccessIcon + "'></i>" );

					updateFileData( fileUploader, type, result );

					break;
				}
			}

			if( settings.toggle ) {

				// Swap Chooser and File Wrap
				fileUploader.find( '.chooser-wrap' ).fadeToggle( 'fast' );

				if( !fileUploader.hasClass( 'file-uploader-chooser' ) ) {

					fileUploader.find( '.file-wrap' ).fadeToggle( 'slow' );
				}
			}

			// Show Clear and Postaction
			fileUploader.find( '.file-clear' ).fadeIn();
			fileUploader.find( '.post-action' ).fadeIn();
		}

		function updateFileData( fileUploader, type, result ) {

			var fileInfo	= fileUploader.find( '.file-info' );
			var fileFields	= fileUploader.find( '.file-fields' );

			fileInfo.find( '.name' ).val( result[ 'name' ] );
			fileInfo.find( '.type' ).val( type );
			fileInfo.find( '.extension' ).val( result[ 'extension' ] );
			fileInfo.find( '.change' ).val( 1 );

			var title = fileFields.find( '.title' ).val();

			if( null == title || title.length == 0 ) {

				fileFields.find( '.title' ).val( result[ 'title' ] );
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtFileUploader.defaults = {
		fileFormats: [ "jpg", "jpeg", "png", "gif", "pdf", "csv" ],
		direct: false,
		uploadListener: null,
		preview: true,
		toggle: true,
		docSuccessIcon: 'cmti cmti-3x cmti-check'
	};

})( jQuery );


/**
 * Form Info is a small plugin to flip form information and form fields. The form information 
 * can be formed only by labels whereas fields can be formed using labels and form elements.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtFormInfo = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtFormInfo.defaults, options );
		var forms			= this;

		// Iterate and initialise all the menus
		forms.each( function() {

			var form = cmtjq( this );

			init( form );
		});

		// return control
		return;

		// == Private Functions == //

		function init( form ) {

			form.find( '.box-trigger-form' ).click( function() {

				var parent	= jQuery( this ).closest( '.box-form' );
				var info 	= parent.find( '.box-form-info-wrap' );
				var content = parent.find( '.box-form-content-wrap' );

				if( info.is( ':visible' ) ) {

					info.hide();
					
					content.fadeIn( 'slow' );
				}
				else {

					info.fadeIn( 'fast' );
					
					content.hide();
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtFormInfo.defaults = {
		// default config
	};

})( jQuery );


/**
 * The Gallery Plugin shows images as Gallery.
 */

( function( cmtjq ) {

	var component = null;

	var methods = {
		init: function( options ) {

			// Init Elements
			try {

				component.resetOptions( options );

				component.initGalleries( this );
			}
			// Init Component and Elements
			catch( err ) {

				component = cmt.components.root.registerComponent( 'gallery', 'cmt.components.base.GalleryComponent', options );

				component.initGalleries( this );
			}

			if( null != component ) {

				// Window resize
				cmtjq( window ).resize( function() {

					component.normaliseGalleries();
				});
			}
		},
		addItem: function( itemHtml ) {

			var galleryKey = parseInt( jQuery( this[ 0 ] ).attr( 'data-idx' ) );

			component.addItem( galleryKey, itemHtml );
		},
		removeItem: function( itemKey ) {
			
			var galleryKey = parseInt( jQuery( this[ 0 ] ).attr( 'data-idx' ) );

			component.removeItem( galleryKey, itemKey );
		}
	};

	cmtjq.fn.cmtGallery = function( param ) {

		// Call exclusive method
        if( methods[ param ] ) {

            return methods[ param ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
        }
		// Call init
		else if( typeof param === 'object' || ! param ) {

            return methods.init.apply( this, arguments );
        }
		// Log error
		else {

            cmtjq.error( 'CMT Gallery - method ' +  param + ' does not exist.' );
        }

		// return control
		return;
	};

})( jQuery );


/**
 * Grid
 */

( function( cmtjq ) {

	cmtjq.fn.cmtGrid = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 	= cmtjq.extend( {}, cmtjq.fn.cmtGrid.defaults, options );
		var grids		= this;

		// Iterate and initialise all the grids
		grids.each( function() {

			var grid = cmtjq( this );

			init( grid );
		});

		// return control
		return;

		// == Private Functions == //

		function init( grid ) {

			// Sorting
			grid.find( '.grid-sort select' ).change( function() {

				var pageUrl		= window.location.href;
				var selected 	= jQuery( this ).val();
				var sortOrder	= jQuery( this ).find( ':selected' ).attr( 'data-sort' );

				// Clear Sort
				if( selected === 'select' ) {

					pageUrl = cmt.utils.data.removeParam( pageUrl, 'sort' );
				}
				// Apply Sort
				else {

					pageUrl = cmt.utils.data.updateUrlParam( pageUrl, 'sort', sortOrder );
				}

				window.location	= pageUrl;
			});

			// Filters
			grid.find( '.grid-filters select' ).change( function() {

				var pageUrl		= window.location.href;
				var selected	= jQuery( this ).val();

				var option	= jQuery( this ).find( ':selected' );
				var column	= option.attr( 'data-col' );
				var cols	= jQuery( this ).closest( '.grid-filters' ).attr( 'data-cols' );
				cols		= cols.split( ',' );

				// Clear Filter
				for( i = 0; i < cols.length; i++ ) {

					pageUrl = cmt.utils.data.removeParam( pageUrl, cols[ i ] );
				}

				// Apply Filter
				if( selected !== 'select' ) {

					pageUrl = cmt.utils.data.updateUrlParam( pageUrl, column, selected );
				}

				window.location	= pageUrl;
			});

			// Reporting
			grid.find( '.trigger-report-toggle' ).click( function() {

				grid.find( '.grid-report-wrap' ).fadeToggle( 'slow' );

				jQuery( this ).toggleClass( 'active' );
			});

			// Import
			grid.find( '.trigger-import-toggle' ).click( function() {

				grid.find( '.grid-import-wrap' ).fadeToggle( 'slow' );

				jQuery( this ).toggleClass( 'active' );
			});

			// Export
			grid.find( '.trigger-export-toggle' ).click( function() {

				grid.find( '.grid-export-wrap' ).fadeToggle( 'slow' );

				jQuery( this ).toggleClass( 'active' );
			});

			grid.find( '.trigger-report-generate' ).click( function() {

				var pageUrl	= window.location.href;
				var grid	= jQuery( this ).closest( '.grid-data' );
				var report	= grid.find( '.grid-report' );
				var fields	= report.find( '.report-field' );

				fields.each( function( index, element ) {

					var field = jQuery( this );

					pageUrl = cmt.utils.data.removeParam( pageUrl, field.attr( 'name' ) );

					if( field.val().length > 0 ) {

						pageUrl	= cmt.utils.data.updateUrlParam( pageUrl, field.attr( 'name' ), field.val() );
					}
				});

				pageUrl = cmt.utils.data.updateUrlParam( pageUrl, 'report', 1 );

				window.location	= pageUrl;
			});

			grid.find( '.trigger-report-clear' ).click( function() {

				var pageUrl	= window.location.href;
				var grid	= jQuery( this ).closest( '.grid-data' );
				var report	= grid.find( '.grid-report' );
				var fields	= report.find( '.report-field' );

				fields.each( function( index, element ) {

					var field = jQuery( this );

		    		field.val( '' );

		    		pageUrl = cmt.utils.data.removeParam( pageUrl, field.attr( 'name' ) );
				});

				pageUrl = cmt.utils.data.removeParam( pageUrl, 'report' );

				window.location	= pageUrl;
			});

			// Searching
			grid.find( '.grid-search-trigger' ).click( function() {

				var pageUrl		= window.location.href;
				var grid		= jQuery( this ).closest( '.grid-data' );
				var keywords	= grid.find( '.search-field input[name=keywords]' ).val();
				var column		= grid.find( '.search-field select' ).val();

				if( keywords.length == 0 || column === 'select' ) {

					pageUrl = cmt.utils.data.removeParam( pageUrl, 'keywords' );
					pageUrl = cmt.utils.data.removeParam( pageUrl, 'search' );
				}
				else {

					if( null != column ) {

						pageUrl	= cmt.utils.data.updateUrlParam( pageUrl, 'search', column );
					}

					pageUrl	= cmt.utils.data.updateUrlParam( pageUrl, 'keywords', keywords );
				}

				window.location	= pageUrl;
			});

			grid.find( '.grid-search-input' ).bind( 'blur keyup', function( e ) {

				if( e.type == 'blur' || e.keyCode == '13' ) {

					var pageUrl		= window.location.href;
					var keywords	= jQuery( this ).val();
					var column		= jQuery( this ).attr( 'column' );

					if( keywords.length == 0 ) {

						pageUrl = cmt.utils.data.removeParam( pageUrl, 'keywords' );
						pageUrl = cmt.utils.data.removeParam( pageUrl, 'search' );
					}
					else {

						if( null != column ) {

							pageUrl	= cmt.utils.data.updateUrlParam( pageUrl, 'search', column );
						}

						pageUrl	= cmt.utils.data.updateUrlParam( pageUrl, 'keywords', keywords );
					}

					window.location	= pageUrl;
				}
			});

			// Bulk Actions
			grid.find( '.grid-bulk-all' ).change( function() {

				if( jQuery( this ).is( ':checked' ) ) {

 					grid.find( '.grid-bulk-single' ).prop( 'checked', true );
 				}
 				else {

 					grid.find( '.grid-bulk-single' ).prop( 'checked', false );
 				}
			});

			grid.find( '.grid-bulk-single' ).change( function() {

				var element 	= jQuery( this );
				var id 			= element.attr( 'data-id' );
				var selector	= '.grid-bulk-single[data-id=' + id + ']';

				if( jQuery( this ).is( ':checked' ) ) {

 					grid.find( selector ).prop( 'checked', true );
 				}
 				else {

					grid.find( selector ).prop( 'checked', false );
 					grid.find( '.grid-bulk-all' ).prop( 'checked', false );
 				}
			});

			grid.find( '.grid-bulk select' ).change( function() {

				var option		= jQuery( this ).find( ':selected' );
				var column		= option.attr( 'data-col' );
				var popup		= jQuery( this ).attr( 'popup' );
				var ids			= [];
				var selected	= grid.find( '.grid-bulk-single:checked' );

				if( jQuery( this ).val() !== 'select' ) {

					if( selected.length > 0 ) {

						jQuery( '#' + popup ).find( '.action' ).html( jQuery( this ).find( ':selected' ).text() );

						grid.find( '.grid-bulk-single:checked' ).each( function( index, element ) {

							var id = jQuery( this ).attr( 'data-id' );

							if( jQuery.inArray( id, ids ) < 0 ) {

								ids.push(  id );
							}
						});

						jQuery( '#' + popup ).find( 'input[name=action]' ).val( jQuery( this ).val() );
						jQuery( '#' + popup ).find( 'input[name=column]' ).val( column );
						jQuery( '#' + popup ).find( 'input[name=target]' ).val( ids.join( ',' ) );

						showPopup( '#' + popup );
					}
					else {

						alert( 'Please select at least one row to apply this action.' );
					}
				}
			});

			// Limit
			grid.find( '.wrap-limits select' ).change( function() {

				var pageUrl	= window.location.href;
				var value	= jQuery( this ).val();

				if( value === 'select' ) {

					pageUrl = cmt.utils.data.removeParam( pageUrl, settings.pageParam );
					pageUrl = cmt.utils.data.removeParam( pageUrl, settings.pageLimitParam );
				}
				else {

					pageUrl	= cmt.utils.data.updateUrlParam( pageUrl, settings.pageParam, 1 );
					pageUrl	= cmt.utils.data.updateUrlParam( pageUrl, settings.pageLimitParam, value );
				}

				window.location	= pageUrl;
			});

			// Layout Switch
			grid.find( '.trigger-layout-switch' ).click( function() {

				var trigger = jQuery( this );
				var layout	= trigger.attr( 'layout' );
				var pageUrl	= window.location.href;

				switch( layout ) {

					case 'data': {

						pageUrl	= cmt.utils.data.updateUrlParam( pageUrl, settings.layoutParam, 'data' );

						break;
					}
					case 'table': {

						pageUrl	= cmt.utils.data.updateUrlParam( pageUrl, settings.layoutParam, 'table' );

						break;
					}
					case 'list': {

						pageUrl	= cmt.utils.data.updateUrlParam( pageUrl, settings.layoutParam, 'list' );

						break;
					}
					case 'card': {

						pageUrl	= cmt.utils.data.updateUrlParam( pageUrl, settings.layoutParam, 'card' );

						break;
					}
				}

				window.location	= pageUrl;
			});

			// Popup - Generic Action
			grid.find( '.actions .action-generic' ).click( function() {

				var target	= parseInt( jQuery( this ).attr( 'target' ) );
				var popup	= jQuery( this ).attr( 'popup' );

				if( target > 0 ) {

					var pop		= jQuery( '#' + popup );
					var form	= pop.find( 'form' );
					var gen		= jQuery( this ).is( '[generic]' );
					var act		= jQuery( this ).attr( 'action' );
					var req		= act.replace( /\s+/g, '-' ).toLowerCase();
					var action 	= gen ? form.attr( 'data-action' ) + target : form.attr( 'data-action' ) + '/' + req + '?id=' + target;

					form.attr( 'action', action );
					form.find( '.action-generic' ).html( act );
					form.find( '.element-generic' ).val( act );
					form.find( '.element-action' ).val( req );

					showPopup( '#' + popup );
				}
				else {

					alert( 'Please select valid row.' );
				}
			});

			// Popup - Specific Add Action
			grid.find( '.grid-title .action-add' ).click( function() {

				var popup = jQuery( this ).attr( 'popup' );

				showPopup( '#' + popup );
			});

			// Popup - Specific Action
			grid.find( '.actions .action-pop' ).click( function() {

				var target	= parseInt( jQuery( this ).attr( 'target' ) );
				var popup	= jQuery( this ).attr( 'popup' );

				if( target > 0 ) {

					var pop		= jQuery( '#' + popup );
					var action 	= pop.find( 'form' ).attr( 'action' );

					action = cmt.utils.data.updateUriParam( action, 'id', target );

					pop.find( 'form' ).attr( 'action', action );

					showPopup( '#' + popup );
				}
				else {

					alert( 'Please select valid row.' );
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtGrid.defaults = {
		// default config
		cardIcon: 'cmti cmti-grid',
		listIcon: 'cmti cmti-list',
		pageParam: 'page',
		pageLimitParam: 'per-page',
		layoutParam: 'layout'
	};

})( jQuery );


/**
 * Perspective Header plugin can be used to change header styling by adding header-small class on scolling a pre-defined amount.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtHeader = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtHeader.defaults, options );
		var screenWidth		= window.innerWidth;
		var headers			= this;

		// Iterate and initialise all the page modules
		headers.each( function() {

			var header	= cmtjq( this );

			init( header );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Header
		function init( header ) {

			if( screenWidth > settings.minWidth ) {

			    window.addEventListener( 'scroll', function( e ) {

			        var distanceY		= window.pageYOffset || document.documentElement.scrollTop;
			        var scrollDistance 	= settings.scrollDistance;

			        if ( distanceY > scrollDistance ) {

			            header.addClass( "header-small" );

			            if( header.hasClass( "hidden" ) ) {

			            	header.slideDown( 'slow' );
			            }
			        }
			        else {

			            if ( header.hasClass( "header-small" ) && !header.hasClass( "header-small-ignore" ) ) {

			                header.removeClass( "header-small" );
			            }

			            if( header.hasClass( "hidden" ) ) {

			            	header.slideUp( 'false' );
			            }
			        }
			    });
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtHeader.defaults = {
		minWidth: 1024,
		scrollDistance: 300
	};

})( jQuery );


/**
 * Icon Picker is jQuery plugin to pick an icon from various icon libraries. It works together with
 * Icon Picker Plugin of CMSGears.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtIconPicker = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtIconPicker.defaults, options );
		var pickers			= this;

		// Iterate and initialise all the pickers
		pickers.each( function() {

			var picker = cmtjq( this );

			init( picker );
		});

		// return control
		return;

		// == Private Functions == //

		function init( picker ) {

			picker.find( '.choose-icon' ).click( function() {

				var element = jQuery( this );

				if( !element.hasClass( 'disabled' ) ) {

					picker.find( '.picker-icon-sets' ).slideToggle( 'slow' );
				}
			});

			picker.find( '.picker-icon-sets .picker-icon-wrap' ).click( function() {

				var element 	= jQuery( this );
				var iconSets	= picker.find( '.picker-icon-sets' );
				var sIcon		= element.find( '.picker-icon' );
				var iconClass	= 'picker-icon ' + sIcon.attr( 'icon' );
				var tIcon		= picker.find( '.choose-icon' );
				tIcon			= tIcon.find( '.picker-icon' );

				tIcon.attr( 'class', iconClass );

				picker.find( '.icon-field' ).val( sIcon.attr( 'icon' ) );

				iconSets.slideToggle( 'slow' );
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtIconPicker.defaults = {
		// default config
	};

})( jQuery );


/**
 * LatLongPicker allows us to set marker based on given longitude, latidude.
 * It also find the latitude/longitude for given address and set marker accordingly.
 */

( function( cmtjq ) {

	cmtjq.fn.latLongPicker = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings	= cmtjq.extend( {}, cmtjq.fn.latLongPicker.defaults, options );
		var maps		= this;

		// Iterate and initialise all the page blocks
		maps.each( function() {

			var mapPicker = cmtjq( this );

			init( mapPicker );
		});

		// return control
		return;

		// == Private Functions == //

		function init( mapPicker ) {

			// Initialise Google Map
			if( window.google ) {

				var gMap = initMapPicker( mapPicker );
			}
		}

		function initMapPicker( mapPicker ) {

			var mapOptions 	= cmtjq.extend( true, {}, settings.mapOptions );
			var element 	= mapPicker.find( '.google-map' ).get( 0 );
			var latitude 	= mapPicker.find( '.latitude' );
			var longitude 	= mapPicker.find( '.longitude' );
			var zoom 		= mapPicker.find( '.zoom' );

			// Found fields
			if( latitude.length > 0 && longitude.length > 0 ) {

				latitude	= parseFloat( latitude.val() );
				longitude	= parseFloat( longitude.val() );
				zoom		= parseInt( zoom.val() );

				if( !cmtjq.isNumeric( latitude ) && !cmtjq.isNumeric( longitude ) ) {

					latitude	= settings.latitude;
					longitude	= settings.longitude;

					mapPicker.find( '.latitude' ).val( latitude );
					mapPicker.find( '.longitude' ).val( longitude );
				}

				// Update Zoom Level
				if( cmtjq.isNumeric( zoom ) ) {

					mapOptions.zoom = zoom;
				}
			}

			// Default map type
			if( null == mapOptions.mapTypeId ) {

				mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
			}

			mapOptions.center = new google.maps.LatLng( latitude, longitude );

			var gMap	= new google.maps.Map( element, mapOptions );
			var marker	= initMarker( mapPicker, gMap, mapOptions );

			// search locations using geocoder
			if( settings.geocoder ) {

				var geocoder = new google.maps.Geocoder();

				mapPicker.find( '.search-box' ).change( function() {

					var address	= cmtjq( this ).val();

					geocoder.geocode( { 'address': address }, function( results, status ) {

						if( status == google.maps.GeocoderStatus.OK ) {

							var location	= results[ 0 ].geometry.location;

							updateCenter( mapPicker, gMap, location, marker );
						}
					});
				});
			}

			// search locations using places for text
			if( settings.places ) {

				var placeService = new google.maps.places.PlacesService( gMap );

				mapPicker.find( '.search-box' ).change( function() {

					var address	= cmtjq( this ).val();
					var request = { query: address };

					placeService.textSearch( request, function( results, status ) {

						if( status == google.maps.places.PlacesServiceStatus.OK ) {

							var location = results[ 0 ].geometry.location;

							updateCenter( mapPicker, gMap, location, marker );
						}
					});
				});
			}

			mapPicker.find( '.search-ll' ).change( function() {

				var latLon		= cmtjq( this ).val();
				latLon			= latLon.split( ',' );
				var lat			= parseFloat( latLon[ 0 ] );
				var lon			= parseFloat( latLon[ 1 ] );
				var position 	= {lat: lat, lng: lon};

				updateCenter( mapPicker, gMap, position, marker );
			});

			return gMap;
		}

		function initMarker( mapPicker, gMap, mapOptions ) {

			var marker = new google.maps.Marker({
				position: mapOptions.center,
				map: gMap,
				title: settings.markerTitle,
				draggable: true
			});

			google.maps.event.addListener( marker, 'dragend', function( evt ) {

				updatePosition( mapPicker, gMap, marker.position );
			});

			google.maps.event.addListener( gMap, 'dblclick', function( evt ) {

				updatePositionWithMarker( mapPicker, gMap, evt.latLng, marker );
			});

			google.maps.event.addListener( gMap, 'click', function( evt ) {

				updatePositionWithMarker( mapPicker, gMap, evt.latLng, marker );
			});

			google.maps.event.addListener( gMap, 'zoom_changed', function() {

				resetZoom( mapPicker, gMap );
			});

			return marker;
		}

		function updatePosition( mapPicker, gMap, position ) {

			mapPicker.find( '.latitude' ).val( position.lat );
			mapPicker.find( '.longitude' ).val( position.lng );

			resetZoom( mapPicker, gMap );
		}

		function updatePositionWithMarker( mapPicker, gMap, position, marker ) {

			updatePosition( mapPicker, gMap, position );

			marker.setPosition( position );
		}

		function resetZoom( mapPicker, gMap ) {

			mapPicker.find( '.zoom' ).val( gMap.getZoom() );
		}

		function updateCenter( mapPicker, gMap, position, marker ) {

			updatePosition( mapPicker, gMap, position );

			gMap.setCenter( position );
			marker.setPosition( position );
		}
	};

	// Default Settings
	cmtjq.fn.latLongPicker.defaults = {
		map: null,
		latitude: 0,
		longitude: 0,
		markerTitle: 'My Location',
		geocoder: false,
		places: true,
		mapOptions : {
	    	zoom: 3,
	    	mapTypeId: null,
	    	mapTypeControl: false,
			zoomControlOptions: true,
			disableDoubleClickZoom: true
		}
	};

})( jQuery );


/**
 * Login & Register can be used to toggle between login, register and forgot-password forms.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtLoginRegister = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtLoginRegister.defaults, options );
		var boxes			= this;

		// Iterate and initialise all the pickers
		boxes.each( function() {

			var box = cmtjq( this );

			init( box );
		});

		// return control
		return;

		// == Private Functions == //

		function init( box ) {

			var loginBox	= box.find( '.box-login' );
			var signupBox	= box.find( '.box-signup' );
			var forgotBox	= box.find( '.box-forgot' );

			box.find( '.btn-login' ).click( function( event ) {

				event.preventDefault();

				if( loginBox.is( ':visible' ) ) {

					loginBox.slideUp( 'fast' );
				}
				else {
					signupBox.slideUp( 'fast' );
					forgotBox.slideUp( 'fast' );

					loginBox.slideDown( 'slow' );
				}
			});

			box.find( '.btn-forgot' ).click( function( event ) {

				event.preventDefault();

				if( forgotBox.is( ':visible' ) ) {

					forgotBox.slideUp( 'fast' );
				}
				else {

					signupBox.slideUp( 'fast' );
					loginBox.slideUp( 'fast' );

					forgotBox.slideDown( 'slow' );
				}
			});

			box.find( '.btn-signup' ).click( function( event ) {

				event.preventDefault();

				if( signupBox.is( ':visible' ) ) {

					signupBox.slideUp( 'fast' );
				}
				else {
					loginBox.slideUp( 'fast' );
					forgotBox.slideUp( 'fast' );

					signupBox.slideDown( 'slow' );
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtLoginRegister.defaults = {
		// default config
	};

})( jQuery );


/**
 * Collapsible Menu plugin used to manage collapsible parent with our without children.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtCollapsibleMenu = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 	= cmtjq.extend( {}, cmtjq.fn.cmtCollapsibleMenu.defaults, options );
		var menus		= this;

		// Iterate and initialise all the menus
		menus.each( function() {

			var menu = cmtjq( this );

			init( menu );
		});

		// return control
		return;

		// == Private Functions == //

		function init( menu ) {

			menu.find( '.collapsible-tab.has-children' ).click( function() {

				var tab		= jQuery( this );
				var content = tab.children( '.tab-content' );

				// Expand only disabled tabs and keep active expanded
				if( !tab.hasClass( 'active' ) ) {

					if( !tab.hasClass( 'expanded' ) ) {

						// Slide Down Slowly
						tab.addClass( 'expanded' );
						content.slideDown( 'slow' );
					}
					else {

						// Slide Up Slowly
						tab.removeClass( 'expanded' );
						content.slideUp( 'slow' );
					}
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtCollapsibleMenu.defaults = {
		// options
	};

})( jQuery );


/**
 * Sliding Menu is a special pop-up displayed on clicking the element defined while initialising the plugin.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtSlidingMenu = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtSlidingMenu.defaults, options );
		var menus			= this;

		// Iterate and initialise all the menus
		menus.each( function() {

			var menu = cmtjq( this );

			init( menu );
		});

		// return control
		return;

		// == Private Functions == //

		function init( menu ) {

			if( settings.mainMenu ) {

				var documentHeight 	= cmtjq( document ).height();
				var screenWidth		= cmtjq( window ).width();

				// Parent to cover document
				menu.css( { 'top': '0px', 'left': '0px', 'height': documentHeight, 'width': screenWidth } );
			}

			if( null != settings.showTrigger ) {

				cmtjq( settings.showTrigger ).click( function() {

					menu.fadeIn();

					var slider	= menu.find( '.vnav-slider' );

					if( settings.position == 'left' ) {

						slider.animate( { left: 0 } );
					}
					else if( settings.position == 'right' ) {

						slider.animate( { right: 0 } );
					}
				});
			}

			if( null != settings.hideTrigger ) {

				cmtjq( settings.hideTrigger ).click( function() {

					menu.fadeOut();

					var slider	= menu.find( '.vnav-slider' );

					if( settings.position == 'left' ) {

						slider.animate( { left: -( slider.width() ) } );
					}
					else if( settings.position == 'right' ) {

						slider.animate( { right: -( slider.width() ) } );
					}
				});
			}

			menu.find( '.btn-close' ).click( function() {

				menu.fadeOut();

				var slider	= menu.find( '.vnav-slider' );

				if( settings.position == 'left' ) {

					slider.animate( { left: -( slider.width() ) } );
				}
				else if( settings.position == 'right' ) {

					slider.animate( { right: -( slider.width() ) } );
				}
			});

			// Filler Layer to listen for close
			var bkgFiller	= menu.find( ".popup-bkg-filler" );

			if( bkgFiller.length > 0 ) {

				bkgFiller.css( { 'top': '0px', 'left': '0px', 'height': documentHeight, 'width': screenWidth } );

				bkgFiller.click( function() {

					menu.fadeOut( "fast" );
				});
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtSlidingMenu.defaults = {
		position: 'left',
		showTrigger: null,
		hideTrigger: null,
		mainMenu: false
	};

})( jQuery );


/**
 * The Popout Group plugin can be used to show popouts using popout trigger.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtPopoutGroup = function( options ) {

		// == Init == //

		// Configure Popups
		var settings	= cmtjq.extend( {}, cmtjq.fn.cmtPopoutGroup.defaults, options );
		var elements	= this;

		// Iterate and initialise all the popups
		elements.each( function() {

			var element	= cmtjq( this );

			init( element );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Element
		function init( popoutGroup ) {

			var trigger	= popoutGroup.find( '.popout-trigger' );

			trigger.click( function() {

				trigger.removeClass( 'active' );

				jQuery( this ).addClass( 'active' );

				var popoutId = "#" + jQuery( this ).attr( 'popout' );
				
				var targetPopout = jQuery( popoutId );

				if( targetPopout.is( ':visible' ) ) {

					jQuery( this ).removeClass( 'active' );

					switch( settings.animation ) {

						case "down": {

							targetPopout.slideUp();

							break;
						}
					}
				}
				else {

					popoutGroup.find( '.popout' ).hide();

					switch( settings.animation ) {

						case "down": {

							targetPopout.slideDown();

							break;
						}
					}
				}

				targetPopout.find( '.popout-close' ).click( function() {
					
					var popId = targetPopout.attr( 'popout' );

					popoutGroup.find( '.popout-trigger[popout=' + popId + ']' ).removeClass( 'active' );

					switch( settings.animation ) {

						case "down": {

							targetPopout.slideUp();

							break;
						}
					}
				});
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtPopoutGroup.defaults = {
		animation: "down"
	};

})( jQuery );


/**
 * The Pop-up plugin can be used to show pop-ups. Most common usage is modal dialogs.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtPopup = function( options ) {

		// == Init == //

		// Configure Popups
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtPopup.defaults, options );
		var elements		= this;
		var documentHeight 	= cmtjq( document ).height();
		var screenHeight	= cmtjq( window ).height();
		var screenWidth		= cmtjq( window ).width();

		// Iterate and initialise all the popups
		elements.each( function() {

			var element	= cmtjq( this );

			init( element );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Element
		function init( popup ) {

			var popupData = popup.children( '.popup-data' );

			var popupTop = 0;

			if( cmt.utils.data.hasAttribute( popup, 'data-top' )) {

				popupTop = popup.attr( 'data-top' );
			}

			// Close Listener
			popupData.children( '.popup-close' ).click( function() {

				closePopup( popup );
			});

			// Modal Window
			if( settings.modal ) {

				// Move modal popups to body element
				popup.appendTo( 'body' );

				// Background
				var bkg = popup.find( '.popup-screen' );

				// Filler Layer to listen for close
				var bkgFiller = popup.find( '.popup-screen-listener' );

				if( !popup.hasClass( 'popup-modal' ) ) {

					// Parent to cover document
					popup.css( { 'top': '0px', 'left': '0px', 'height': documentHeight, 'width': screenWidth } );

					if( bkg.length > 0 ) {

						bkg.css( { 'top': '0px', 'left': '0px', 'height': screenHeight, 'width': screenWidth } );
					}

					if( bkgFiller.length > 0 ) {

						bkgFiller.css( { 'top': '0px', 'left': '0px', 'height': screenHeight, 'width': screenWidth } );
					}
				}

				if( bkgFiller.length > 0 ) {

					bkgFiller.click( function() {

						closePopup( popup );
					});
				}

				// Child at center of parent
				popup.show(); // Need some better solution if it shows flicker effect

				var popupDataHeight	=  popupData.outerHeight();
				var popupDataWidth	=  popupData.outerWidth();

				popup.hide();

				if( popupDataHeight <= screenHeight ) {

					popupData.css( { 'top': ( screenHeight/2 - popupDataHeight/2 ) } );
				}
				else {

					popupData.css( { 'top': 10 } );
				}

				if( popupDataWidth <= screenWidth ) {

					popupData.css( { 'left': ( screenWidth/2 - popupDataWidth/2 ) } );
				}
				else {

					popupData.css( { 'left': 10, 'width': screenWidth - 20 } );
				}

				if( parseInt( popupTop ) > 0 ) {

					popupData.css( { 'top': popupTop } );
				}
			}
		}

		function closePopup( popup ) {

			popup.fadeOut( 'slow' );

			if( settings.modal ) {

				jQuery( 'body' ).css( { 'overflow': '', 'height': '', 'margin-right': '' } );
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtPopup.defaults = {
		modal: true
	};

	// Utility method to set value
	cmtjq.fn.cmtPopup.reposition = function( popup ) {

		var screenHeight	= cmtjq( window ).height();
		var screenWidth		= cmtjq( window ).width();

		var popupData		= popup.children( '.popup-data' );
		var popupContent	= popupData.children( '.popup-content-wrap' );
		var contentScroller	= cmt.utils.data.hasAttribute( popup, 'data-csroller' );

		var popupDataHeight	= popupData.outerHeight();
		var popupDataWidth	= popupData.outerWidth();

		var popupTop = 0;

		if( cmt.utils.data.hasAttribute( popup, 'data-top' ) ) {

			popupTop = popup.attr( 'data-top' );
		}

		if( popupDataHeight <= screenHeight ) {

			popupData.css( { 'top': ( screenHeight/2 - popupDataHeight/2 ) + 'px' } );
		}
		else {

			popupData.css( { 'top': 10 + 'px', 'height': ( screenHeight - 20 ) + 'px' } );
		}

		if( popupDataWidth <= screenWidth ) {

			popupData.css( { 'left': ( screenWidth/2 - popupDataWidth/2 ) + 'px' } );
		}
		else {

			popupData.css( { 'left': 10 + 'px', 'width': ( screenWidth - 20 ) + 'px' } );
		}

		if( parseInt( popupTop ) > 0 ) {

			if( popupDataHeight <= ( screenHeight - popupTop ) ) {

				popupData.css( { 'top': popupTop + 'px' } );
			}
			else {

				popupData.css( { 'top': popupTop + 'px', 'height': ( screenHeight - popupTop - 10 ) + 'px' } );
			}
		}

		popupDataHeight	= popupData.outerHeight();

		var popupContentHeight = popupContent.outerHeight();

		if( popupContentHeight > popupDataHeight ) {

			popupContent.css( { 'height': ( popupDataHeight - 20 ) + 'px' } );

			if( contentScroller ) {

				popupContent.addClass( popup.attr( 'data-csroller' ) );
			}
		}
	};

})( jQuery );

// Pre-defined methods to show/hide popups

function showPopup( popupSelector ) {

	var popup = jQuery( popupSelector );

	if( popup.hasClass( 'popup-modal' ) ) {

		//jQuery( 'body' ).css( { 'overflow': 'hidden', 'height': jQuery( window ).height() } );
	}

	popup.fadeIn( 'slow' );

	if( popup.hasClass( 'popup-modal' ) ) {

		jQuery.fn.cmtPopup.reposition( popup );
	}
}

function closePopup( popupSelector ) {

	var popup = jQuery( popupSelector );

	if( popup.hasClass( 'popup-modal' ) ) {

		//jQuery( 'body' ).css( { 'overflow': '', 'height': '', 'margin-right': '' } );
	}

	jQuery( popupSelector ).fadeOut( 'fast' );
}

/* Show default error popup */
function showErrorPopup( errors ) {

	jQuery( '#popup-error .popup-content' ).html( errors );

	showPopup( '#popup-error' );
}

function hideErrorPopup() {

	closePopup( '#popup-error' );
}

/* Show default message popup */
function showMessagePopup( message ) {

	jQuery( '#popup-message .popup-content' ).html( message );

	showPopup( '#popup-message' );
}

function hideMessagePopup() {

	closePopup( '#popup-message' );
}


( function( cmtjq ) {

    var rateMethods = {
        init: function( options ) {

			// Configure Plugin
			var settings	= cmtjq.extend( {}, cmtjq.fn.cmtRate.defaults, options );
			var ratings		= this;

			// Iterate and initialise all the ratings
			ratings.each( function() {

				var rating = cmtjq( this );

				// Preserve Element Settings
				rating.data( 'cmtRateSettings', settings );

				// Initialise the Element
				bootsrap( rating );
			});

			// return control
			return;
        },
        reset: function() {

			resetRating( this );
		}
    };

    cmtjq.fn.cmtRate = function( args ) {
		
		// Method exist - Removes first argument and pass remaining arguments to method
        if( rateMethods[ args ] ) {

            return rateMethods[ args ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
        }
		// Options Object passed or empty
		else if ( typeof args === 'object' || !args ) {

            return rateMethods.init.apply( this, arguments );
        }
		// Log Error
		else {

            cmtjq.error( 'Method ' +  args + ' does not exist in CmtRate Plugin.' );
        }
    };

	function bootsrap( rating ) {

		var total 		= rating.find( '.star' ).length;
		var stars		= [];
		var icons		= [];
		var messages	= [];
		var selected 	= ( rating.find( '.star.selected' ).length == 1 ) ? parseInt( rating.find( '.star.selected' ).attr( 'star' ) ) : 0;
		var disabled	= rating.hasClass( 'disabled' );
		var readOnly	= rating.hasClass( 'read-only' );
		var settings	= rating.data( 'cmtRateSettings' );

		// Init Icons
		rating.find( '.star' ).each( function() {

			var star 	= cmtjq( this );
			var index 	= parseInt( star.attr( 'star' ) );

			if( selected > 0 && selected >= index ) {

				star.html( '<i class="' + getStarClass( rating, index, true ) + '"></i>' );
				star.css( 'color', settings.filledColor );
			}
			else if( selected === index && settings.message ) {

				message.addClass( 'selected' );
			}
			else {

				star.html( '<i class="' + getStarClass( rating, index, false ) + '"></i>' );
				star.css( 'color', settings.emptyColor );
			}

			// Disabled - Change color
			if( disabled ) {

				if( selected > 0 && selected >= index ) {

					star.css( 'color', settings.disabledColor );
				}
			}
			// Read Only - Change color
			else if( readOnly ) {

				if( selected > 0 && selected >= index ) {

					star.css( 'color', settings.readonlyColor );
				}
			}
			// Enabled - Prepare cache
			else {

				stars.push( star );
				icons.push( star.children( 'i' ) );

				if( settings.message ) {

					messages.push( rating.find( 'span[star-message=' + index + ']' ) );
				}
			}
		});

		if( !disabled && !readOnly ) {

			// Hover effect
			rating.find( '.star' ).mouseover( function() {

				var index = parseInt( cmtjq( this ).attr( 'star' ) );

				refresh( rating, total, index, stars, icons, messages, 0 );
			});

			rating.find( '.star' ).mouseout( function() {

				refresh( rating, total, selected, stars, icons, messages, 1 );
			});

			// Rate
			rating.find( '.star' ).click( function() {

				var index 	= parseInt( cmtjq( this ).attr( 'star' ) );
				selected	= index;

				rating.find( 'input' ).val( jQuery( this ).attr( 'star' ) );
				rating.find( '.star' ).removeClass( 'selected' );
				cmtjq( this ).addClass( 'selected' );

				refresh( rating, total, index, stars, icons, messages, 2 );
			});
		}
	}
	
	function getStarClass( rating, index, filled ) {
		
		var settings = rating.data( 'cmtRateSettings' );

		if( typeof( filled ) === 'undefined' ) filled = false;
		
		index = index - 1;

		if( settings.same.length > 0 ) {

			if( settings.same.length == 1 ) {
				
				return settings.same[ 0 ];
			}
			else {
				
				return settings.same[ index ];
			}
		}
		else {

			if( filled ) {

				if( settings.filled.length == 1 ) {

					return settings.filled[ 0 ];
				}
				else {

					return settings.filled[ index ];
				}
			}
			else {

				if( settings.empty.length == 1 ) {

					return settings.empty[ 0 ];
				}
				else {

					return settings.empty[ index ];
				}
			}
		}
	}

	function refresh( rating, total, index, stars, icons, messages, choice ) {
		
		var settings = rating.data( 'cmtRateSettings' );

		if( settings.message ) {

			rating.find( '.star-message' ).removeClass( 'selected' );
		}

		for( var i = 1; i <= total; i++ ) {

			var star 	= stars[ i - 1 ];
			var icon 	= icons[ i - 1 ];
			var message = messages[ i - 1 ];

			if( i <= index ) {

				switch( choice ) {

					case 0: {

						star.css( 'color', settings.hoverColor );

						break;
					}
					case 1:
					case 2: {

						star.css( 'color', settings.filledColor );

						break;
					}
				}

				icon.removeClass( getStarClass( rating, i, false ) );
				icon.addClass( getStarClass( rating, i, true ) );

				if( i == index && settings.message ) {

					message.addClass( 'selected' );
				}
			}
			else {

				star.css( 'color', settings.emptyColor );

				icon.removeClass( getStarClass( rating, i, true ) );
				icon.addClass( getStarClass( rating, i, false ) );
			}
		}
	}

	function resetRating( rating ) {
		
		var settings = rating.data( 'cmtRateSettings' );

		rating.find( '.star i' ).each( function( index, value ) {
			
			var icon = jQuery( this );

			icon.removeClass( getStarClass( rating, index + 1, true ) );
			icon.addClass( getStarClass( rating, index + 1, false ) );
		});

		rating.find( '.star' ).css( 'color', settings.emptyColor );
		rating.find( '.star-selected' ).val( 0 );
		rating.find( '.star-message' ).removeClass( 'selected' );
	}

	// Default Settings
	cmtjq.fn.cmtRate.defaults = {
		// Rating Icons
		same: [], // Use it if empty and filled are same
		empty: [ 'far fa-star' ],
		filled: [ 'fas fa-star' ],
		// Rating Colors
		emptyColor: 'black',
		filledColor: '#A5D75A',
		hoverColor: '#EF9300',
		disabledColor: '#7F7F7F',
		readonlyColor: '#A5D75A',
		message: true
	};

})( jQuery );


/**
 * It's a custom select plugin used to wrap original select using overlapping html elements and hiding the select element.
 */

( function( cmtjq ) {

// TODO: Add option for multi select

	cmtjq.fn.cmtSelect = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtSelect.defaults, options );
		var dropDowns		= this;

		// Iterate and initialise all the fox sliders
		dropDowns.each( function() {

			var dropDown = cmtjq( this );

			init( dropDown );
		});

		// return control
		return;

		// == Private Functions == //

		/**
		 * 1. Find the selected option if there is any.
		 * 2. Wrap the select in a div and access the wrapper div.
		 * 3. If copyId config is set, the select id attribute will be moved to wrapper div.
		 * 4. The class .select-wrap will be assigned to wrapper div.
		 * 5. If wrapperClass config is set, these additional classes will be assigned to wrapper div.
		 * 6. The icon span having class s-icon will be created. If iconClass and iconHtml are set, the icon span will be assigned these classes and html.
		 * 7. The custom select div will be created having class .select and child div element having class .selected.
		 * 8. The span having class s-text will be appended to .selected div. The span s-icon will follow s-text.
		 * 9. A ul having class .select-list will be appended to .select.
		 * 10. The select options will be iterated and li elements will be formed and appended to select-list.
		 * 11. The custom select i.e. select will be appended to wrapper div i.e. select-wrap.
		 * 12. The select-list will be hidden by default.
		 * 13. If select is disabled, disabled class will be assigned to custom select.
		 * 14. Toggle behaviour added to selected for select-list.
		 * 15. Click listener added to all the list elements to change select value and update s-text of selected.
		 * 16. Global listener added to hide select list if user click on other area.
		 */
		function init( dropDown ) {

			// Find Selected Option
			var selected = dropDown.children( 'option:selected' );

			// Wrap Select
			dropDown.wrap( '<div></div>' );

			var wrapper = dropDown.parent();

			if( settings.copyId ) {

				// Find select Id
				var selectId = dropDown.attr( 'id' );

				// Transfer Id to wrapper
				if( null != selectId && selectId.length > 0 ) {

					// Remove select Id
					dropDown.attr( 'id', null );

					// Move id to wrapper div
					wrapper.attr( 'id', selectId );
				}
			}

			// Assign class to wrapper
			wrapper.addClass( 'select-wrap' );

			if( null != settings.wrapperClass ) {

				wrapper.addClass( settings.wrapperClass );
			}

			// Generate Icon Html
			var iconHtml = '<span class="s-icon">';

			if( null != settings.iconClass ) {

				iconHtml = '<span class="s-icon ' + settings.iconClass + '">';
			}

			if( null != settings.iconHtml ) {

				iconHtml += settings.iconHtml + "</span>";
			}
			else {

				iconHtml += "</span>";
			}

			// Generate Custom Select Html
			var customHtml	= "<div class='select'><div class='selected'><span class='s-text'>" + selected.html() + "</span>" + iconHtml + "</div><ul class='select-list'>";

			if( settings.copyOptionClass ) {

				var selected = dropDown.find( ':selected' );

				if( selected.length == 1 ) {

					var classes = selected.attr( 'class' );

					customHtml	= "<div class='select'><div class='selected'><span class='s-text " + classes + "'>" + selected.html() + "</span>" + iconHtml + "</div><ul class='select-list'>";
				}
			}

			// Iterate select options
		    dropDown.find( 'option' ).each( function( index ) {

				if( settings.copyOptionClass ) {

					var classes = jQuery( this ).attr( 'class' );

					customHtml += '<li class="' + classes + '" data-value="' + jQuery( this ).val() + '">' + jQuery( this ).html() + '</li>';
				}
				else {

					customHtml += '<li data-value="' + jQuery( this ).val() + '">' + jQuery( this ).html() + '</li>';
				}
		    });

			customHtml += '</ul></div>';

			// Append Custom Select to wrapper
			wrapper.append( customHtml );

			var customSelect	= wrapper.children( '.select' );
			var customSelected	= wrapper.children( '.select' ).children( '.selected' );
			var customList		= wrapper.children( '.select' ).children( '.select-list' );

			// Hide List by default
			customList.hide();

			// Detect whether disabled
			var disabled = dropDown.attr( 'disabled' );

			if( disabled == 'disabled' || disabled ) {

				customSelected.addClass( 'disabled' );
			}
			else {

				// Add listener to selected val
				customSelected.click( function( e ) {

					var visible = customList.is( ':visible' );

					customList.hide();
					jQuery( document ).unbind( 'keyup' );

					if( !visible ) {

						customList.show();

						jQuery( document ).on( 'keyup', function( e ) {

							var character = String.fromCharCode( e.keyCode );

							customList.children( 'li' ).each( function() {

								var item = jQuery( this );

								if( item.html().substr( 0, 1 ).toUpperCase() == character ) {

									customList.animate( { scrollTop: item.offset().top - customList.offset().top + customList.scrollTop() } );

									return false;
							    }
							});
						});
					}

					e.stopPropagation();
				});

				// Update selected value
				customList.children( 'li' ).click( function() {

					var selected	= jQuery( this );
					var parent		= selected.parents().eq( 1 );

					parent.children( '.selected' ).children( '.s-text' ).html( selected.html() );
					parent.parent().children( 'select' ).val( selected.attr( 'data-value' ) ).change();

					customList.hide();
					jQuery( document ).unbind( 'keyup' );
				});

				cmtjq( document ).on( 'click', function( e ) {

			        if ( cmtjq( e.target ).closest( customList ).length === 0 ) {

			            customList.hide();
			            jQuery( document ).unbind( 'keyup' );
			        }
				});
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtSelect.defaults = {
		multi: false,
		copyId: false,
		copyOptionClass: false,
		wrapperClass: null,
		iconClass: null,
		iconHtml: null
	};

	// Utility method to reset the select after getting new values
	cmtjq.fn.cmtSelect.resetSelect = function( selectWrap, optionsHtml ) {

		var dropDown = selectWrap.find( 'select' );

		dropDown.html( optionsHtml );

		var selected	= dropDown.children( 'option:selected' );
	 	var list		= selectWrap.find( '.select-list' );
	 	var sText		= selectWrap.find( '.selected' ).children( '.s-text' );
		var listHtml	= '';

		dropDown.children( 'option' ).each( function( index ) {

			listHtml += '<li data-value="' + jQuery( this ).val() + '">' + jQuery( this ).html() + '</li>';
		});

		sText.html( selected.html() );
		list.html( listHtml );

		list.children( 'li' ).click( function() {

			var selected	= jQuery( this );
			var parent		= selected.parents().eq( 1 );

			sText.html( selected.html() );
			dropDown.val( selected.attr( 'data-value' ) ).change();

			list.hide();
			jQuery( document ).unbind( 'keyup' );
		});
	};

	// Utility method to set value
	cmtjq.fn.cmtSelect.setValue = function( selectWrap, value ) {

		var dropDown = selectWrap.find( 'select' );

		dropDown.val( value );

		var selected	= dropDown.children( 'option:selected' );
	 	var sText		= selectWrap.find( '.selected' ).children( '.s-text' );

		sText.html( selected.html() );
	};

})( jQuery );


/**
 * It's a custom select plugin used for multiselect options.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtMultiSelect = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 	= cmtjq.extend( {}, cmtjq.fn.cmtSelect.defaults, options );
		var dropDowns	= this;

		// Iterate and initialise all the fox sliders
		dropDowns.each( function() {

			var dropDown = cmtjq( this );

			init( dropDown );
		});

		// return control
		return;

		function init( dropDown ) {

			// Generate Icon Html
			var iconHtml = '<span class="s-icon">';

			if( null != settings.iconClass ) {

				iconHtml = '<span class="s-icon ' + settings.iconClass + '">';
			}

			if( null != settings.iconHtml ) {

				iconHtml += settings.iconHtml + "</span>";
			}
			else {

				iconHtml += "</span>";
			}

			// Generate Select Html
			var customHtml = '<div class="selected"><span class="s-text">' + dropDown.attr( 'title' ) + '</span>' + iconHtml + '</div>';

			// Prepend
			dropDown.prepend( customHtml );

			var selectList = dropDown.find( '.select-list' );

			// Hide List by default
			selectList.hide();

			// Detect whether disabled
			var disabled = dropDown.attr( 'disabled' );

			if( disabled == 'disabled' || disabled ) {

				dropDown.addClass( 'disabled' );
			}
			else {

				// Add listener to selected val
				dropDown.find( '.selected' ).click( function( e ) {

					if( !selectList.is( ':visible' ) ) {

						selectList.slideDown( 'slow' );

						jQuery( document ).on( 'keyup', function( e ) {

							var character = String.fromCharCode( e.keyCode );

							selectList.children( 'li' ).each( function() {

								var item = jQuery( this );

								if( item.html().substr( 0, 1 ).toUpperCase() == character ) {

									selectList.animate( { scrollTop: item.offset().top - selectList.offset().top + selectList.scrollTop() } );

									return false;
							    }
							});
						});
					}
					else {

						 selectList.slideUp();
					}

					e.stopPropagation();
				});

				cmtjq( document ).on( 'click', function( e ) {

			        if ( cmtjq( e.target ).closest( selectList ).length === 0 ) {

			            selectList.slideUp();

			            jQuery( document ).unbind( 'keyup' );
			        }
				});
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtSelect.defaults = {
		wrapperClass: null,
		iconClass: null,
		iconHtml: null
	};

})( jQuery );


/**
 * A simple slider(simplified version of FoxSlider arranged in filmstrip fashion) to slide
 * UI elements in circular fashion. We can use FoxSlider for more complex scenarios.
 */

( function( cmtjq ) {

	var component = null;

	var methods = {
		init: function( options ) {

			// Init Elements
			try {

				component.resetOptions( options );

				component.initSliders( this );
			}
			// Init Component and Elements
			catch( err ) {

				component = cmt.components.root.registerComponent( 'slider', 'cmt.components.base.SliderComponent', options );

				component.initSliders( this );
			}

			if( null != component ) {

				// Window resize
				cmtjq( window ).resize( function() {

					component.normaliseSliders();
				});
			}
		},
		// Returns the active slider
		getSlider: function() {

			var sliderKey = parseInt( jQuery( this[ 0 ] ).attr( 'data-idx' ) );

			return component.getSlider( sliderKey );
		},
		// Adds a new slide using the given HTML and re-arrange the slides
		addSlide: function( slideHtml ) {

			var sliderKey = parseInt( jQuery( this[ 0 ] ).attr( 'data-idx' ) );

			component.addSlide( sliderKey, slideHtml );
		},
		// Removes slide using the given key and re-arrange the slides
		removeSlide: function( slideKey ) {

			var sliderKey = parseInt( jQuery( this[ 0 ] ).attr( 'data-idx' ) );

			component.removeSlide( sliderKey, slideKey );
		},
		// Scroll slider to the given position in %
		scrollToPosition: function( position, animate ) {

			var sliderKey = parseInt( jQuery( this[ 0 ] ).attr( 'data-idx' ) );

			component.scrollToPosition( sliderKey, position, animate );
		},
		// Scroll slider to the given slide
		scrollToSlide: function( slideKey, animate ) {

			var sliderKey = parseInt( jQuery( this[ 0 ] ).attr( 'data-idx' ) );

			component.scrollToSlide( sliderKey, slideKey, animate );
		},
		// Scroll slider to the given position in %
		showPrevSlide: function() {

			var sliderKey = parseInt( jQuery( this[ 0 ] ).attr( 'data-idx' ) );

			component.showPrevSlide( sliderKey );
		},
		// Scroll slider to the given slide
		showNextSlide: function() {

			var sliderKey = parseInt( jQuery( this[ 0 ] ).attr( 'data-idx' ) );

			component.showNextSlide( sliderKey );
		}
	};

	cmtjq.fn.cmtSlider = function( param ) {

		// Call exclusive method
        if( methods[ param ] ) {

            return methods[ param ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
        }
		// Call init
		else if( typeof param === 'object' || ! param ) {

            return methods.init.apply( this, arguments );
        }
		// Log error
		else {

            cmtjq.error( 'CMT Slider - method ' +  param + ' does not exist.' );
        }

		// return control
		return;
	};

})( jQuery );


/**
 * Smooth Scroll plugin can be used to listen for hash tags to scroll smoothly to pre-defined page sections.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtSmoothScroll = function( options ) {

		// == Init == //

		// Configure Modules
		var settings	= cmtjq.extend( {}, cmtjq.fn.cmtSmoothScroll.defaults, options );
		var elements	= this;

		// Iterate and initialise all the page modules
		elements.each( function() {

			var element	= cmtjq( this );

			init( element );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Element
		function init( element ) {

			element.on( 'click', function ( e ) {

				var targetId = this.hash;

				// Process only if hash is set
				if ( null != targetId && targetId.length > 0 ) {

					// Prevent default anchor behavior
			    	e.preventDefault();

					// Update active
					element.closest( '.nav' ).find( '.smooth-scroll' ).removeClass( 'active' );
					element.addClass( 'active' );
					element.closest( '.nav' ).find( '.smooth-scroll' ).closest( '.smooth-scroll-wrap' ).removeClass( 'active' );
					element.closest( '.smooth-scroll-wrap' ).addClass( 'active' );

					var target		= jQuery( targetId );
					var topOffset	= 0;

					if( cmt.utils.data.hasAttribute( target, 'data-height-target' ) ) {

						topOffset = jQuery( target.attr( 'data-height-target' ) ).height();
					}
					else if( null != settings.heightElement ) {

						topOffset = settings.heightElement.height();
					}

					// Find target element
			    	var target = cmtjq( targetId );

			    	cmtjq( 'html, body' ).stop().animate(
			    		{ 'scrollTop': ( target.offset().top - topOffset ) },
			    		900,
			    		'swing',
			    		function () {

							// Add hash to url - It will ignore the topOffset and sets top position to 0
							if( settings.changeHash ) {

								window.location.hash = targetId;
							}
			    		}
			    	);
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtSmoothScroll.defaults = {
		changeHash: false,
		heightElement: null
	};

})( jQuery );


/**
 * Tabs plugin can be used to for tabs arrangement.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtTabs = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings	= cmtjq.extend( {}, cmtjq.fn.cmtTabs.defaults, options );
		var tabPanels	= this;

		// Iterate and initialise all the tabs
		tabPanels.each( function() {

			var tabPanel = cmtjq( this );

			init( tabPanel );
		});

		// return control
		return;

		// == Private Functions == //

		function init( tabPanel ) {

			var links	= tabPanel.find( '.tab-links-wrap' ).first().find( '.tab-link' );
			var tabs	= tabPanel.find( '.tab-content-wrap' ).first();
			var nested	= tabs.find( '.tab-content-wrap .tab-content' );

			tabs = tabs.find( '.tab-content' ).not( nested );

			tabs.hide();

			// Activate first
			jQuery( links[ 0 ] ).addClass( 'active' );
			jQuery( tabs[ 0 ] ).addClass( 'active' );
			jQuery( tabs[ 0 ] ).fadeIn( 'slow' );

			// Listen click
			links.click( function() {

				var target = jQuery( this ).attr( 'target' );

				// Deactivate
				links.removeClass( 'active' );
				tabs.removeClass( 'active' );
				tabs.hide();

				// Activate
				jQuery( this ).addClass( 'active' );
				jQuery( target ).addClass( 'active' );
				jQuery( target ).fadeIn( 'slow' );
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtTabs.defaults = {
		// default config
	};

})( jQuery );


/**
 * Time Picker plugin can be used to choose time.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtTimePicker = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 	= cmtjq.extend( {}, cmtjq.fn.cmtTimePicker.defaults, options );
		var pickers		= this;

		// Append singleton element at the end of body
		jQuery( 'body' ).append( '<div id="' + settings.id + '" class="cmt-timepicker ' + settings.classes + '" style="z-index: 100000;"></div>' );

		// Iterate and initialise all the picker elements
		pickers.each( function() {

			var picker = cmtjq( this );

			init( picker );
		});

		// return control
		return;

		// == Private Functions == //

		function init( picker ) {

			// Picker singleton
			var timePicker = cmtjq( '#' + settings.id );

			// Turn off autocomplete
			picker.attr( 'autocomplete', 'off' );
			picker.attr( 'readonly', true );

			picker.focusin( function() {

				destroyPickerElement( timePicker );

				initPickerElement( timePicker, picker );
			});
		}

		function initPickerElement( timePicker, picker ) {

			// Header
			var header = '<div class="cmt-timepicker-header row">\n\
								<div class="colf colf2 row">\n\
									<div class="cmt-timepicker-apm cmt-timepicker-am colf colf2 align align-center active">AM</div>\n\
									<div class="cmt-timepicker-apm cmt-timepicker-pm colf colf2 align align-center">PM</div>\n\
								</div>\n\
								<div class="cmt-timepicker-apm cmt-timepicker-mm colf colf2 align align-center">Minutes</div>\n\
							</div>';

			// TODO: Initialise content programatically instead of hardcoding hours and minutes

			// Content
			var content = '<div class="cmt-timepicker-content row">\n\
								<div class="cmt-timepicker-hr-wrap colf colf2 row">\n\
									<div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-1 active">1</div><div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-2">2</div>\n\
									<div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-3">3</div><div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-4">4</div>\n\
									<div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-5">5</div><div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-6">6</div>\n\
									<div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-7">7</div><div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-8">8</div>\n\
									<div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-9">9</div><div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-10">10</div>\n\
									<div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-11">11</div><div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-12">12</div>\n\
								</div>\n\
								<div class="cmt-timepicker-min-wrap colf colf2 row">\n\
									<div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-0 active">0</div><div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-5">5</div>\n\
									<div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-10">10</div><div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-15">15</div>\n\
									<div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-20">20</div><div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-25">25</div>\n\
									<div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-30">30</div><div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-35">35</div>\n\
									<div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-40">40</div><div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-45">45</div>\n\
									<div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-50">50</div><div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-55">55</div>\n\
								</div>\n\
							</div>';

			// Footer
			var footer = '<div class="cmt-timepicker-footer row">\n\
								<div class="colf colf2 row">\n\
									<input class="cmt-timepicker-time" type="text" readonly />\n\
								</div>\n\
								<div class="colf colf2">\n\
									<span class="cmt-timepicker-ok btn-icon"><i class="cmti cmti-approve"></i></span>\n\
									<span class="cmt-timepicker-close btn-icon"><i class="cmti cmti-close"></i></span>\n\
								</div>\n\
							</div>';

			// Append elements
			timePicker.append( header );
			timePicker.append( content );
			timePicker.append( footer );

			// Dimensions
			var position	= picker.offset();
			var top			= position.top + picker.outerHeight();
			var left		= position.left;

			timePicker.css( { 'top': top + 'px', 'left': left + 'px' } );
			timePicker.css( { 'width': settings.width, 'height': settings.height } );

			// Initial Value
			var time	= picker.val();

			if( time.length > 0 ) {

				var split1 = time.split( ' ' );
				var split2 = split1[ 0 ].split( ':' );

				timePicker.find( '.cmt-timepicker-hr' ).removeClass( 'active' );
				timePicker.find( '.cmt-timepicker-hr-' + split2[ 0 ] ).addClass( 'active' );

				timePicker.find( '.cmt-timepicker-min' ).removeClass( 'active' );
				timePicker.find( '.cmt-timepicker-min-' + split2[ 1 ] ).addClass( 'active' );

				timePicker.find( '.cmt-timepicker-apm' ).removeClass( 'active' );

				if( split1[ 1 ] === 'AM' ) {

					timePicker.find( '.cmt-timepicker-am' ).addClass( 'active' );
				}
				else {

					timePicker.find( '.cmt-timepicker-pm' ).addClass( 'active' );
				}
			}

			setTime( timePicker );

			// On AM/PM
			timePicker.find( '.cmt-timepicker-am, .cmt-timepicker-pm' ).click( function() {

				timePicker.find( '.cmt-timepicker-apm' ).removeClass( 'active' );
				cmtjq( this ).addClass( 'active' );

				setTime( timePicker );
			});

			// On Hour
			timePicker.find( '.cmt-timepicker-hr' ).click( function() {

				timePicker.find( '.cmt-timepicker-hr' ).removeClass( 'active' );
				cmtjq( this ).addClass( 'active' );

				setTime( timePicker );
			});

			// On Min
			timePicker.find( '.cmt-timepicker-min' ).click( function() {

				timePicker.find( '.cmt-timepicker-min' ).removeClass( 'active' );
				cmtjq( this ).addClass( 'active' );

				setTime( timePicker );
			});

			// On Ok
			timePicker.find( '.cmt-timepicker-ok' ).click( function() {

				picker.val( timePicker.find( '.cmt-timepicker-time' ).val() );

				picker.trigger( 'change' );

				destroyPickerElement( timePicker );
			});

			// On Close
			timePicker.find( '.cmt-timepicker-close' ).click( function() {

				destroyPickerElement( timePicker );
			});

			// Show
			timePicker.fadeIn( 'slow' );
		}

		function destroyPickerElement( timePicker ) {

			timePicker.fadeOut( 'fast' );

			timePicker.html( '' );
		}

		function setTime( timePicker ) {

			// Value
			var hr		= timePicker.find( '.cmt-timepicker-hr.active' ).html();
			var min		= timePicker.find( '.cmt-timepicker-min.active' ).html();
			var apm		= timePicker.find( '.cmt-timepicker-apm.active' ).html();
			var timeStr	= hr + ":" + min + " " + apm;

			// Set time
			timePicker.find( '.cmt-timepicker-time' ).val( timeStr );
		}
	};

	// Default Settings
	cmtjq.fn.cmtTimePicker.defaults = {
		id: 'cmt-el-timepicker', // singleton timepicker element
		classes: 'cmt-timepicker-basic', // additional classes
		width: 220,
		height: 220
	};

})( jQuery );


/**
 * Circled plugin can be used to show circular percentage.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtCircled = function( options ) {

		// == Init == //

		// Configure Modules
		var settings	= cmtjq.extend( {}, cmtjq.fn.cmtCircled.defaults, options );
		var circles		= this;

		// Iterate and initialise all the circles
		circles.each( function() {

			var circle = cmtjq( this );

			init( circle );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Header
		function init( circle ) {

			var value	= cmt.utils.data.hasAttribute( circle, 'data-value' ) ? circle.attr( 'data-value' ) : 0;
			var percent	= circle.find( '.percent' );
			var degree	= ( value / 100 ) * 360;
			var rPie	= circle.find( '.circledp-pie-right' );
			var lPie	= circle.find( '.circledp-pie-left' );

			// Update display value
			percent.html( value );

			// Update Pie
			if( degree <= 180 ) {

				rPie.find( '.circledp-pie-val' ).css( { 'transform': 'translate(0, 100%) rotate(' + degree + 'deg)' } );
			}
			else {

				rPie.find( '.circledp-pie-val' ).css( { 'transform': 'translate(0, 100%) rotate(180deg)' } );
				lPie.find( '.circledp-pie-val' ).css( { 'transform': 'translate(0, 100%) rotate(' + (degree - 180) + 'deg)' } );
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtCircled.defaults = {

	};

})( jQuery );


/**
 * Clock plugin can be used to show digital clock.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtClock = function( options ) {

		// == Init == //

		// Configure Modules
		var settings	= cmtjq.extend( {}, cmtjq.fn.cmtClock.defaults, options );
		var clocks		= this;

		// Iterate and initialise all the clocks
		clocks.each( function() {

			var clock = cmtjq( this );

			init( clock );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Header
		function init( clock ) {

			clockTicker( clock );
		}

		function clockTicker( clock ) {

			var time = clock.find( '.current-time' ).html();

			var dt	= new Date( time );
			var day	= dt.getDay();
			var hr	= dt.getHours();
			var min	= dt.getMinutes();
			var sec	= dt.getSeconds();

			hr	= hr < 10 ? "0" + hr : hr;
			min = min < 10 ? "0" + min : min;
			sec = sec < 10 ? "0" + sec : sec;

			clock.find( '.day' ).html( cmt.utils.data.weekDays[ day ] );
			clock.find( '.hours' ).html( hr );
			clock.find( '.minutes' ).html( min );
			clock.find( '.seconds' ).html( sec );

			if( hr > 12 ) {

				clock.find( '.period' ).html( 'PM' );
			}
			else {

				clock.find( '.period' ).html( 'AM' );
			}

			dt.setSeconds( dt.getSeconds() + 1 );

			clock.find( '.current-time' ).html( dt.toLocaleString() );

			// TODO: Use requestAnimationFrame instead of setTimeout
			// Refresh the clock every 1 second
			setTimeout( function() { clockTicker( clock ); }, 1000 );
		}
	};

	// Default Settings
	cmtjq.fn.cmtClock.defaults = {
		digital: true
	};

})( jQuery );


/**
 * Countdown Timer plugin can be used to show timer countdown.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtCountdownTimer = function( options ) {

		// == Init == //

		// Configure Modules
		var settings	= cmtjq.extend( {}, cmtjq.fn.cmtCountdownTimer.defaults, options );
		var timers		= this;

		// Iterate and initialise all the timers
		timers.each( function() {

			var timer = cmtjq( this );

			init( timer );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Header
		function init( timer ) {

			timeTicker( timer );
		}

		function timeTicker( timer ) {

			var days	= parseInt( timer.find( '.days' ).html() );
			var hours	= parseInt( timer.find( '.hours' ).html() );
			var minutes = parseInt( timer.find( '.minutes' ).html() );
			var seconds = parseInt( timer.find( '.seconds' ).html() );

			if( seconds > 0 ) {

				seconds--;
			}
			else if( seconds === 0 && ( days > 0 || hours > 0 || minutes > 0 ) ) {

				seconds = 59;

				if( minutes > 0 ) {

					minutes--;
				}
				else if( minutes === 0 && ( days > 0 || hours > 0 ) ) {

					minutes = 59;

					if( hours > 0 ) {

						hours--;
					}
					else if( hours === 0 && ( days > 0 ) ) {

						hours = 23;

						if( days > 0 ) {

							days--;
						}
					}
				}
			}

			timer.find( '.days' ).html( days );
			timer.find( '.hours' ).html( hours );
			timer.find( '.minutes' ).html( minutes );
			timer.find( '.seconds' ).html( seconds );

			// Refresh the clock every 1 second
			setTimeout( function() { timeTicker( timer ); }, 1000 );
		}
	};

	// Default Settings
	cmtjq.fn.cmtCountdownTimer.defaults = {

	};

})( jQuery );


/**
 * The base file of Velocity Framework to bootstrap the required namespace and components 
 * specific to communicate with server and process the request and response using MVC patterns.
 */

// == Global Namespace ====================

cmt.api = {};

// TODO: Add Data Binding Support using Model to bind data sent by server to respective ui component
// TODO: Add Data Binding with Pagination for Data Grid
// TODO: Add Page History and Caching Support

// == Applications ========================

cmt.api.Root = function( options ) {

	this.apps		= []; // Alias, Path map

	this.activeApps	= []; // Alias, Application map
}

/**
 * It maps the application to registry by accepting alias and path.
 *
 * @param {string} alias
 * @param {string} path
 */
cmt.api.Root.prototype.mapApplication = function( alias, path ) {

	if( this.apps[ alias ] == undefined ) {

		this.apps[ alias ] = path;
	}
}

/**
 * It returns the application from active applications.
 *
 * @param {string} alias
 * @param {boolean} factory
 * @returns {cmt.api.Application}
 */
cmt.api.Root.prototype.getApplication = function( alias, options ) {

	options = typeof options !== 'undefined' ? options : { };

	if( this.apps[ alias ] == undefined ) {
		
		throw 'Application with alias ' + alias + ' is not registered.';
	}

	// Create singleton instance if not exist
	if( this.activeApps[ alias ] == undefined ) {

		var application = cmt.utils.object.strToObject( this.apps[ alias ] );

		// Initialise Application
		application.init( options );

		// Add singleton to active registry
		this.activeApps[ alias ] = application;
	}

	return this.activeApps[ alias ];
}

/**
 * It set and update the active applications.
 *
 * @param {string} alias
 * @param {cmt.api.Application} application
 */
cmt.api.Root.prototype.setApplication = function( alias, application ) {

	if( this.activeApps[ alias ] == undefined ) {

		this.activeApps[ alias ] = application;
	}
}

/**
 * It maps the application to registry and add it to active applications.
 *
 * @param {string} alias
 * @param {boolean} factory
 * @param {cmt.api.Application} application
 */
cmt.api.Root.prototype.registerApplication = function( alias, path, options ) {
	
	if( this.apps[ alias ] != null ) {
		
		throw 'Application with alias ' + alias + ' is already registered. Cannot register the same alias.';
	}

	this.mapApplication( alias, path );

	return this.getApplication( alias, options );
};

cmt.api.root = new cmt.api.Root();


/**
 * Key Concepts
 * -------------------------
 *  1. Application
 *  2. Controller
 *  3. Service
 *  4. Action
 *  5. User
 *  6. Route
 *  7. Request Element
 *  8. Trigger Element
 *  9. Get, Post, Put and Delete
 * 10. View
 *
 * An application is a collection of app config and controllers. Each controller can define several actions that can be executed by app user.
 * A project can create multiple applications based on it's needs. The request triggers present within request elements use the Request Processing 
 * Engine to fire submitted requests to controllers for pre and post processing. The request elements can also specify the controller, action, route, 
 * method and consist of at least one trigger to fire the request.
 *
 * Apart from request elements and request triggers, we can also call the application methods to process request directly via get, post, put or delete.
 *
 * The CMT API does not provided functionality to render view, leaving the view template engine as a choice for developer. Moustache, Handlebars are few
 * among the well know templating engines used to render view. These can be used to render view while post processing a particular request utilising data
 * sent back by server.
 */

// == Application =========================

cmt.api.Application = function( options ) {

	/**
	 * Config Object
	 */
	this.config = {
		json: false, 				// Identify whether all the request must be processed using json format
		basePath: null,				// Base path to be used to create requests.
		csrfGet: false,				// CSRF Token for Get Request
		errorClass: '.error',		// Default css class for error elements
		warnClass: '.warn',			// Default css class for warning elements
		messageClass: '.message',	// Default css class for showing request result as message
		spinnerClass: '.spinner'	// Default css class for showing spinner till the request gets processed
	};

	// Merge default config and application options
	jQuery.extend( this.config, options );

	// Default controller to be used as fallback in case no controller is mentioned
	var defaultController = cmt.api.Application.CONTROLLER_DEFAULT;

	// TODO: Add Apix and REST based default controllers to handle CRUD operations.

	// TODO: Add routing table to automatically detect controller based on request route.

	/**
	 * -----------------------------
	 * Routing
	 * -----------------------------
	 * Request routing in CMGTools JS - MVC is handled by controllers map which is an associative array of controller name and classpath. The app should
	 * know all the controllers it's dealing with. It also maintains a seperate map of active controllers which are already initialised. The active controllers map
	 * is associative array of controller name and object.
	 *
	 * The Request Processing Engine use the pre-defined controllers to process a request and fallback to default controller and action in case it does not
	 * find appropriate controller and action.
	 */

	/**
	 * An exhaustive map of all the controllers (alias, classpath) available for the application. Each application can use this map to maintain it's controllers list.
	 */
	this.controllers = []; // Alias, Path map

	this.controllers[ defaultController ] = 'cmt.api.controllers.RequestController';

	/**
	 * Map of all the active controllers (alias, object) which are already initialised. It will save us from re-initialising controllers.
	 */
	this.activeControllers = []; // Alias, Controller map
	
	/**
	 * Map of all the services (alias, classpath) available for the application.
	 */
	this.services = [];
	
	/**
	 * Map to query active services (alias, object) which are already initialised.
	 */
	this.activeServices	= [];
};

// == Application Globals =================

//Defaults
cmt.api.Application.CONTROLLER_DEFAULT	= 'default';			// Default Controller Alias
cmt.api.Application.ACTION_DEFAULT		= 'default';			// Default Controller's default Action

// Static - Attributes - Request Element
cmt.api.Application.STATIC_CONTROLLER	=  'cmt-controller';	// Controller attribute set on request element.
cmt.api.Application.STATIC_ACTION		=  'cmt-action';		// Action attribute set on request element.
cmt.api.Application.STATIC_CUSTOM		=  'cmt-custom';		// Identify whether custom data is required.
cmt.api.Application.STATIC_ID			=  'id';				// Id to uniquely identify request element.
cmt.api.Application.STATIC_KEEP			=  'cmt-keep';			// The keep attribute specify whether request element's form fields need to be retained on success.

// Static - Attributes - Errors
cmt.api.Application.STATIC_ERROR		=  'cmt-error';			// The error element to display model property validation failure.

// Static - Triggers
cmt.api.Application.STATIC_CLICK		=  '.cmt-click';		// The class to be set for trigger element which fire request on click.
cmt.api.Application.STATIC_CHANGE		=  '.cmt-change';		// The class to be set for trigger element which fire request on value change.
cmt.api.Application.STATIC_KEY_UP		=  '.cmt-key-up';		// The class to be set for trigger element which fire request on key up.
cmt.api.Application.STATIC_BLUR			=  '.cmt-blur';			// The class to be set for trigger element which fire request on key up.

/**
 * -----------------------------
 * Request Processing Engine (RPE)
 * -----------------------------
 * The Request Processing Engine (RPE) process the requests by initialising the request elements having appropriate trigger.
 * These triggers can be form submit, button click, select change. We can use the jQuery plugin to register these triggers. Example:
 *
 * jQuery( '<selector>' ).cmtRequestProcessor( { app: <application> } );
 *
 * The selectors passed to request processor plugin forming the view i.e. request element can wrap form elements and the trigger element. A request can be fired
 * based on trigger type and user action. The request triggers pass request to RPE which further find the appropriate controller and initialise it for
 * first time and update active controllers map. RPE is responsible for calling pre processor method(if exist) for identified action and pass request to
 * backend. RPE also process response sent back by server and pass it to post processor method(if exist). The controller might define pre and post processor methods
 * for an action. The post processor method can define logic to handle response and use appropriate templating engine to update view.
 */

// == Application Initialisation ==========

cmt.api.Application.prototype.init = function( options ) {

	// Merge default config and application options
	jQuery.extend( this.config, options );
}

// == Applications Controllers ============

/**
 * It maps the controller to registry by accepting alias and path.
 *
 * @param {string} alias
 * @param {string} path
 */
cmt.api.Application.prototype.mapController = function( alias, path ) {

	if( this.controllers[ alias ] == undefined ) {

		this.controllers[ alias ] = path;
	}
}

/**
 * It returns the controller from active controllers.
 *
 * @param {string} alias
 * @param {object} options
 * @param {boolean} factory
 * @returns {cmt.api.controllers.BaseController}
 */
cmt.api.Application.prototype.getController = function( alias, options, factory ) {

	options = typeof options !== 'undefined' ? options : { };
	factory = typeof factory !== 'undefined' ? factory : false; // Use singleton from registry if not passed

	if( this.controllers[ alias ] == undefined ) throw 'Controller with alias ' + alias + ' is not registered.';

	// Create and return the instance
	if( factory ) {

		var controller 	= cmt.utils.object.strToObject( this.controllers[ alias ] );

		// Initialise Controller
		controller.init( options );

		return controller;
	}

	// Create singleton instance if not exist
	if( this.activeControllers[ alias ] == undefined ) {

		var controller 	= cmt.utils.object.strToObject( this.controllers[ alias ] );

		// Initialise Controller
		controller.init( options );

		// Add singleton to active registry
		this.activeControllers[ alias ] = controller;
	}

	return this.activeControllers[ alias ];
}

/**
 * It set and update the active controllers.
 *
 * @param {string} alias
 * @param {cmt.api.controllers.BaseController} controller
 */
cmt.api.Application.prototype.setController = function( alias, controller ) {

	if( this.activeControllers[ alias ] == undefined ) {

		this.activeControllers[ alias ] = controller;
	}
}

/**
 * It maps the controller to registry and add it to active controllers.
 *
 * @param {string} alias
 * @param {string} classpath
 * @param {object} options
 * @returns {cmt.api.controllers.BaseController}
 */
cmt.api.Application.prototype.registerController = function( alias, classpath, options ) {

	options = typeof options !== 'undefined' ? options : { };

	this.mapController( alias, classpath );

	return this.getController( alias, options, false );
};

/**
 * It find the controller and return default controller in case not found.
 *
 * @param {string} alias
 * @param {object} options
 * @param {boolean} factory
 * @returns {cmt.api.controllers.BaseController}
 */
cmt.api.Application.prototype.findController = function( alias, options, factory ) {

	try {

		return this.getController( alias, options, factory );
	}
	catch( err ) {

		console.log( err );

		console.log( 'Falling back to default controller.' );

		if( this.controllers[ cmt.api.Application.CONTROLLER_DEFAULT ] !== undefined ) {

			return this.findController( cmt.api.Application.CONTROLLER_DEFAULT );
		}
	}
};

// == Application Services ================

/**
 * It maps the service to registry by accepting alias and path.
 *
 * @param {string} alias
 * @param {string} path
 */
cmt.api.Application.prototype.mapService = function( alias, path ) {

	if( this.services[ alias ] == undefined ) {

		this.services[ alias ] = path;
	}
}

/**
 * It returns the service from active services.
 *
 * @param {string} alias
 * @param {object} options
 * @param {boolean} factory
 * @returns {cmt.api.services.BaseService}
 */
cmt.api.Application.prototype.getService = function( alias, options, factory ) {

	options = typeof options !== 'undefined' ? options : { };

	if( this.services[ alias ] == undefined ) throw 'Service with alias ' + alias + ' is not registered.';

	// Create and return the instance
	if( factory ) {

		var service = cmt.utils.object.strToObject( this.services[ alias ] );

		// Initialise Service
		service.init( options );

		return service;
	}

	// Create singleton instance if not exist
	if( this.activeServices[ alias ] == undefined ) {

		var service = cmt.utils.object.strToObject( this.services[ alias ] );

		// Initialise Service
		service.init( options );

		// Add singleton to active registry
		this.activeServices[ alias ] = service;
	}

	return this.activeServices[ alias ];
}

/**
 * It set and update the active services.
 *
 * @param {string} alias
 * @param {cmt.api.services.BaseService} service
 */
cmt.api.Application.prototype.setService = function( alias, service ) {

	if( this.activeServices[ alias ] == undefined ) {

		this.activeServices[ alias ] = service;
	}
}

/**
 * It maps the service to registry and add it to active services.
 *
 * @param {string} alias
 * @param {string} classpath
 * @param {object} options
 * @returns {cmt.api.services.BaseService}
 */
cmt.api.Application.prototype.registerService = function( alias, classpath, options ) {

	this.mapService( alias, classpath );

	return this.getService( alias, options );
};


/**
 * Controller namespace providing base class for all the Controllers.
 */

cmt.api.controllers = cmt.api.controllers || {};


/**
 * Service namespace providing base class for all the services.
 */

cmt.api.services = cmt.api.services || {};


/**
 * CMGTools API Utilities - Collection of commonly used utility functions available for CMGTools API.
 */

// Global Namespace for CMGTools API utilities
cmt.api.utils = cmt.api.utils || {};


cmt.api.controllers.BaseController = function( options ) {

	this.caching = false; // Cache response
};

// Initialise --------------------

cmt.api.controllers.BaseController.prototype.init = function( options ) {

	// Initialise controller
};


/**
 * The ActionController and classes extending it can be used to post arbitrary requests to server
 * by calling execute method where actual request data will be formed. It's required where Request Element and
 * Request Trigger is not needed and request can be triggered by calling execute method.
 *
 * Ex:
 * myApp.findController( 'user' ).default();
 */
cmt.api.controllers.ActionController = function( options ) {

	this.requestData = null;	// Request data for post requests
};

// Initialise --------------------

cmt.api.controllers.ActionController.inherits( cmt.api.controllers.BaseController );

cmt.api.controllers.ActionController.prototype.init = function( options ) {

	console.log( "Initialised default controller." );
};

// Default Action ----------------

cmt.api.controllers.ActionController.prototype.default = function() {

	console.log( "Executing default action." );

	return true;
};

cmt.api.controllers.ActionController.prototype.defaultActionPre = function() {

	console.log( "Pre processing default action." );

	return true;
};

cmt.api.controllers.ActionController.prototype.defaultActionSuccess = function( response ) {

	console.log( "Processing success for default action." );
};

cmt.api.controllers.ActionController.prototype.defaultActionFailure = function( response ) {

	console.log( "Processing failure for default action." );
};


/**
 * The GridController and classes extending it can be used to manage data grids providing
 * searching, sorting and crud operations. It differs from RestController in default action
 * names i.e. it provides default actions to perform actions including all, create, update and delete.
 */
cmt.api.controllers.GridController = function( options ) {

	this.endpoint	= null;	// Endpoint where all the requests need to be sent

	/**
	 * The model name appended at last of endpoint and before action name.
	 * We do not need action name in case of get, post, put and delete.
	 */
	this.model		= null;

	/**
	 * The collection returned by server and cached locally. The grid will always be
	 * refreshed as soon as collection changes.
	 */
	this.collection	= null;

	/**
	 * Template used to render the grid rows.
	 */
	this.rowTemplate	= null;

	/**
	 * Template used to render the cards.
	 */
	this.cardTemplate	= null;

	// Pagination
	this.pages		= 0; // Total Pages formed using collection
	this.pageLimit	= 0; // Total items in a page
	this.lastPage	= 0; // The last page loaded when user scroll to bottom
};

// Initialise --------------------

cmt.api.controllers.GridController.inherits( cmt.api.controllers.BaseController );

cmt.api.controllers.GridController.prototype.init = function( options ) {

	console.log( "Initialised grid controller." );
};

// Read --------------------------

cmt.api.controllers.GridController.prototype.allActionPre = function() {

	console.log( "Pre processing all action." );

	return true;
};

cmt.api.controllers.GridController.prototype.allActionSuccess = function( response ) {

	console.log( "Processing success for all action." );
};

cmt.api.controllers.GridController.prototype.allActionFailure = function( response ) {

	console.log( "Processing failure for all action." );
};

// Create ------------------------

cmt.api.controllers.GridController.prototype.createActionPre = function() {

	console.log( "Pre processing create action." );

	return true;
};

cmt.api.controllers.GridController.prototype.createActionSuccess = function( response ) {

	console.log( "Processing success for create action." );
};

cmt.api.controllers.GridController.prototype.createActionFailure = function( response ) {

	console.log( "Processing failure for create action." );
};

// Update ------------------------

cmt.api.controllers.GridController.prototype.updateActionPre = function() {

	console.log( "Pre processing update action." );

	return true;
};

cmt.api.controllers.GridController.prototype.updateActionSuccess = function( response ) {

	console.log( "Processing success for update action." );
};

cmt.api.controllers.GridController.prototype.updateActionFailure = function( response ) {

	console.log( "Processing failure for update action." );
};

// Delete ------------------------

cmt.api.controllers.GridController.prototype.deleteActionPre = function() {

	console.log( "Pre processing delete action." );

	return true;
};

cmt.api.controllers.GridController.prototype.deleteActionSuccess = function( response ) {

	console.log( "Processing success for delete action." );
};

cmt.api.controllers.GridController.prototype.deleteActionFailure = function( response ) {

	console.log( "Processing failure for delete action." );
};


/**
 * The RequestController and classes extending it can be used to post arbitrary requests to server using the request element and it's trigger.
 * It provides a default action as a fallback in case action is not specified by the Request Element.
 */
cmt.api.controllers.RequestController = function( options ) {

	this.requestTrigger	= null;	// Request trigger which triggered the request. It will always be present within request element.

	this.requestForm	= null; // The element having form elements to be submitted with request. In most of the cases, it will be request element.

	this.requestData	= null;	// Request data to be appended for post requests. It can be prepared in pre processor to handle custom requests.

	this.currentRequest	= null;	// Request in execution.

	this.singleRequest	= false; // Process one request at a time and abort previous requests.
};

// Initialise --------------------

cmt.api.controllers.RequestController.inherits( cmt.api.controllers.BaseController );

cmt.api.controllers.RequestController.prototype.init = function( options ) {

	console.log( "Initialised default controller." );
};

// Default Action ----------------

cmt.api.controllers.RequestController.prototype.defaultActionPre = function( requestElement ) {

	console.log( "Pre processing default action." );

	return true;
};

cmt.api.controllers.RequestController.prototype.defaultActionSuccess = function( requestElement, response ) {

	console.log( "Processing success for default action." );
};

cmt.api.controllers.RequestController.prototype.defaultActionFailure = function( requestElement, response ) {

	console.log( "Processing failure for default action." );
};


/**
 * The RestController and classes extending it can be used to manage classical rest requests providing searching, sorting and crud operations.
 * It provides default actions to perform rest actions including get, post, put and delete.
 */
cmt.api.controllers.RestController = function( options ) {

	this.endpoint	= null;	// Endpoint where all the requests need to be sent

	this.model		= null;	// The model name appended at last of endpoint and before action name. We do not need action name in case of get, post, put and delete.

	this.collection	= null; // The collection returned by server and cached locally.

	// Pagination
	this.pages		= 0;	// Total Pages formed using collection
	this.pageLimit	= 0;	// Total items in a page
	this.lastPage	= 0;	// The last page loaded when user scroll to bottom
};

// Initialise --------------------

cmt.api.controllers.RestController.inherits( cmt.api.controllers.BaseController );

cmt.api.controllers.RestController.prototype.init = function( options ) {

	console.log( "Initialised rest controller." );
};

// Get - Single or All -----------

cmt.api.controllers.RestController.prototype.getActionPre = function() {

	console.log( "Pre processing get action." );

	return true;
};

cmt.api.controllers.RestController.prototype.getActionSuccess = function( response ) {

	console.log( "Processing success for get action." );
};

cmt.api.controllers.RestController.prototype.getActionFailure = function( response ) {

	console.log( "Processing failure for get action." );
};

// Post --------------------------

cmt.api.controllers.RestController.prototype.postActionPre = function() {

	console.log( "Pre processing post action." );

	return true;
};

cmt.api.controllers.RestController.prototype.postActionSuccess = function( response ) {

	console.log( "Processing success for post action." );
};

cmt.api.controllers.RestController.prototype.postActionFailure = function( response ) {

	console.log( "Processing failure for post action." );
};

// Put ---------------------------

cmt.api.controllers.RestController.prototype.putActionPre = function() {

	console.log( "Pre processing put action." );

	return true;
};

cmt.api.controllers.RestController.prototype.putActionSuccess = function( response ) {

	console.log( "Processing success for put action." );
};

cmt.api.controllers.RestController.prototype.putActionFailure = function( response ) {

	console.log( "Processing failure for put action." );
};

// Delete ------------------------

cmt.api.controllers.RestController.prototype.deleteActionPre = function() {

	console.log( "Pre processing delete action." );

	return true;
};

cmt.api.controllers.RestController.prototype.deleteActionSuccess = function( response ) {

	console.log( "Processing success for delete action." );
};

cmt.api.controllers.RestController.prototype.deleteActionFailure = function( response ) {

	console.log( "Processing failure for delete action." );
};


cmt.api.services.BaseService = function( options ) {

};

// Initialise --------------------

cmt.api.services.BaseService.prototype.init = function( options ) {

	// Initialise service
};


/**
 * Register the request elements
 */
cmt.api.utils.request = {

	// Register the request triggers present with the request elements.
	register: function( application, requestElements ) {

		// Iterate and initialise all the requests
		requestElements.each( function() {

			// Active element
			var requestElement = jQuery( this );

			// Form Submits
			if( requestElement.is( 'form' ) ) {

				// Trigger request on form submit
				requestElement.submit( function( event ) {

					// Stop default form submit execution
					event.preventDefault();

					// Trigger the request
					cmt.api.utils.request.trigger( application, requestElement, true, null );
				});
			}

			// Button Clicks
			var filters = requestElement.find( '[cmt-app] ' + cmt.api.Application.STATIC_CLICK + ', .cmt-request ' + cmt.api.Application.STATIC_CLICK );

			var clickTrigger = requestElement.find( cmt.api.Application.STATIC_CLICK ).not( filters );

			if( clickTrigger.length > 0 ) {

				// Trigger request on click action
				clickTrigger.click( function( event ) {

					// Stop default click action
					event.preventDefault();

					// Trigger the request
					cmt.api.utils.request.trigger( application, requestElement, false, jQuery( this ) );
				});
			}

			// Select Change
			var filters = requestElement.find( '[cmt-app] ' + cmt.api.Application.STATIC_CHANGE + ', .cmt-request ' + cmt.api.Application.STATIC_CHANGE );

			var selectTrigger = requestElement.find( cmt.api.Application.STATIC_CHANGE ).not( filters );

			if( selectTrigger.length > 0 ) {

				// Trigger request on select
				selectTrigger.change( function() {

					// Trigger the request
					cmt.api.utils.request.trigger( application, requestElement, false, jQuery( this ) );
				});
			}

			// Key Up
			var filters = requestElement.find( '[cmt-app] ' + cmt.api.Application.STATIC_KEY_UP + ', .cmt-request ' + cmt.api.Application.STATIC_KEY_UP );

			var keyupTrigger = requestElement.find( cmt.api.Application.STATIC_KEY_UP ).not( filters );

			if( keyupTrigger.length > 0 ) {

				keyupTrigger.keyup( function() {

					// Trigger the request
					cmt.api.utils.request.trigger( application, requestElement, false, jQuery( this ) );
				});
			}

			// Blur
			var filters = requestElement.find( '[cmt-app] ' + cmt.api.Application.STATIC_BLUR + ', .cmt-request ' + cmt.api.Application.STATIC_BLUR );

			var blurTrigger = requestElement.find( cmt.api.Application.STATIC_BLUR ).not( filters );

			if( blurTrigger.length > 0 ) {

				blurTrigger.blur( function() {

					// Trigger the request
					cmt.api.utils.request.trigger( application, requestElement, false, jQuery( this ) );
				});
			}
		});
	},

	// Locate app and register the target request triggers
	registerTargetApp: function( appName, target, discover ) {

		if( typeof discover === "undefined" || discover ) {

			cmt.api.utils.request.register( cmt.api.root.getApplication( appName ), target.find( '[cmt-app=' + appName + ']' ) );
		}
		else {

			cmt.api.utils.request.register( cmt.api.root.getApplication( appName ), target );
		}
	},

	trigger: function( application, requestElement, isForm, requestTrigger ) {

		var controllerName	= requestElement.attr( cmt.api.Application.STATIC_CONTROLLER );
		var actionName		= requestElement.attr( cmt.api.Application.STATIC_ACTION );

		// Use default controller
		if( null == controllerName ) {

			controllerName = cmt.api.Application.CONTROLLER_DEFAULT;
		}

		// Use default action
		if( null == actionName ) {

			actionName = cmt.api.Application.ACTION_DEFAULT;
		}

		// Search Controller
		var controller				= application.findController( controllerName );
		controller.requestTrigger	= requestTrigger;

		if( isForm ) {

			if( application.config.json ) {

				cmt.api.utils.request.handleJsonForm( application, requestElement, controller, actionName );
			}
			else {

				cmt.api.utils.request.handleDataForm( application, requestElement, controller, actionName );
			}
		}
		else {

			cmt.api.utils.request.handleRequest( application, requestElement, controller, actionName );
		}
	},

	handleJsonForm: function( application, requestElement, controller, actionName ) {

		// Pre process
		if( cmt.api.utils.request.preProcessRequest( application, requestElement, controller, actionName ) ) {

			// Generate form data for submission
			var formData	= controller.requestData;
			var method		= requestElement.attr( 'method' );

			// Custom Request
			if( requestElement.is( '[' + cmt.api.Application.STATIC_CUSTOM + ']' ) ) {

				formData	= cmt.utils.data.appendCsrf( formData );
			}
			// Regular Request
			else {

				var formElement = null != controller.requestForm ? controller.requestForm : requestElement;

				if( null != method && method.toLowerCase() == 'get' && !application.config.csrfGet ) {

					formData	= cmt.utils.data.formToJson( formElement, false );
				}
				else {

					formData	= cmt.utils.data.formToJson( formElement );
				}
			}

			// process request
			cmt.api.utils.request.processRequest( application, requestElement, controller, actionName, formData );
		}

		return false;
	},

	handleDataForm: function( application, requestElement, controller, actionName ) {

		// Pre process
		if( cmt.api.utils.request.preProcessRequest( application, requestElement, controller, actionName ) ) {

			// Generate form data for submission
			var formData	= controller.requestData;
			var method		= requestElement.attr( 'method' );

			// Custom Request
			if( requestElement.is( '[' + cmt.api.Application.STATIC_CUSTOM + ']' ) ) {

				formData	= cmt.utils.data.appendCsrf( formData );
			}
			// Regular Request
			else {

				var formElement = null != controller.requestForm ? controller.requestForm : requestElement;

				if( null != method && method.toLowerCase() == 'get' && !application.config.csrfGet ) {

					formData	= cmt.utils.data.serialiseForm( formElement, false );
				}
				else {

					formData	= cmt.utils.data.serialiseForm( formElement );
				}
			}

			// Process request
			cmt.api.utils.request.processRequest( application, requestElement, controller, actionName, formData );
		}

		return false;
	},

	handleRequest: function( application, requestElement, controller, actionName ) {

		// Pre process
		if(  cmt.api.utils.request.preProcessRequest( application, requestElement, controller, actionName ) ) {

			// Generate request data for submission
			var requestData	= controller.requestData;
			var method		= requestElement.attr( 'method' );

			// Custom Request
			if( requestElement.is( '[' + cmt.api.Application.STATIC_CUSTOM + ']' ) ) {

				requestData	= cmt.utils.data.appendCsrf( requestData );
			}
			// Regular Request
			else {

				var formElement = null != controller.requestForm ? controller.requestForm : requestElement;

				if( null != method && method.toLowerCase() == 'get' && !application.config.csrfGet ) {

					requestData	= cmt.utils.data.serialiseElement( formElement, false );
				}
				else {

					requestData	= cmt.utils.data.serialiseElement( formElement );
				}
			}

			// Process request
			cmt.api.utils.request.processRequest( application, requestElement, controller, actionName, requestData );
		}

		return false;
	},

	preProcessRequest: function( application, requestElement, controller, actionName ) {

		var preAction	= actionName + 'ActionPre';
		var formElement = null != controller.requestForm ? controller.requestForm : requestElement;

		// Hide message element
		formElement.find( application.config.messageClass ).css( 'display', 'none' );

		// Hide all warnings
		formElement.find( application.config.warnClass ).css( 'display', 'none' );

		// Hide all errors
		formElement.find( application.config.errorClass ).css( 'display', 'none' );

		// Pre Process Request
		if( typeof controller[ preAction ] !== 'undefined' && !( controller[ preAction ]( requestElement ) ) ) {

			return false;
		}

		// Show Spinner
		requestElement.find( application.config.spinnerClass ).css( 'display', 'inline-block' );

		return true;
	},

	processRequest: function( application, requestElement, controller, actionName, requestData ) {

		var caching		= controller.caching;
		var httpMethod	= 'post';
		var actionUrl	= requestElement.attr( 'action' );

		// Set method if exist
		if( requestElement.attr( 'method' ) ) {

			httpMethod	= requestElement.attr( 'method' );
		}

		if( null != application.config.basePath ) {

			actionUrl	= application.config.basePath + actionUrl;
		}

		if( controller.singleRequest && null != controller.currentRequest ) {

			controller.currentRequest = controller.currentRequest.abort();
			controller.currentRequest = null;
		}

		if( application.config.json ) {

			var request = jQuery.ajax({
				type: httpMethod,
				url: actionUrl,
				data: requestData,
				dataType: 'JSON',
				cache: caching,
				contentType: 'application/json;charset=UTF-8',
				success: function( response, textStatus, XMLHttpRequest ) {

					// Process response
					cmt.api.utils.request.processResponse( application, requestElement, controller, actionName, response );
				}
			});

			if( controller.singleRequest ) {

				controller.currentRequest = request;
			}
		}
		else {

			var request = jQuery.ajax({
				type: httpMethod,
				url: actionUrl,
				data: requestData,
				dataType: 'JSON',
				cache: caching,
				success: function( response, textStatus, XMLHttpRequest ) {

					// Process response
					cmt.api.utils.request.processResponse( application, requestElement, controller, actionName, response );
				}
			});

			if( controller.singleRequest ) {

				controller.currentRequest = request;
			}
		}
	},

	processResponse: function( application, requestElement, controller, actionName, response ) {

		var result		= response[ 'result' ];
		var errors		= response[ 'errors' ];
		var formElement = null != controller.requestForm ? controller.requestForm : requestElement;

		if( result == 1 ) {

			// Check to clear form data
			if( !requestElement.is( '[' + cmt.api.Application.STATIC_KEEP + ']' ) ) {

				// Clear all form fields
				formElement.find( 'input[type=text]' ).not( formElement.find( 'input[' + cmt.api.Application.STATIC_KEEP + '=1]' ) ).val( '' );
				formElement.find( 'input[type=password]' ).val( '' );
				formElement.find( 'textarea' ).not( formElement.find( 'textarea[' + cmt.api.Application.STATIC_KEEP + '=1]' ) ).val( '' );
			}

			// Hide all errors
			formElement.find( application.config.errorClass ).css( 'display', 'none' );
		}
		else if( result == 0 ) {

			// Show Errors
			for( var key in errors ) {

				var fieldName 		= key;
				var errorMessage 	= errors[ key ];
				var errorField		= formElement.find( ' span[' + cmt.api.Application.STATIC_ERROR + '="' + fieldName + '"]' );

				errorField.html( errorMessage );
				errorField.css( 'display', 'inline-block' );
			}
		}

		cmt.api.utils.request.postProcessResponse( application, requestElement, controller, actionName, response );
	},

	postProcessResponse: function( application, requestElement, controller, actionName, response ) {

		var result 		= response[ 'result' ];
		var message		= null;
		var messageStr 	= response[ 'message' ];

		var successAction	= actionName + 'ActionSuccess';
		var failureAction	= actionName + 'ActionFailure';

		if( result == 1 ) {

			message	= requestElement.find( application.config.messageClass + '.success' );
		}
		else if( result == 0 ) {

			message	= requestElement.find( application.config.messageClass + '.error' );
		}

		// Show message
		message.html( messageStr );
		message.css( 'display', 'inline-block' );

		// Hide Spinner
		requestElement.find( application.config.spinnerClass ).hide();

		// Pass the data for post processing
		if( result == 1 && typeof controller[ successAction ] !== 'undefined' ) {

			controller[ successAction ]( requestElement, response );
		}
		else if( result == 0 && typeof controller[ failureAction ] !== 'undefined' ) {

			controller[ failureAction ]( requestElement, response );
		}
	},

	triggerDirect: function( application, controllerName, actionName, actionUrl, httpMethod ) {

		// Use default controller
		if( null == controllerName ) {

			controllerName = cmt.api.Application.CONTROLLER_DEFAULT;
		}

		// Use default action
		if( null == actionName ) {

			actionName = cmt.api.Application.ACTION_DEFAULT;
		}

		// Use post method
		if( null == httpMethod ) {

			httpMethod = 'post';
		}

		// Search Controller
		var controller	= application.findController( controllerName );

		cmt.api.utils.request.handleDirectRequest( application, controller, actionName, actionUrl, httpMethod );
	},

	handleDirectRequest: function( application, controller, actionName, actionUrl, httpMethod ) {

		// Pre process
		if(  cmt.api.utils.request.preProcessDirectRequest( controller, actionName ) ) {

			// Generate request data for submission
			var requestData	= controller.requestData;

			// Post Request
			if( httpMethod === 'post' ) {

				requestData	= cmt.utils.data.appendCsrf( requestData );
			}

			// Process request
			cmt.api.utils.request.processDirectRequest( application, controller, actionName, actionUrl, httpMethod, requestData );
		}

		return false;
	},

	preProcessDirectRequest: function( controller, actionName ) {

		var preAction = actionName + 'ActionPre';

		// Pre Process Request
		if( typeof controller[ preAction ] !== 'undefined' && !( controller[ preAction ]() ) ) {

			return false;
		}

		return true;
	},

	processDirectRequest: function( application, controller, actionName, actionUrl, httpMethod, requestData ) {

		var caching = controller.caching;

		if( null != application.config.basePath ) {

			actionUrl = application.config.basePath + actionUrl;
		}

		if( controller.singleRequest && null != controller.currentRequest ) {

			controller.currentRequest = controller.currentRequest.abort();
			controller.currentRequest = null;
		}

		if( application.config.json ) {

			var request = jQuery.ajax({
				type: httpMethod,
				url: actionUrl,
				data: requestData,
				dataType: 'JSON',
				cache: caching,
				contentType: 'application/json;charset=UTF-8',
				success: function( response, textStatus, XMLHttpRequest ) {

					// Process response
					cmt.api.utils.request.processDirectResponse( application, controller, actionName, response );
				}
			});

			if( controller.singleRequest ) {

				controller.currentRequest = request;
			}
		}
		else {

			var request = jQuery.ajax({
				type: httpMethod,
				url: actionUrl,
				data: requestData,
				dataType: 'JSON',
				cache: caching,
				success: function( response, textStatus, XMLHttpRequest ) {

					// Process response
					cmt.api.utils.request.postProcessDirectResponse( application, controller, actionName, response );
				}
			});

			if( controller.singleRequest ) {

				controller.currentRequest = request;
			}
		}
	},

	postProcessDirectResponse: function( application, controller, actionName, response ) {

		var result 	= response[ 'result' ];

		var successAction	= actionName + 'ActionSuccess';
		var failureAction	= actionName + 'ActionFailure';

		// Pass the data for post processing
		if( result == 1 && typeof controller[ successAction ] !== 'undefined' ) {

			controller[ successAction ]( response );
		}
		else if( result == 0 && typeof controller[ failureAction ] !== 'undefined' ) {

			controller[ failureAction ]( response );
		}
	},

	// Register the service triggers
	registerServiceTriggers: function( requestTriggers ) {

		// Iterate and initialise all the requests
		requestTriggers.each( function() {

			// Active element
			var requestTrigger	= jQuery( this );

			var app		= requestTriggers.attr( 'data-app' );
			var service	= requestTriggers.attr( 'data-service' );
			var handler	= requestTrigger.attr( 'data-handler' );

			// Form Submits
			if( requestTrigger.is( 'form' ) ) {

				// Trigger request on form submit
				requestTrigger.submit( function( event ) {

					// Stop default form submit execution
					event.preventDefault();

					// Trigger the request
					cmt.api.root.getApplication( app ).getService( service )[handler]( requestTrigger );
				});
			}

			// Button Clicks
			var clickTrigger = requestTrigger.find( cmt.api.Application.STATIC_CLICK );

			if( clickTrigger.length > 0 ) {

				// Trigger request on click action
				clickTrigger.click( function( event ) {

					// Stop default click action
					event.preventDefault();

					// Trigger the request
					cmt.api.root.getApplication( app ).getService( service )[handler]( requestTrigger );
				});
			}

			// Select Change
			var selectTrigger = requestTrigger.find( cmt.api.Application.STATIC_CHANGE );

			if( selectTrigger.length > 0 ) {

				// Trigger request on select
				selectTrigger.change( function() {

					// Trigger the request
					cmt.api.root.getApplication( app ).getService( service )[handler]( requestTrigger );
				});
			}

			// Key Up
			var keyupTrigger = requestTrigger.find( cmt.api.Application.STATIC_KEY_UP );

			if( keyupTrigger.length > 0 ) {

				keyupTrigger.keyup( function() {

					// Trigger the request
					cmt.api.root.getApplication( app ).getService( service )[handler]( requestTrigger );
				});
			}

			// Blur
			var blurTrigger = requestTrigger.find( cmt.api.Application.STATIC_BLUR );

			if( blurTrigger.length > 0 ) {

				blurTrigger.blur( function() {

					// Trigger the request
					cmt.api.root.getApplication( app ).getService( service )[handler]( requestTrigger );
				});
			}
		});
	}
}
