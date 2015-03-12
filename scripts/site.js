define('site', ['jquery', 'nebula/viewport', 'nebula/smart_blocks', 'detect', 'hover2', 'translate'], function(jQuery, viewport, smartBlocks, detect, hover2, translate) {
    'use strict';
    
    // Delete if unused
    var mediaSet = require('media_set');
    var equalHeight = require('widgets/equal_height');
    var modal = require('widgets/modal');
    var Slider = require('widgets/slider');
    var accordions = require('widgets/accordions');
    var scrollbar = require('widgets/scrollbar');
    var validate = require('widgets/validate');
    var fileField = require('widgets/file_field');
    var placeholders = require('widgets/placeholder');

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
        
        find('[data-hover]').hover2();
        find('[data-lightbox]').lightbox();
        
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
        //find('[data-placeholder]').placeholders();
        find('form.validate').validate();
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
