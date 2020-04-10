jQuery( document ).ready( function() {

	initCmgTools();

	initDatePickers();

	initWindowResize();

	initWindowScroll();
});

// == CMT JS ==============================

function initCmgTools() {

	// Perspective Header
	jQuery( '.cmt-header-perspective' ).cmtHeader( { scrollDistance: 280 } );

	// Blocks
	jQuery( '.cmt-block, .page' ).cmtBlock({
		// Generic
		halfHeight: true,
		heightAuto: true,
		// Block Specific - Ignores generic
		blocks: {
			'block-auto': { autoHeight: true, heightAuto: true },
			'block-half': { halfHeight: true },
			'block-qtf': { qtfHeight: true },
			'block-full': { fullHeight: true },
			'block-half-auto': { halfHeight: true, heightAuto: true },
			'block-qtf-auto': { qtfHeight: true, heightAuto: true },
			'block-full-auto': { fullHeight: true, heightAuto: true },
			'block-half-mauto': { halfHeight: true, heightAutoMobile: true, heightAutoMobileWidth: 1024 },
			'block-qtf-mauto': { qtfHeight: true, heightAutoMobile: true, heightAutoMobileWidth: 1024 },
			'block-full-mauto': { fullHeight: true, heightAutoMobile: true, heightAutoMobileWidth: 1024 }
		}
	});

	// Smooth Scroll
	jQuery( '.cmt-smooth-scroll' ).cmtSmoothScroll();

	// Box Forms
	jQuery( '.cmt-box-form' ).cmtFormInfo();

	// Ratings
	jQuery( '.cmt-rating' ).cmtRate();

	jQuery( '.cmt-rating-emoticons' ).cmtRate({
		same: [ 'cmti cmti-2x cmti-emoticons-sad', 'cmti cmti-2x cmti-emoticons-sulk', 'cmti cmti-2x cmti-emoticons-intense', 'cmti cmti-2x cmti-emoticons-hopeful', 'cmti cmti-2x cmti-emoticons-happy' ],
		emptyColor: '#7F7F7F'
	});

	// Select
	jQuery( '.cmt-select' ).cmtSelect( { iconHtml: '<span class="fa fab fa-caret-down"></span>' } );
	jQuery( '.cmt-select-c' ).cmtSelect( { iconHtml: '<span class="fa fab fa-caret-down"></span>', copyOptionClass: true } );
	jQuery( '.cmt-select-s' ).cmtSelect( { iconHtml: '<span class="fa fab fa-caret-down"></span>', wrapperClass: 'element-small' } );

	// Checkboxes
	jQuery( '.cmt-checkbox' ).cmtCheckbox();

	// Field Groups
	jQuery( '.cmt-field-group' ).cmtFieldGroup();

	// File Uploader
	jQuery( '.cmt-file-uploader' ).cmtFileUploader();

	// Popups
	jQuery( '.cmt-popup' ).cmtPopup();

	// Popouts
	jQuery( '.cmt-popout-group' ).cmtPopoutGroup();

	// Auto Fillers
	jQuery( '.cmt-auto-fill' ).cmtAutoFill();

	// Tabs
	jQuery( '.cmt-tabs' ).cmtTabs();

	// Accordians
	jQuery( '.cmt-accordian' ).cmtAccordian();

	// Grid
	jQuery( '.cmt-grid' ).cmtGrid();

	// Collapsible Menu
	jQuery( '#sidebar-main' ).cmtCollapsibleMenu();

	// Actions
	jQuery( '.cmt-actions' ).cmtActions();

	// Auto Hide
	jQuery( '.cmt-auto-hide' ).cmtAutoHide();

	// Icon Picker
	jQuery( '.cmt-icon-picker, .cmt-texture-picker' ).cmtIconPicker();

	// Time Picker
	jQuery( '.cmt-timepicker' ).cmtTimePicker();

	// Login & Register
	jQuery( '#popup-login' ).cmtLoginRegister();
}

// == Datepickers =========================

function initDatePickers() {

	// jQuery Datepicker
	var datepickers = jQuery( '.datepicker' );

	datepickers.each( function() {

		var datepicker = jQuery( this );

		var start	= datepicker.attr( 'ldata-start' );
		var end		= datepicker.attr( 'ldata-end' );

		if( null != start && null != end ) {

			datepicker.datepicker({
				dateFormat: 'yy-mm-dd',
				minDate: start,
				maxDate: end
			});
		}
		else if( null != start ) {

			datepicker.datepicker({
				dateFormat: 'yy-mm-dd',
				minDate: start
			});
		}
		else if( null != end ) {

			datepicker.datepicker({
				dateFormat: 'yy-mm-dd',
				maxDate: end
			});
		}
		else {

			datepicker.datepicker({
				dateFormat: 'yy-mm-dd'
			});
		}
	});
}

// == Window Resize, Scroll ===============

function initWindowResize() {

	//resizeElements();

	jQuery( window ).resize( function () {

		//resizeElements();
	});
}

function initWindowScroll() {

	jQuery( window ).scroll( function() {

		var scrolledY = jQuery( window ).scrollTop();

		configScrollAt( scrolledY );
	});
}

function resizeElements() {

	// Resize elements on window resize
}

function configScrollAt() {

	// Show hidden elements with animation effects
}
