import jQuery from 'jQuery';
window.$ = window.jQuery = jQuery;

class Site {
    constructor() {
        this.root = document.body;
        this.parseContent(this.root);
    }

    find(selector) {
        return jQuery(this.root).is(selector) ? jQuery(this.root) : jQuery(this.root).find(selector);
    }

    parseContent(root) {
        this.root = root;
    }
}

new Site();
