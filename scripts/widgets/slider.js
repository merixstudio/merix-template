/*
 * HTML settings usage: data-settings="'arrows': false, 'dots': false"
 */
define('widgets/slider', ['jquery', 'numbers', 'settings', 'gestures', 'nebula/signal'], function(jQuery, numbers, settings, gestures, Signal) {
    
    gestures.enable();
    
    // Check for transform support;
    var cssTransform;
    var prefixes = ['transform', '-webkit-transform', '-ms-transform'];

    for (var i = 0; i < prefixes.length; i++)
        if (typeof document.body.style[prefixes[i]] != 'undefined')
            cssTransform = prefixes[i];


    function Slider(element, options) {
		var htmlSettings = {};
        if (element.data('settings'))
            htmlSettings = jQuery.parseJSON('{' + jQuery(element).data('settings').replace(new RegExp('(\')', 'g'), '"') + '}');
        
        jQuery.extend(true, this, Slider.DEFAULT_SETTINGS, options, htmlSettings);

        this.element = element;
        this.items = this.element.find('>.slide'); // Items in the slider.
        this.count = this.items.length; // Count of items in the slider.
        this.destination = this.position;
        this.tempAuto = this.auto;

        this.itemState = [];
        for (var i = 0; i < this.count; i++)
            this.itemState.push(i);

        this.animated = false;
        
        this.items.wrapAll('<div class="slider-container"></div>');
        this.container = this.element.children('.slider-container');

        if (this.auto)
            this.enableAuto();
        
        this.sliderTouch();
        
        if (this.arrows)
            this.createArrows();
        
        if (this.dots)
            this.createDots();
        
        this.onChangeSlide = new Signal();
        
    }

    Slider.MODE_DEFAULT = 'default';
    Slider.MODE_CAROUSEL = 'carousel';

    Slider.DEFAULT_SETTINGS = {
        'itemIndex': 0,
        'itemSize': 100,  // Usually width of one slide (or height in case of vertical slider).
        'perPage': 1, // Number of slides per page. Can be 1 to N, where N <= this.count.
        'step': 1,
        'ease': 0.2, // Speed of animation, smaller value is faster.
        'unit': '%', // 'px'
        'arrows': true,
        'dots': true,
        'auto': true,
        'autoInterval': 5000,
        'animatedProperty': 'left',
        'minCount': 1,
        'mode': Slider.MODE_DEFAULT,
        'position': 0,
        'takeShortcuts': true
    };

    Slider.prototype.render = function() {
        var x = 0;
        var y = 0;
        var css = {};
        var list = this.container;

        if (this.animatedProperty == 'left' || this.animatedProperty == 'top') {
            if (this.animatedProperty == 'left')
                x = this.position;

            if (this.animatedProperty == 'top')
                y = this.position;

            css[cssTransform] = 'translate(' + x + this.unit + ', ' + y + this.unit + ')';
        } else
            css[this.animatedProperty] = Math.round(this.position) + this.unit;

        list.css(css);
    };

    Slider.prototype.animate = function(instant) {
        var newItemIndex;

        this.animated = true;

        if (this.position == this.destination) {
            this.animated = false;
            return;
        }
        
        if (instant)
            this.position = this.destination;

        var distance = this.destination - this.position;

        if (Math.abs(distance) < (this.unit == '%' ? 0.01 : 1))
            this.position = this.destination;
        else
            this.position += Math.abs(distance) * this.ease * numbers.sign(distance);

        //Carousel mode required moving slider elements from beginning to the end and vice versa.
        if (this.mode == Slider.MODE_CAROUSEL) {
            if (distance < 0 && this.position <= -this.itemSize)
                this.append();

            if (distance > 0 && this.position > 0)
                this.prepend();

            newItemIndex = numbers.mod(this.itemState[0] + Math.round(-this.position / this.itemSize), this.count);
        } else
            newItemIndex = Math.round(-this.position / this.itemSize);

        if (typeof newItemIndex != 'undefined' && newItemIndex != this.itemIndex) {
            this.itemIndex = newItemIndex;
            this.onChangeSlide.send(this.itemIndex);
            this.update();
        }
        
        // Actually move the slider elements.
        this.render();

        if (this._timer)
            clearTimeout(this._timer);
        this._timer = setTimeout(this.animate.bind(this), 33);
        
        
    };

    Slider.prototype.append = function() {
        this.position += this.itemSize;
        this.destination += this.itemSize;

        this.itemState.push(this.itemState.shift());

        var elements = this.element.find('.slide');
        elements.first().insertAfter(elements.last());
    };

    Slider.prototype.prepend = function() {
        this.position -= this.itemSize;
        this.destination -= this.itemSize;

        this.itemState.unshift(this.itemState.pop());

        var elements = this.element.find('.slide');
        elements.last().insertBefore(elements.first());
    };

    Slider.prototype.next = function() {
        var newItemIndex, position;

        if (this.mode == Slider.MODE_DEFAULT) {
            newItemIndex = Math.min(this.itemIndex + this.step, this.count);

            if (newItemIndex == this.itemIndex)
                return;

            position = this.destination + (newItemIndex - this.itemIndex) * this.itemSize;
        } else
            position = this.destination + this.step * this.itemSize;

        this.slideTo(position);
    };

    Slider.prototype.previous = function() {
        var newItemIndex, position;

        if (this.mode == Slider.MODE_DEFAULT) {
            newItemIndex = Math.max(0, this.itemIndex - this.step);

            if (newItemIndex == this.itemIndex)
                return;

            position = this.destination - (this.itemIndex - newItemIndex) * this.itemSize;
        } else
            position = this.destination - this.step * this.itemSize;

        this.slideTo(position);
    };

    Slider.prototype.slideTo = function(position) {
        if (this.tempAuto && this.auto)
            this.disableAuto();
        
        this.destination = position;
        this.animate();
        
        if (!(this.tempAuto) && this.auto)
            this.enableAuto();
    };

    Slider.prototype.slideToIndex = function(index) {
        var position;
        var half = this.itemState.length / 2;

        if (this.mode == Slider.MODE_DEFAULT)
            position = -index * this.itemSize;
        else {
            for (var i = 0; i < this.itemState.length; i++) {
                if (index == this.itemState[i]) {
                    if ((this.takeShortcuts && i < half) || index > this.itemIndex)
                        position = -i * this.itemSize;
                    else if ((this.takeShortcuts && i > half) || index <= this.itemIndex)
                        position = (this.itemState.length-i) * this.itemSize;
                    break;
                }
            }
        }
        
        this.slideTo(position);
    };
    
    Slider.prototype.createArrows = function() {
        var self = this;
        if (this.itemState.length > 1) {
                var navigation = '<button href="#" class="icon-arrow-left slider-navigation previous"></button><button href="#" class="icon-arrow-right slider-navigation next"></button>';
                this.element.append(navigation);
                this.element.addClass('navigations');
            }
            
            this.element.find('.slider-navigation').each(function() {
                jQuery(this).click(function(event) {
                    event.preventDefault();

                    var navigationLink = jQuery(this);
                    if (navigationLink.hasClass('previous'))
                        self.next();
                    else if (navigationLink.hasClass('next'))
                        self.previous();
                });
            });
    };
    
    Slider.prototype.createDots = function() {
        var self = this;
        if (this.itemState.length > 1) {
            var navigation = '<ul class="navigation-list grid">';
            for (var i = 0; i < this.itemState.length; i++) {
                if (i == 0)
                    navigation += '<li class="active"><button data-slide="'+i+'" /></li>';
                else
                    navigation += '<li><button data-slide="'+i+'" /></li>';
            }
            navigation += '</ul>';
            this.element.append(navigation);
            this.element.addClass('navigations');
            
            this.element.find('.navigation-list button').click(function(event) {
                event.preventDefault();
                var element = jQuery(this);
                var slideIndex = element.data('slide');

                self.slideToIndex(slideIndex);
            });
        }
    };
    
    Slider.prototype.enableAuto = function() {
        this.tempAuto = true;
        
        if (this.count <= this.perPage)
            return false;

        if (this._autoTimer)
            clearInterval(this._autoTimer);

        this._autoTimer = setInterval(this.previous.bind(this), this.autoInterval);
    };
    
    Slider.prototype.update = function() {
        var self = this;
        if (this.dots) {
            var dots = this.element.find('.navigation-list li');
            dots.removeClass('active');
            dots.eq(self.itemIndex).addClass('active');
        }
    };

    Slider.prototype.disableAuto = function() {
        this.tempAuto = false;
        
        if (this._autoTimer) {
            clearInterval(this._autoTimer);
            delete this._autoTimer;
        }
    };
    
    Slider.prototype.sliderTouch = function() {
        var self = this;
        
        gestures.onTouchMove(function(target, touch, event) {
            var sliderChild = jQuery.contains(self.element[0], target);
            
            if (sliderChild)
                if (Math.abs(touch.dx) > Math.abs(touch.dy))
                    event.preventDefault();
        });

        gestures.onTouchEnd(function(target, touch, event) {
            var sliderChild = jQuery.contains(self.element[0], target);
            
            if (sliderChild) {
                if (touch.dx > 0 && touch.dx > 100)
                    self.next();
                else if (touch.dx < 0 && touch.dx < -100)
                    self.previous();
                
                event.stopPropagation();
            }
        });
    };

    jQuery.fn.slider = function(options) {
        return this.each(function() {
            new Slider(jQuery(this), options);
        });
    };

    return Slider;
});
