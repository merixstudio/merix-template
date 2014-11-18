/*
 * Add file name to styled file input
 *
 * require module: find(element).fileField();
 */
define('widgets/file_field', ['jquery', 'translate'], function(jQuery, translate) {
    function getFilename(path) {
        var lastSep = path.lastIndexOf('/');
        if (lastSep < 0)
            lastSep = path.lastIndexOf('\\');
        return path.substring(lastSep + 1);
    }

    function updateFilename(event, element) {
        if (typeof element === 'undefined')
            element = jQuery(this);
        var fileName = getFilename(element.val() || translate('no_file'));
        element.next().html(fileName);
    }

    function init(element) {
        element.parent().append('<span class="file-name"/>');
        updateFilename(null, element);
        element.change(updateFilename);
    }

    jQuery.fn.fileField = function() {
        init(this);
    	return this;
    };

    return {
        'init': init,
        'updateFilename': updateFilename
    };
});
