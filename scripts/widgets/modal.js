define('widgets/modal', ['jquery', 'nebula/signal'], function(jQuery, Signal) {
    'use strict';

    /*
     * modal manager
     *
     * Wraps element with some div tags, adds 'no-scroll' class to body.
     */

    function stopPropagation(event) {
        event.stopPropagation();
    }

    function preventDefault(event) {
        event.preventDefault();
    }
    var modal = {};
    modal.onModalOpen = new Signal();

    modal._overlay = null;
    modal._options = null;
    modal._defaultOptions = {
        'openTime': 250,
        'closeTime': 250,
        'overlayOpacity': 0.8
    };

    modal.open = function(content, options) {
        modal.close();

        var overlay = content.wrap('<div class="overlay-content"/>').parent().wrap('<div class="overlay"/>').closest('.overlay');
        overlay.prepend('<div class="overlay-background"/>');

        var overlayBackground = overlay.find('.overlay-background');
        overlay.find('.overlay-content, .overlay-content .close').click(preventDefault).click(modal.close);

        if (!content.find('a.close').length)
            jQuery('<a href="#" class="close"/>').prependTo(content).click(preventDefault).click(modal.close);

        options = jQuery.extend({}, modal._defaultOptions, options);

        overlayBackground.css('opacity', 0).animate({'opacity': options.overlayOpacity}, options.openTime);
        content.css('opacity', 0).show().animate({'opacity': 1}, options.openTime);

        content.unbind('click').click(stopPropagation);

        modal._options = options;
        modal._overlay = overlay;

        modal.onModalOpen.send();

        jQuery('html').addClass('no-scroll');
        jQuery('body').css('margin-right', getScrollBarWidth());
        
        function getScrollBarWidth () {
            var inner = document.createElement('p');
            inner.style.width = "100%";
            inner.style.height = "200px";

            var outer = document.createElement('div');
            outer.style.position = "absolute";
            outer.style.top = "0px";
            outer.style.left = "0px";
            outer.style.visibility = "hidden";
            outer.style.width = "200px";
            outer.style.height = "150px";
            outer.style.overflow = "hidden";
            outer.appendChild(inner);

            document.body.appendChild (outer);
            var w1 = inner.offsetWidth;
            outer.style.overflow = 'scroll';
            var w2 = inner.offsetWidth;
            if (w1 == w2) w2 = outer.clientWidth;

            document.body.removeChild (outer);

            return (w1 - w2);
          };
    };

    modal.close = function() {
        if (!modal._overlay)
            return;
        var overlay = modal._overlay;
        overlay.children('.overlay-content').children().stop(true).animate({'opacity': 0}, modal._options.closeTime);
        overlay.children('.overlay-background').stop(true).animate({'opacity': 0}, modal._options.closeTime, function() {
            jQuery(this).remove();
            var content = overlay.children().children();
            content.unwrap().unwrap();
            content.hide();
            if (!modal._overlay) {
                jQuery('html').removeClass('no-scroll');
                jQuery('body').css('margin-right', 0);
            }
        });

        modal._options = null;
        modal._overlay = null;
    };

    return modal;
});
