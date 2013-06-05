/*!
 * jQuery Modern Marquee plugin
 * https://github.com/leonderijke/Modern-Marquee
 *
 * Author: @leonderijke
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {
	"use strict";

	var transEndEventNames = {
		'WebkitTransition' : 'webkitTransitionEnd',
		'MozTransition'    : 'transitionend',
		'OTransition'      : 'oTransitionEnd',
		'msTransition'     : 'MSTransitionEnd',
		'transition'       : 'transitionend'
	},
	transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ],
	supportsTransitions = !!transEndEventName;

	/*
	 * @function redraw
	 * Triggers a repaint by querying the element's offsetHeight
	 */
	$.fn.redraw = function(){
		$(this).each(function(){
			var redraw = this.offsetHeight;
		});
	};

	var defaults = {
		duration:       "4s",
		iterationCount: "infinite",
		mode:           "scroll",
		start:          "auto"
	};

	function ModernMarquee( element, options ) {
		this.el = $(element);

		this.options = $.extend( {}, defaults, options );

		this.init();
	}

	ModernMarquee.prototype.init = function init() {
		var initialState,
			endState;

		this.el.addClass( 'mm-marquee-container' );
		this.marquee = this.el.contents().wrap( '<span class="mm-marquee">' ).parent();

		this.el.css({
			'overflow':    'hidden',
			'white-space': 'nowrap'
		});

		initialState = '100%';
		endState = this._calculateEndState( this.el, this.marquee );

		if ( this.options.mode === 'scroll' ) {
			this.marquee.css( 'margin-left', initialState );
		}


		if (supportsTransitions) {
			this._run( initialState, endState );
		} else {
			this._oldRun( initialState, endState );
		}
	};

	ModernMarquee.prototype._oldRun = function _oldRun( initialState, endState ) {
		var self = this;
		this.marquee.animate({
			'margin-left': endState
		},
		{
			duration: 4000,
			easing: 'linear',
			complete: function () {
				self.marquee.css( 'margin-left', initialState );
				self._oldRun( initialState, endState );
			}
		});
	};

	ModernMarquee.prototype._run = function _run( initialState, endState ) {
		var self = this;
		this.marquee.css({
			'transition-property'        : 'margin-left',
			'transition-duration'        : this.options.duration,
			'transition-timing-function' : 'linear',
			'margin-left'                : endState
		})
		.one( transEndEventName, function ( event ) {
			self.marquee.css({
				'transition-property'        : '',
				'transition-duration'        : '',
				'transition-timing-function' : ''
			});
			self.marquee.css({
				'margin-left': initialState
			});
			self.marquee.redraw();
			self._run( initialState, endState );
		});
	};

	ModernMarquee.prototype._calculateEndState = function _calculateEndState( container, marquee ) {
		switch ( this.options.mode ) {
			case 'scroll':
				return -1 * marquee.outerWidth( true );
			case 'slide':
			case 'alternate':
				return -1 * ( marquee.outerWidth( true ) - container.width() );
		}
	};

	$.fn.modernMarquee = function ( options ) {
		return this.each( function () {
			if (!$.data( this, "plugin_modernMarquee" ) ) {
				$.data( this, "plugin_modernMarquee", new ModernMarquee( this, options ) );
			}
		});
	};

})( jQuery, window, document );