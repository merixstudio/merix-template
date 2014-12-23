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
        
        var self = this;
        
        /* Mobile menu */
        find('.mobile-menu').each(function() {
            self.createMobileMenu(jQuery(this));
        });
        
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

    Site.prototype.createMobileMenu = function(mobileMenu) {
        var mainMenu = mobileMenu.closest('.page-header').find('.main-menu');
        var mobileOpener = jQuery('<a class="icon-menu text-hide">Menu</a>').appendTo(mobileMenu);
        mobileMenu.append('\
            <nav>' +
                mainMenu.clone().html()
            + '</nav>\
        ');
        mobileOpener.click(function(event) {
            event.preventDefault();
            var button = jQuery(this);
            
            button.toggleClass('active');
            mobileMenu.find('nav').stop(true, true).slideToggle();
            
        });
    };

    return Site;
});
