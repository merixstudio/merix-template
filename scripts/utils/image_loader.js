module.exports =  function() {
  var jQuery = require('jquery');
  var image = jQuery(this);
  var parent = image.parent();

  if (image.attr('src') || image.is(':hidden'))
      return;

  parent.addClass('loading');
  //image.css('opacity', 0);
  image.load(function() {
      image.animate({'opacity': 1}, 500, function() {
          parent.removeClass('loading');
      });
  });
  image.attr('src', image.attr('data-src'));
  //jQuery('[data-media-fallback]').hide();
};
