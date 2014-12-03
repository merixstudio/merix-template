define('site', ['jquery', 'nebula/viewport', 'nebula/smart_blocks', 'translate', 'media_set', 'scrollbar', 'widgets/accordions', 'widgets/file_field', 'widgets/modal', 'widgets/equal_height', 'widgets/slider'], function(jQuery, viewport, smartBlocks, translate, mediaSet, scrollbar, accordions, fileField, modal, equalHeight, Slider) {
    'use strict';

    function Site() {
        viewport.enable();
        smartBlocks.enable();
        
        viewport.onChange.connect(function() {
            // Put there code to be executed when viewport is changed
        });
        
        this.parseContent(document.body);
    }

    Site.prototype.parseContent = function(root) {
        function find(selector) {
            return jQuery(root).is(selector) ? jQuery(root) : jQuery(root).find('*').filter(selector);
        }
        
        /* Mobile menu */
        this.createMobileMenu();
        
        /* Media Set */
        find('script[type="image/mx-media-set"]').each(mediaSet);
        
        /* Equal height */
        find('[data-equal-height-group]').each(equalHeight.handler);
        
        /* Forms */
        find('select').selectField();
        find('input:file').fileField();
        find('textarea').scrollbar();
        find('.input-count').inputCount('.text-count', 140);

        /* Modal */
        find('.modal-open').click(function(event) {
            event.preventDefault();
            jQuery.ajax({
                'url': jQuery(this).attr('href'),
                'data': null,
                'dataType': 'html',
                'success': function(response) {
                    jQuery('.box-modal').remove();
                    jQuery('body').append(response);
                    modal.open(jQuery('.box-modal'));
                }
            });
        });
        
        /* Slider */
        find('.slider:not(.slider-thumbnails .slider)').each(function() {
            var element = jQuery(this);
            var sliderHome = element.parent();
            var sliderWidth = element.width();
            var slider = new Slider(element, {
                'unit': '%',
                'mode': Slider.MODE_CAROUSEL
            });
            
            if (slider.itemState.length > 1) {
                var navigation = '<a href="#" class="icon-arrow-left slider-navigation previous"></a><a href="#" class="icon-arrow-right slider-navigation next"></a>';
                sliderHome.append(navigation);
                sliderHome.addClass('navigations');
            }
            
            sliderHome.find('.slider-navigation').each(function() {
                jQuery(this).click(function(event) {
                    event.preventDefault();

                    var navigationLink = jQuery(this);
                    if (navigationLink.hasClass('previous'))
                        slider.next();
                    else if (navigationLink.hasClass('next'))
                        slider.previous();
                });
            });
        });
        
        /* -------------------- */
        
        /* Put own scripts here */
        
        
        
        /* -------------------- */
        
        equalHeight.updateAll();
        smartBlocks.updateTree(root);
    };

    Site.prototype.createMobileMenu = function() {
        jQuery('.mobile-menu').html('\
            <a class="icon-menu text-hide">Menu</a>\
            <nav>' +
                jQuery('.page-header .main-menu').clone().html()
            + '</nav>\
        ');
        jQuery('.mobile-menu .icon-menu').click(function(event) {
            event.preventDefault();
            var button = jQuery(this);
            
            if (!button.hasClass('active')) {
                button.addClass('active');
                jQuery('.mobile-menu nav').stop(true, true).slideDown();
            } else {
                button.removeClass('active');
                jQuery('.mobile-menu nav').stop(true, true).slideUp();
            }
            
        });
    }

    return Site;
});
