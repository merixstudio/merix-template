/*
 * Styleable scrollbar.
 */
jQuery.fn.scrollbar = function(options) {
    options = get(options, {});

    return this.each(function() {
        var $div = jQuery(this);

        // Check if scrollbar was already initialized.
        if ($div.data('custom-scrollbar')) {
            // Method call, update scrollbar dimensions, etc.
            $div.data('custom-scrollbar').update();
            return;
        }

        var $clip = $div.wrap('<div class="scroll-clip"><div><div/></div></div>').closest('div.scroll-clip');

        // In IE7 there is a bug that prevents system scrollbar from hiding
        if (!($.browser.msie && $.browser.version < 8))
            $div.parent().css('height', '100%');

        // Push system scrollbar out of the box
        $div.parent().css('margin-right', -jQuery.getScrollbarWidth());

        var $scrollbar = jQuery('<p class="scrollbar"/>').prependTo($clip);
        var $scrollUp = jQuery(get(options.upHtml, '<a class="scroll-up"/>')).appendTo($scrollbar);
        var $handle = jQuery(get(options.handleHtml, '<a class="handle"><span class="handle-top"></span><span class="handle-bottom"></span></a>')).appendTo($scrollbar);
        var $scrollDown = jQuery(get(options.downHtml, '<a class="scroll-down"/>')).appendTo($scrollbar);

        var handleHeight = 0;
        var handleMaxHeight = 0;
        var scrollHeight = 0;
        var scrollStep = 0;
        var clipHeight = 0;
        var scrollTop = 0;
        var scrollMaxTop = 0;
        var timeout = 0;
        var pixelsY = 0;

        function setScrollTop(y) {
            scrollTop = Math.min(Math.max(0, y), scrollMaxTop);
            $div.scrollTop(Math.ceil(scrollTop));
        }

        function updateScrollbar() {
            clipHeight = $clip.outerHeight();
            scrollHeight = Math.max(clipHeight, $div[0].scrollHeight);

            handleMaxHeight = clipHeight - $scrollUp.outerHeight(true) - $scrollDown.outerHeight(true);
            handleHeight = Math.floor(handleMaxHeight * clipHeight / scrollHeight);

            scrollMaxTop = scrollHeight - clipHeight;
            scrollStep = 10;

            $scrollbar.toggleClass('hidden', scrollMaxTop == 0);
            $handle.css('height', handleHeight + 'px');
        }

        function updateHandle() {
            var top = $scrollUp.outerHeight(true);
            $handle.css('top', (top + pixelsY) + 'px');
        }

        $scrollUp.mousedown(function(e) {
            e.preventDefault();
            e.stopPropagation();
            setScrollTop(Math.max(0, scrollTop - scrollStep));
            updateHandle();
            // Repeat if mouse is down
            timeout = setTimeout(function() {
                $scrollUp.mousedown();
            }, 50);
        }).mouseup(function(e) {
            clearTimeout(timeout);
        });

        $scrollDown.mousedown(function(e) {
            e.preventDefault();
            e.stopPropagation();
            setScrollTop(Math.min(scrollMaxTop, scrollTop + scrollStep));
            updateHandle();
            // Repeat if mouse is down
            timeout = setTimeout(function() {
                $scrollDown.mousedown();
            }, 50);
        }).mouseup(function(e) {
            clearTimeout(timeout);
        });

        $div.scroll(function(e) {
            scrollTop = $div.scrollTop();

            var percentY = $div.scrollTop() / scrollMaxTop;
            pixelsY = Math.min(handleMaxHeight - handleHeight, Math.floor(percentY * (handleMaxHeight - handleHeight)));
            updateHandle();
        });

        // Handle events
        $handle.each(function() {
            var drag = false;
            var clickY = 0;

            $handle.mousedown(function(e) {
                e.preventDefault();
                e.stopPropagation();
                drag = true;
                clickY = Math.floor(Math.min(Math.max(0, e.pageY - $handle.offset().top), $handle.offset().top));
            });

            jQuery(document).mousemove(function(e) {
                e.preventDefault();

                if (!drag)
                    return;

                var percentY = e.pageY - $div.offset().top - $scrollUp.outerHeight(true);
                percentY = Math.max(0, Math.min(handleMaxHeight, percentY - clickY));
                pixelsY = Math.min(handleMaxHeight - handleHeight, Math.floor(percentY));
                setScrollTop((percentY / (handleMaxHeight - handleHeight)) * scrollMaxTop);
            });

            jQuery(document).mouseup(function(e) {
                drag = false;
            });
        });

        // Scroll and move handle when user clicks on the scrollbar but not
        // the handle or arrows
        $scrollbar.mousedown(function(e) {
            var y = e.pageY - $div.offset().top - $scrollUp.outerHeight(true);
            var newScrollTop = (y / (handleMaxHeight - handleHeight)) * (scrollHeight - clipHeight);
            setScrollTop(newScrollTop);
            updateHandle();
        });

        $div.update = function() {
            updateScrollbar();
            updateHandle();
            $div.scroll();
        };

        // Initial update
        $div.update();

        // Update scrollbar when images load
        $div.find('img').load(function() {
            $div.update();
        });

        jQuery(window).resize(function() {
            $div.update();
        });

        // Save scrollbar object with external methods to an HTML element
        $div.data('custom-scrollbar', $div);
    });
};
