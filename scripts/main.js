
function main(root) {
    function finder(selector) {
        return jQuery(root).is(selector) ? jQuery(root) : jQuery(root).find('*').filter(selector);
    }

}


main(document.body);
