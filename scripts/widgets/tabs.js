'use strict';
var jQuery = require('jquery');
var viewport = require('../utilities/viewport');

function Tabs(element) {
    var self = this;
    this.tabs = element;
    this.tabList = element.find('li');
    this.tabHeaders = element.find('dt');
    this.tabContents = element.find('dd');

    this.goToTab(0);

    this.tabs.find('ul button, dt button').on('click', function(event) {
        event.preventDefault();
        self.goToHandler(jQuery(this));
    });
};

Tabs.prototype.goToTab = function(id) {
    this.tabList.removeClass('active');
    this.tabHeaders.removeClass('active');

    if (typeof id === 'number') {
        this.tabList.eq(id).addClass('active');
        this.tabHeaders.eq(id).addClass('active');
    } else {
        this.tabs.find('[data-tab="' + id + '"]').parent().addClass('active');
    }
};

Tabs.prototype.goToHandler = function(current) {
    if (typeof current.data('tab') !== 'undefined') {
        this.goToTab(current.data('tab'));
    } else {
        this.goToTab(current.parent().index());
    }
};

jQuery.fn.tabs = function() {
    return this.each(function() {
        new Tabs(jQuery(this));
    });
};

module.exports = Tabs;
