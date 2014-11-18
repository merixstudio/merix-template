define('site', ['jquery', 'nebula/viewport', 'nebula/smart_blocks', 'translate', 'media_set', 'scrollbar', 'widgets/accordions', 'widgets/file_field', 'widgets/modal'], function(jQuery, viewport, smartBlocks, translate, mediaSet, scrollbar, accordions, fileField, modal) {
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
        
        /* Media Set */
        find('script[type="image/mx-media-set"]').each(mediaSet);
        
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
        
        /* Mobile menu */
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
        
        /* -------------------- */
        
        /* Put own scripts here */
        
        
        
        /* -------------------- */
        
        smartBlocks.updateTree(root);
    };

    return Site;
});
