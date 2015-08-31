"use strict";

window.$ = window.jQuery = require('jquery');

function Site() {
    this.parseContent(document.body);
}

Site.prototype.parseContent = function(root) {
    function find(selector) {
        return jQuery(root).is(selector) ? jQuery(root) : jQuery(root).find(selector);
    }
};

new Site();
