/*
 * Smart Sticky Header
 * https://github.com/yaplas/smart-sticky-header
 *
 * Copyright (c) 2015 Agustin Lascialandare
 * MIT license
 */
(function($) {
  var count=0;

  $.isSmartStickyHeader = function(elem) {
    return !!$(elem).data('SmartStickyHeader');
  };

  $.SmartStickyHeader = function(elem, options) {

    options = options || {};
    options.railClass = (options.railClass ? options.railClass + ' ' : '') + 'sticky-header-rail';

    var $window = $(window);
    var $elem = $(elem);
    $elem.data('SmartStickyHeader', true).css({'pointer-events':'all'});
    var railId = 'ssh' + (++count);

    var width, height, offset, $rail, $replacement , $shadow;

    var lastScroll;
    var scrollHandler = function(){
      if (!$rail || !exists()) {
        return;
      }

      lastScroll = lastScroll || 0;
      // avoid negative values when scroll bouncing (eg. safari)
      var scroll = Math.max(0, $(window).scrollTop());
      var diff = scroll - lastScroll;
      lastScroll = scroll;

      // if header has a top margin, only reveal it when visible at the top
      var marginTop = parseInt($elem.css('margin-top'));

      var railScrollTop = $rail.scrollTop() + diff;
      railScrollTop = Math.max(Math.min(scroll, marginTop), railScrollTop);
      $rail.scrollTop(railScrollTop);
    };

    var resizeHandler = debounce(function(){
      unmount();
      init();
    }, 500);

    init();

    $window.on('scroll', scrollHandler);
    $window.on('resize', resizeHandler);
    $window.on('orientationchange', resizeHandler);

    function init() {
      setTimeout(function() { mount(100); }, 50);
    }

    function mount(times) {
      if ($elem.height() <= 0 && times > 0) {
        return setTimeout(function(){ mount(--times); }, 50);
      }

      offset = $elem.offset();
      width = $elem.outerWidth();
      height = $elem.outerHeight(true);

      $rail = $('<div id="' + railId + '" class="' + options.railClass + '"></div>').css({
        top:0,
        padding:0,
        left: offset.left + 'px',
        width: width + 'px',
        height: height + 'px',
        overflow:'hidden',
        position:'fixed',
        'pointer-events': 'none'
      });

      $shadow = $('<div class="sticky-header-shadow"></div>').css({
        height: height + 'px',
        'pointer-events': 'none'
      });

      $replacement = $('<div class="sticky-header-replacement"></div>').css({
        height: height + 'px'
      });

      $elem.before($replacement);
      $elem.before($rail);
      $rail.append($elem);
      $rail.append($shadow);

      setTimeout(scrollHandler,10);
    }

    function unmount() {
      $replacement.remove();
      $rail.replaceWith($elem);
    }

    function exists() {
      if($('#'+railId).length)  {
        return true;
      }
      $window.off('scroll', scrollHandler);
      $window.off('resize', resizeHandler);
      $window.off('orientationchange', resizeHandler);
      return false;
    }

    function debounce(func, milliseconds) {
      var args, self, debouncing=0;
      return function() {
        debouncing++;
        args = Array.prototype.slice.call(arguments);
        self = this;
        if (debouncing===1) {
          executeFunc(0);
        }
      };
      function executeFunc(current) {
        if(current===debouncing) {
          func.apply(self, args);
          debouncing=0;
        } else {
          setTimeout(function(){ executeFunc(debouncing); }, milliseconds);
        }
      }
    }
  };

  $.fn.smartStickyHeader = function(options) {
    return this.each(function() {
      return $.SmartStickyHeader(this, options);
    });
  };
})(jQuery);
