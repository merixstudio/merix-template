define('gestures', ['nebula/signal'], function(Signal) {
    var EVENTS = {};

    EVENTS.START = 'touchstart';
    EVENTS.MOVE = 'touchmove';
    EVENTS.END = ['touchend', 'touchcancel'];

    if (window.PointerEvent) {
        EVENTS.START = 'pointerdown';
        EVENTS.MOVE = 'pointermove';
        EVENTS.END = 'pointerout';
    } else if (window.MSPointerEvent) {
        EVENTS.START = 'MSPointerDown';
        EVENTS.MOVE = 'MSPointerMove';
        EVENTS.END = 'MSPointerOut';
    }


    /*
     * Base API
     */
    function Api() {};

    Api.prototype.touches = {};
    Api.prototype.onTouchStart = new Signal();
    Api.prototype.onTouchMove  = new Signal();
    Api.prototype.onTouchEnd   = new Signal();

    Api.prototype.getEventTouches = function(event) {return []};
    Api.prototype.getTouchId = function(touch) {return 0};
    Api.prototype.getTouchX  = function(touch) {return 0};
    Api.prototype.getTouchY  = function(touch) {return 0};

    Api.prototype.sort = function(a, b) {
        return b.time - a.time;
    };

    Api.prototype.toList = function() {
        var results = [];
        for (var id in this.touches)
            results.push(this.touches[id]);
        return results.sort(this.sort);
    };

    Api.prototype.enable = function() {
        document.body.addEventListener(EVENTS.START, this.touchstart.bind(this));
        document.body.addEventListener(EVENTS.MOVE,  this.touchmove.bind(this));

        if (EVENTS.END instanceof Array) {
            for (var i = 0; i < EVENTS.END.length; i++)
                document.body.addEventListener(EVENTS.END[i], this.touchend.bind(this));
        } else
            document.body.addEventListener(EVENTS.END,   this.touchend.bind(this));
    };

    Api.prototype.disable = function() {
        document.body.removeEventListener(EVENTS.START, this.touchstart.bind(this));
        document.body.removeEventListener(EVENTS.MOVE,  this.touchmove.bind(this));

        if (EVENTS.END instanceof Array) {
            for (var i = 0; i < EVENTS.END.length; i++)
                document.body.removeEventListener(EVENTS.END[i], this.touchend.bind(this));
        } else
            document.body.removeEventListener(EVENTS.END,   this.touchend.bind(this));
    };

    Api.prototype.updateTouch = function(newTouch) {
        var id = this.getTouchId(newTouch);
        var touch = this.touches[id];
        var x = this.getTouchX(newTouch);
        var y = this.getTouchY(newTouch);
        touch.x = x;
        touch.y = y;
        touch.dx = touch.x - touch.sx;
        touch.dy = touch.y - touch.sy;
        return touch;
    };

    Api.prototype.touchstart = function(event) {
        var touches = this.getEventTouches(event);
        for (var i = 0; i < touches.length; i++) {
            var id = this.getTouchId(touches[i]);
            var x = this.getTouchX(touches[i]);
            var y = this.getTouchY(touches[i]);
            var touch = this.touches[id] = {
                'id': id,
                'x': x,
                'y': y,
                'sx': x,
                'sy': y,
                'dx': 0,
                'dy': 0,
                'time': Date.now(),
                'target': event.target
            };
            this.onTouchStart.send(event.target, touch, event);
        }
    };

    Api.prototype.touchmove = function(event) {
        var touches = this.getEventTouches(event);
        for (var i = 0; i < touches.length; i++) {
            var id = this.getTouchId(touches[i]);
            if (!this.touches[id])
                continue;
            this.onTouchMove.send(event.target, this.updateTouch(touches[i]), event);
        }
    };

    Api.prototype.touchend = function(event) {
        var touches = this.getEventTouches(event);
        for (var i = 0; i < touches.length; i++) {
            var id = this.getTouchId(touches[i]);
            if (!this.touches[id])
                continue;
            var touch = this.updateTouch(touches[i]);
            this.onTouchEnd.send(event.target, touch, event);
            delete this.touches[touch.id];
        }
    };



    /*
     * Touch API
     */
    function TouchApi() {}
    TouchApi.prototype = Object.create(Api.prototype);

    TouchApi.prototype.getEventTouches = function(event) {return event.touches.length ? event.touches : event.changedTouches};
    TouchApi.prototype.getTouchId = function(touch) {return touch.identifier};
    TouchApi.prototype.getTouchX = function(touch) {return touch.pageX};
    TouchApi.prototype.getTouchY = function(touch) {return touch.pageY};



    /*
     * Pointer API
     */
    function PointerApi() {}

    PointerApi.prototype = Object.create(Api.prototype);

    PointerApi.prototype.getEventTouches = function(event) {return [event]};
    PointerApi.prototype.getTouchId = function(pointer) {return pointer.pointerId};
    PointerApi.prototype.getTouchX = function(pointer) {return pointer.pageX};
    PointerApi.prototype.getTouchY = function(pointer) {return pointer.pageY};



    if (window.PointerEvent || window.MSPointerEvent)
        return new PointerApi();
    else
        return new TouchApi();
});
