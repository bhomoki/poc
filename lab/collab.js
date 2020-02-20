
var labeler = function () {

    "use strict";

    var canvas = new fabric.Canvas('canvas');
    canvas.defaultCursor = 'crosshair';
    var newObj = false;
    var currentObj;
    var shape;
    var $ = function(id){return document.getElementById(id)};
    //https://jooinn.com/images/vehicles-on-road-2.jpg

    var bindToolButtonEvents = function () {
        var buttons = document.querySelectorAll('.tools button');
        for (var i = 0; i < buttons.length; i++) {
            var aButton = buttons[i];
            if (aButton.classList.value.indexOf('shape') > -1) {
                aButton.onclick = function() {
                    for (var j = 0; j < buttons.length; j++) {
                        buttons[j].classList.value = buttons[j].classList.value.replace(' selected', '');
                    };
                    shape = this.id;
                    this.classList.value += ' selected';
                };
            };
            if (aButton.id == 'reset')
                aButton.onclick = function(){resetZoomPan()};
            if (aButton.id == 'bin')
                aButton.onclick = function(){deleteObj()};
        }
    };
    bindToolButtonEvents();

    var loadImage = function () {
        fabric.Image.fromURL('test2.png', function(img) {
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: canvas.width / img.width,
                scaleY: canvas.height / img.height
            });
        });
    };
    
    var resetZoomPan = function () {
        canvas.viewportTransform[4] = 0;  //panning x
        canvas.viewportTransform[5] = 0;  //panning y
        canvas.setZoom(1);
        canvas.requestRenderAll();
    };

    var deleteObj = function () {
        var activeObj = canvas.getActiveObject();
        if (activeObj) {
            canvas.remove(activeObj);
            canvas.setActiveObject(null);
            $('bin').disabled = true;
        };
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



    var initDrawing = function (options) {
        console.log('INIT DRAWING');
        var startY = options.e.offsetY,
            startX = options.e.offsetX;
        var startP = transFormP({x: startX, y: startY});
        var localObj;

        if (shape == 'rect') {
            localObj = new fabric.Rect({
                top : startP.y,
                left : startP.x,
                width : 0,
                height : 0,
                fill : 'rgba(255, 165, 0, .5)'
                //stroke: 'orange',
                //strokewidth: 1
            });
            canvas.add(localObj);
            currentObj = localObj;
        };
        if (shape == 'circle') {
            localObj = new fabric.Ellipse({
                top : startP.y,
                left : startP.x,
                originX: 'left', 
                originY: 'top',
                rx: 0,
                ry: 0,
                radius : 0,
                fill : 'rgba(255, 165, 0, .5)'
                //stroke: 'orange',
                //strokewidth: 1
            });
            canvas.add(localObj);
            currentObj = localObj;
        };
        if (shape == 'triangle') {
            localObj = new fabric.Triangle({
                top : startP.y,
                left : startP.x,
                width : 0,
                height : 0,
                fill : 'rgba(255, 165, 0, .5)'
                //stroke: 'orange',
                //strokewidth: 1
            });
            canvas.add(localObj);
            currentObj = localObj;
        };
        if (currentObj) {
            newObj = true;
            currentObj.startP = startP;
            currentObj.on('selected', function() {
                if (localObj) canvas.setActiveObject(localObj);
                newObj = false;
            });
        };
    };


    var init = function() {
        loadImage();

        canvas.on('mouse:move', function(options) {
            console.log('MOUSE MOVE');
            var e = options.e;

            //crosshair
            /*line1.set('x1', e.offsetX).set('x2', e.offsetX);
            line2.set('y1', e.offsetY).set('y2', e.offsetY);*/
            var pointer = canvas.getPointer(e);
            var posx = pointer.x;
            var posy = pointer.y;
            line1.set('x1', posx).set('x2', posx).setCoords();
            line2.set('y1', posy).set('y2', posy).setCoords();

            //panning
            if (this.isDragging) {
                console.log('DRAGGING');
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
                console.log('SHAPESETTING');
                var offsetP = transFormP({x: e.offsetX, y: e.offsetY});
                if (shape == 'rect' && currentObj) {
                    currentObj.set('width', offsetP.x - currentObj.startP.x);
                    currentObj.set('height', offsetP.y - currentObj.startP.y);
                    currentObj.setCoords();
                };
                if (shape == 'circle' && currentObj) {
                    var xDiff = (offsetP.x - currentObj.startP.x) / 2;
                    var yDiff = (offsetP.y - currentObj.startP.y) / 2;
                    var oX = xDiff < 0 ? 'right' : 'left';
                    var oY = yDiff < 0 ? 'bottom' : 'top';
                    currentObj.set('originX', oX).set('originY', oY);
                    currentObj.set('rx', Math.abs(xDiff)).set('ry', Math.abs(yDiff));
                    currentObj.setCoords();
                };
                if (shape == 'triangle' && currentObj) {
                    currentObj.set('width', offsetP.x - currentObj.startP.x);
                    currentObj.set('height', offsetP.y - currentObj.startP.y);
                    currentObj.setCoords();
                };
            };

            this.requestRenderAll();
        });

        canvas.on('mouse:down', function (options) {
            console.log('MOUSE ||| DOWN');
            //code for dragging
            var evt = options.e;
            if (evt.altKey === true) {
                this.isDragging = true;
                //this.selection = false;
                this.lastPosX = evt.clientX;
                this.lastPosY = evt.clientY;
                return
            };
   
    
            // code for drawing and selecting
            if (options.target) {
                console.log(41, options.target.type, options.target);
                console.log(options.target.type);
                newObj = false;
                return;
            } 
            else {
                initDrawing(options);
            }
        });
    
        canvas.on('mouse:up', function (options) {
            console.log('MOUSE //////// UP');
            //code for dragging
            this.isDragging = false;
            //this.selection = true;
    
            if (options.target) {
                console.log(options.target.type, options.target);
            };
    
            // code for drawing and selecting
            var activeObj = canvas.getActiveObject();
            if (newObj && activeObj) {
                if (activeObj.width == 0 || activeObj.height == 0) {
                    deleteObj();
                }
            };
            newObj = false;
            $('bin').disabled = !activeObj;
        });
    
        canvas.on('mouse:wheel', function(options) {
            var delta = parseInt(0 - options.e.deltaY);
            var pointer = canvas.getPointer(options.e);
            var zoom = canvas.getZoom();
            zoom += (delta / 300);
            if (zoom > 20) zoom = 20;
            if (zoom <= 1) {zoom = 1; resetZoomPan()};
            zoom = +(Math.round(parseFloat(zoom) + "e+2") + "e-2");
            canvas.zoomToPoint({ x: options.e.offsetX, y: options.e.offsetY }, zoom);
            options.e.preventDefault();
            options.e.stopPropagation();
        });
    
        document.addEventListener("keydown", function(event) {
            if (event.key === "Delete") {
                deleteObj()
            }
        });
    };

    init();

    self.resetZoomPan = resetZoomPan;
    self.deleteObj = deleteObj;
    return self;
}();