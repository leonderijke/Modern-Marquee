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
		// Duration specified in milliseconds (integer)
		duration:       4000,

		// Number of times the marquee should scroll ("infinite" or integer)
		iterationCount: "infinite",

		// Mode: scroll, slide or alternate (string)
		mode:           "scroll",

		// Start: auto, manual or hover (string)
		start:          "auto"
	};

	function ModernMarquee( element, options ) {
		this.el = $(element);

		this.options = $.extend( {}, defaults, options );

		this.init();
	}

	/*
	 * @function init
	 * Wraps the element, starts the animation
	 */
	ModernMarquee.prototype.init = function init() {
		var initialState,
			endState,
			iterationCount;

		this.el.addClass( 'mm-marquee-container' );
		this.marquee = this.el.contents().wrap( '<span class="mm-marquee">' ).parent();

		this.el.css({
			'overflow':    'hidden',
			'white-space': 'nowrap'
		});

		initialState = '100%';
		endState = this._calculateEndState( this.el, this.marquee );

		iterationCount = this.options.iterationCount;

		if ( this.options.mode === 'scroll' ) {
			this.marquee.css( 'margin-left', initialState );
		}

		this._run( initialState, endState, iterationCount );
	};

	/*
	 * @function _run
	 * Runs the actual scrolling animation
	 *
	 * @param initialState integer
	 * @param endState integer
	 * @param iterationCount integer or string
	 */
	ModernMarquee.prototype._run = function _run( initialState, endState, iterationCount ) {
		var self = this;

		if ( iterationCount === "infinite" || iterationCount !== 0 ) {
			iterationCount = iterationCount === "infinite" ? "infinite" : iterationCount - 1;

			if ( supportsTransitions) {

				this.marquee.css({
					'transition-property'        : 'margin-left',
					'transition-duration'        : '' + this.options.duration + 'ms',
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
					self._run( initialState, endState, iterationCount );
				});

			} else {

				this.marquee.animate({
					'margin-left': endState
				},
				{
					duration: this.options.duration,
					easing: 'linear',
					complete: function () {
						self.marquee.css( 'margin-left', initialState );
						iterationCount = iterationCount === "infinite" ? "infinite" : iterationCount - 1;
						self._run( initialState, endState, iterationCount );
					}
				});

			}
		}
	};

	/*
	 * @function _calculateEndState
	 * Calculates the end state for a given marquee, based on the specified mode
	 *
	 * @param container jQuery object
	 * @param marquee jQuery object
	 *
	 * @returns integer
	 */
	ModernMarquee.prototype._calculateEndState = function _calculateEndState( container, marquee ) {
		switch ( this.options.mode ) {
			case 'scroll':
				return -1 * marquee.outerWidth( true );
			case 'slide':
			case 'alternate':
				return -1 * ( marquee.outerWidth( true ) - container.width() );
		}
	};

	/*
	 * @function modernMarquee
	 * jQuery plugin wrapper around ModernMarquee
	 *
	 * @param options object
	 */
	$.fn.modernMarquee = function ( options ) {
		return this.each( function () {
			if (!$.data( this, "plugin_modernMarquee" ) ) {
				$.data( this, "plugin_modernMarquee", new ModernMarquee( this, options ) );
			}
		});
	};

})( jQuery, window, document );