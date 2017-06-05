import 'babel-polyfill';
import jQuery from 'jquery';

/* eslint-disable no-multi-assign */
window.$ = window.jQuery = jQuery;
/* eslint-enable no-multi-assign */

class Site {
  constructor() {
    this.parseContent();
  }

  find(selector) {
    return this.root.matches(selector) ?
      [this.root] :
      Array.from(this.root.querySelectorAll(selector));
  }

  parseContent(root = document.body) {
    this.root = root;

    this.find('.page-wrapper').forEach((el) => {
      /* eslint-disable no-console */
      console.log(el);
      /* eslint-enable no-console */
    });
  }
}

new Site();
