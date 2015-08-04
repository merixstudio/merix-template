'use strict';
var jQuery = require('jquery');
function ClickHandler(element, options) {

    jQuery(element).on('click tap ontouchstart', function(event){
        event.preventDefault();
        var fileFormats = ['.jpeg', '.jpg', '.png', '.bmp', '.gif'];
        var href = element.attr('href').slice(element.attr('href').lastIndexOf('.')).toLowerCase();
        if (jQuery.inArray(href, fileFormats)) {
            alert('No image');
            return;
        }
        new Lightbox(element, options)
    });

}

function Lightbox(element, options) {
    var self = this;

    this.$element = element;
    this.mainImageHref = element.attr('href');
    this.elementId = element.data('lightbox');
    this.galleryId = this.elementId || '';
    if (this.galleryId != null)
        this.items = jQuery('[data-lightbox="' + this.galleryId + '"]');

    this.currentItem = this.items.index(element);
    this.countItems = this.items.length;
    this.GalleryView = null;

    this.HtmlGallery =  jQuery('<div class="gallery-lightbox">\
                                    <div class="gallery-lightbox--overlay">\
                                        <div class="loader"></div>\
                                    </div>\
                                    <div class="gallery-lightbox--modal">\
                                        <div class="gallery-lightbox--image">\
                                            <p class="gallery-lightbox--counter">Image <span class="gallery-lightbox--image-current">0</span> of <span class="gallery-lightbox--image-all">0</span>\
                                            <div class="gallery-lightbox--image-wrapper">\
                                                <button class="gallery-lightbox--close icon-close"></button>\
                                                <button class="gallery-lightbox--prev icon-arrow-left"></button>\
                                                <button class="gallery-lightbox--next icon-arrow-right"></button>\
                                            </div>\
                                        </div>\
                                        <div class="gallery-lightbox--thumbs">\
                                            <div class="gallery-lightbox--thumbs-list">\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
    ');
       this.HtmlOverlay = this.HtmlGallery.find('.gallery-lightbox--overlay');
          this.HtmlView = this.HtmlGallery.find('.gallery-lightbox--modal');
         this.HtmlImage = this.HtmlGallery.find('.gallery-lightbox--image').hide();
     this.HtmlImageWrap = this.HtmlGallery.find('.gallery-lightbox--image-wrapper');
        this.HtmlThumbs = this.HtmlGallery.find('.gallery-lightbox--thumbs').hide();
   this.HtmlCloseButton = this.HtmlGallery.find('.gallery-lightbox--close');
   this.HtmlCurrentImage = this.HtmlGallery.find('.gallery-lightbox--image-current');
      this.HtmlAllImage = this.HtmlGallery.find('.gallery-lightbox--image-all');
     this.HtmlNextImage = this.HtmlGallery.find('.gallery-lightbox--next').hide();
     this.HtmlPrevImage = this.HtmlGallery.find('.gallery-lightbox--prev').hide();
    this.HtmlThumbsList = this.HtmlGallery.find('.gallery-lightbox--thumbs-list').appendTo(this.HtmlThumbs);


    this.options = jQuery.extend({},
    {
        'thumbs': false

    }, options || {});



    this._keyEvent = function(event) {
        event.preventDefault();

        //left arrow
        if (event.keyCode == 37){
            self.prevImage();
        }

        //right arrow
        if (event.keyCode == 39){
            self.nextImage();
        }

        //escape
        if (event.keyCode == 27){
            self.closeGallery();
        }
    }

    this.HtmlPrevImage.on('click', function(event) {
        event.preventDefault();
        self.prevImage();
    });
    this.HtmlNextImage.on('click', function(event) {
        event.preventDefault();
        self.nextImage();
    });


    jQuery('body').bind('keyup', this._keyEvent);
    this.openGallery(element);
}

Lightbox.prototype.createView = function() {
    this.GalleryView = this.HtmlGallery.appendTo('body');
}


Lightbox.prototype.getThumbs = function(element) {
    var html = '';
    var count = this.items.length;
    var width = 0;
    this.items.each(function() {
        var href = jQuery(this).attr('href');
        var src = jQuery(this).find('img').attr('src');
        var w = jQuery(this).outerWidth();
        html += '<a href="'+href+'"><img src="'+src+'"></a>';
        width += w;
    });
    this.HtmlThumbsList.width(width);
    if(this.items.length>1)
        return html;
}


Lightbox.prototype.openGallery = function(element) {

    var self = this;

    // if gallery modal exist
    if (this.GalleryView == null) {
        this.createView();

        jQuery('html').css({'overflow-y':'hidden'});

        this.GalleryView
                .delay(100)
                .stop(true)
                .animate({'opacity': 1}, 500, function(){
                    self.loadImage(element);
                });

        this.HtmlOverlay.on('click', function(event) {
            event.preventDefault();
            self.closeGallery();
        });
        this.HtmlCloseButton.on('click', function(event) {
            event.preventDefault();
            self.closeGallery();
        });
    }
}

Lightbox.prototype.closeGallery = function() {
    jQuery('body').unbind('keyup');
    this.GalleryView.delay(100)
                    .stop(true)
                    .fadeOut(500, function(){
                        jQuery(this).remove();
                        self.GalleryView = null;
                    });
        jQuery('html').css({'overflow-y':'scroll'});
}

Lightbox.prototype.loadImage = function(element) {
    var self = this;

    this.HtmlOverlay.find('.loader').fadeIn(250);
    this.HtmlCurrentImage.html(this.currentItem + 1);
    this.HtmlAllImage.html(this.items.length);
    var img = jQuery('<img src="' + element.attr('href') + '">');
    img.appendTo(this.HtmlImageWrap);

    if (this.options.thumbs && this.items)
        jQuery(this.getThumbs(element)).appendTo(this.HtmlThumbsList);

    if (this.countItems <= 1)
         this.HtmlGallery.find('.gallery-lightbox--counter').hide();

    img.load(function(){
        self.HtmlOverlay.find('.loader').fadeOut(250);
        self.HtmlImage.delay(300).fadeIn(500);

        if (self.currentItem > 0)
            self.HtmlPrevImage.show();
        else
            self.HtmlPrevImage.hide();

        if (self.currentItem < self.countItems - 1)
            self.HtmlNextImage.show();
        else
            self.HtmlNextImage.hide();

    });
}

Lightbox.prototype.prevImage = function() {
    var self = this;
    if (this.currentItem > 0) {
        this.currentItem--;
        this.HtmlImage.fadeOut(500, function() {
            self.HtmlImage.find('img').remove();
            self.loadImage(jQuery(self.items[self.currentItem]));
        });
    }
}

Lightbox.prototype.nextImage = function() {
    var self = this;
    if (this.currentItem < this.countItems - 1) {
        this.currentItem++;
        this.HtmlImage.fadeOut(500, function() {
            self.HtmlImage.find('img').remove();
            self.loadImage(jQuery(self.items[self.currentItem]));
        });
    }
}


jQuery.fn.lightbox = function(options) {
    return this.each(function() {
        new ClickHandler(jQuery(this), options);
    });
};

module.exports = Lightbox;
