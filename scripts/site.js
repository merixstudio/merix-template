;(function () {
    'use strict';

    var jQuery = require('jquery');
    var viewport = require('./utilities/viewport');
    var smartBlocks = require('./utilities/smart_blocks');
    var detect = require('./utilities/detect');
    var hoverTap = require('./utilities/hover_tap');
    var lightbox = require('./widgets/lightbox');
    var inputCount = require('./widgets/input_count');
    var selectField = require('./widgets/select_field');
    var translate = require('./utilities/translate');
    var mediaSet = require('./utilities/media_set');
    var equalHeight = require('./widgets/equal_height');
    var modal = require('./widgets/modal');
    var Slider = require('./widgets/slider');
    var tabs = require('./widgets/tabs');
    var accordions = require('./widgets/accordions');
    var scrollbar = require('./widgets/scrollbar');
    var validate = require('./widgets/validate');
    var fileField = require('./widgets/file_field');
    var placeholders = require('./widgets/placeholder');

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

        find('[data-hover]').hoverTap();
        find('[data-lightbox]').lightbox();

        find('.tabs').tabs();

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
        find('[placeholder]').placeholders();
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
        find('.slider').each(function() {
            new Slider(jQuery(this), {
                'mode': Slider.MODE_CAROUSEL
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
    new Site();
}());
