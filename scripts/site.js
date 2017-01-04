import 'babel-polyfill';
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

class Site {
    constructor() {
        this.parseContent();
    }

    find(selector) {
        return this.root.matches(selector) ? [this.root] : this.root.querySelectorAll(selector);
    }

    parseContent(root = document.body) {
        this.root = root;

        this.find('.page-wrapper').forEach((el) => {
            console.log(el);
        });
    }
}

new Site();
