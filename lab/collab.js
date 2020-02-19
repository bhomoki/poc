var labeler = function () {

    "use strict";

    var canvas = new fabric.Canvas('canvas');
    canvas.defaultCursor = 'crosshair';
    var newObj = false;
    var currentObj = null;
    var shape = 'rect';
    var $ = function(id){return document.getElementById(id)};
    //https://jooinn.com/images/vehicles-on-road-2.jpg

    var loadImage = function () {
        fabric.Image.fromURL('test2.png', function(img) {
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: canvas.width / img.width,
                scaleY: canvas.height / img.height
            });
        });
    };
    
    var reset = function () {
        canvas.viewportTransform[4] = 0;  //panning x
        canvas.viewportTransform[5] = 0;  //panning y
        canvas.setZoom(1);
        canvas.requestRenderAll();
    };

    //crosshair
    var makeLine = function(coords) {
        return new fabric.Line(coords, {
          fill: 'orange',
          stroke: 'orange',
          strokeWidth: 1,
          selectable: false,
          evented: false,
        });
    };
    var line1 = makeLine([ canvas.width, 0, canvas.width, canvas.height ]),
        line2 = makeLine([ 0, canvas.height, canvas.width, canvas.height ]);
    canvas.add(line1);
    canvas.add(line2);

    var transFormP = function (p) {
        var transFormedP = fabric.util.transformPoint(p, fabric.util.invertTransform(canvas.viewportTransform))
        transFormedP.x = parseFloat(transFormedP.x.toFixed(1));
        transFormedP.y = parseFloat(transFormedP.y.toFixed(1));
        return transFormedP;
    };



    var drawing = function (options) {
        //console.log(options.e);
        var startY = options.e.offsetY,
            startX = options.e.offsetX;
        var startP = transFormP({x: startX, y: startY});

        if (shape == 'rect') {
            var rect = new fabric.Rect({
                top : startP.y,
                left : startP.x,
                width : 0,
                height : 0,
                fill : 'rgba(255, 165, 0, .5)',
                stroke: 'orange',
                strokewidth: 1
            });
            currentObj = rect;
            canvas.add(currentObj);
        };
        newObj = true;
        currentObj.startP = startP;
        currentObj.on('selected', function() {
            canvas.setActiveObject(rect);
            newObj = false;
            //console.log(rect);
        });
    };


    var init = function() {
        loadImage();

        canvas.on('mouse:move', function(options) {
            var e = options.e;

            //crosshair
            /*line1.set('x1', e.offsetX).set('x2', e.offsetX);
            line2.set('y1', e.offsetY).set('y2', e.offsetY);*/
            var pointer = canvas.getPointer(e);
            var posx = pointer.x;
            var posy = pointer.y;
            line1.set('x1', posx).set('x2', posx);
            line2.set('y1', posy).set('y2', posy);


            //panning
            if (this.isDragging) {
                var e = options.e;
                this.viewportTransform[4] += e.clientX - this.lastPosX;
                this.viewportTransform[5] += e.clientY - this.lastPosY;
                this.requestRenderAll();
                this.lastPosX = e.clientX;
                this.lastPosY = e.clientY;
                canvas.forEachObject(function(o) {
                    o.setCoords();
                });
            };

            if (newObj && currentObj) {
                var offsetP = transFormP({x: e.offsetX, y: e.offsetY});
                if (shape == 'rect' && currentObj) {
                    currentObj.set('width', offsetP.x - currentObj.startP.x);
                    currentObj.set('height', offsetP.y - currentObj.startP.y);
                    currentObj.setCoords();
                }
            };

            this.requestRenderAll();
        });

        canvas.on('mouse:down', function (options) {
            //code for dragging
            var evt = options.e;
            if (evt.altKey === true) {
                this.isDragging = true;
                this.selection = false;
                this.lastPosX = evt.clientX;
                this.lastPosY = evt.clientY;
                return
            };
   
    
            // code for drawing and selecting
            if (options.target) {
                //console.log(options.target.type, options.target);
                newObj = false;
                return;
            } 
            else {
                drawing(options);
            }
        });
    
        canvas.on('mouse:up', function (options) {
            //code for dragging
            this.isDragging = false;
            this.selection = true;
    
    
            // code for drawing and selecting
            var activeObj = canvas.getActiveObject();
            if (newObj && activeObj) {
                //canvas.requestRenderAll();
                if (activeObj.width == 0 || activeObj.height == 0) {
                    canvas.remove(activeObj);
                }
            };
            newObj = false;
        });
    
        canvas.on('mouse:wheel', function(options) {
            var delta = parseInt(0 - options.e.deltaY);
            var pointer = canvas.getPointer(options.e);
            var zoom = canvas.getZoom();
            zoom += (delta / 300);
            if (zoom > 20) zoom = 20;
            if (zoom < 1) zoom = 1;
            zoom = +(Math.round(parseFloat(zoom) + "e+2") + "e-2");
            canvas.zoomToPoint({ x: options.e.offsetX, y: options.e.offsetY }, zoom);
            //canvas.requestRenderAll();
            options.e.preventDefault();
            options.e.stopPropagation();
        });
    
        document.addEventListener("keydown", function(event) {
            if (event.key === "Delete" && canvas.getActiveObject()) {
                canvas.remove(canvas.getActiveObject());
            }
        });
    };

    init();

    self.reset = reset;
    return self;
}();