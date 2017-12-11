var LMI = LMI || {};
LMI.Appmatic = LMI.Appmatic || {};

LMI.Appmatic.CinematicTiles = function () {
    "use strict";
    var self = {},
        isPanelOn = false,
        tileW = 130,
        tileH = tileW,
        gap = 15,
        panelH = 410,
        sliderH = panelH + gap,
        columns = 0,
        rows = columns,
        selectedItem = null,
        panelOuter, panelSlider, panelInner, panelArrow, panelCloser,
        timerForResize, animtimer1, animtimer2, animtimer3, animtimer4,
        tilesContainer;


    function initContainerVars(tilesCont, tileDimensions) {
        tilesContainer = jQuery(tilesCont);
        panelOuter = jQuery('#panelOuter');
        panelSlider = panelOuter.find('#panelSlider');
        panelInner = panelOuter.find('#panelInner');
        panelArrow = panelOuter.find('#panelArrow');
        panelCloser = panelOuter.find('#panelCloser');        
        if (tileDimensions) {
            tileW = tileDimensions.tileW || tileW;
            tileH = tileDimensions.tileH || tileH;
            gap = tileDimensions.gap || gap;
            panelH = tileDimensions.panelH || panelH;
        }
        if (gap != 15)
            panelInner.css('marginTop', gap);
    };

    function updateDOM() {
        setupTileAttributes();

        if (isPanelOn)
            resetPositions()
    };
    
    function setupTileAttributes() {
        columns = Math.floor(tilesContainer.width() / (tileW + gap));
        rows = Math.ceil(tilesContainer.find('.tile').length / columns);
        
        var tileSerial = 0;
        
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++ ) {
                var tile = tilesContainer.find('.tile')[tileSerial];
                jQuery(tile).attr({'ptsr': tileSerial, 'row': i});
                jQuery(tile).css({'top': (i * (tileH + gap )) + 'px', 'left': (j * (tileW + gap )) + 'px'});
                tileSerial++;		
            }
        }
    };

    function resetPositions(quickly, autoscroll) {
        if (typeof(quickly) != "boolean")
            quickly = false;
        if (typeof(autoscroll) != "boolean")
            autoscroll = true;
        var newHeight = panelInner.height() + gap;
        sliderH = newHeight > panelH + gap ? newHeight : panelH + gap;
        setTilePositions();
        setPanelPosition(quickly, autoscroll);
    };

    function setTilePositions() {
        var si = getSelectedTile();
        var sr = Number(jQuery(si).attr('row'));
        var anyselected = typeof(sr) == "number";
        tilesContainer.find('.tile').each(function() {
            var row = Number(jQuery(this).attr('row'));
            var t = row * (tileH + gap);
            anyselected && (row > sr) ? jQuery(this).css('top', (t + sliderH) + 'px') : jQuery(this).css('top', t + 'px');
        });
    };

    function setPanelPosition(quickly, autoscroll) {
        var si = getSelectedTile();
        var sr = Number(jQuery(si).attr('row')); 
        var origpos = parseInt((panelOuter.css('top')));
        var pos = ((sr + 1) * (tileH + gap)) - gap;
        if (pos != origpos)
            panelOuter.css('top', pos + 'px');
        if (autoscroll) {
            clearTimeout(animtimer1);
            animtimer1 = setTimeout(scrollContainer, quickly ? 100 : 250);
        };
        clearTimeout(animtimer2);
        animtimer2 = setTimeout(setPanelArrowPosition, 1);
        animtimer2 = setTimeout(setPanelArrowPosition, 100);
        animtimer2 = setTimeout(setPanelArrowPosition, 250);
    };

    function overFlowOn() {
        panelSlider.addClass('on');

        panelSlider.height(panelInner.height() + gap);
        clearTimeout(animtimer4);
        animtimer4 = setTimeout(function() {panelSlider.height(panelInner.height() + gap)}, 50);
        animtimer4 = setTimeout(function() {panelSlider.height(panelInner.height() + gap)}, 100);
        animtimer4 = setTimeout(function() {panelSlider.height(panelInner.height() + gap); resetPositions(true)}, 150);

        clearTimeout(animtimer3);
        animtimer3 = setTimeout(function() {
            panelSlider.addClass('overflowvisible');
            resetPositions();
        }, 300);
    };

    function overFlowOff() {
        panelSlider.removeClass('on');
        panelSlider.height(0);
        clearTimeout(animtimer3);
        panelSlider.removeClass('overflowvisible');
    };

    function scrollContainer() {
            jQuery.fx.off = true;
            jQuery.fx.off = false;
            tilesContainer.animate({
                scrollTop: Math.round(parseFloat(panelOuter.css('top')) - tileH)
            }, 150);
    };

    function showPanel() {	
        if (!isPanelOn) {
            isPanelOn = true;
            panelOuter.removeClass('animate');
            overFlowOn();
            setTimeout(function() {panelOuter.addClass('animate')}, 1);
            resetPositions(true);
        }
        else
            setTimeout(resetPositions, 50);
    };
    
    function closePanel() {
        isPanelOn = false;
        selectedItem = null;
        overFlowOff();
        setTilePositions();
        removeTileHighlight();
        sliderH = panelH + gap;
    };

    function setPanelArrowPosition() {
        var si = getSelectedTile();
        var pos = parseInt(jQuery(si).css('left'));
        var arrowPos = pos + Math.round((tileW - 20)/2);
        panelArrow.css('left', arrowPos + 'px');
    };

    function tileClicked(which) {
        var si = Number(which.attr('ptsr'));
        if (si !== selectedItem) {
            selectedItem = si;
            showPanel();
            highlightSelectedTile();
        }
        else
            closePanel();
    };

    function getSelectedTile() {
        return tilesContainer.find('.tile')[selectedItem]
    };

    function highlightSelectedTile() {
            var si =  getSelectedTile();
            var sserial = Number(jQuery(si).attr('ptsr'));
            tilesContainer.find('.tile').each(function() {
                var tileSerial = Number(jQuery(this).attr('ptsr'));
                tileSerial === sserial ? jQuery(this).removeClass('opaque') : jQuery(this).addClass('opaque');
            });	
    };

    function removeTileHighlight() {
        tilesContainer.find('.tile').each(function() {
            jQuery(this).removeClass('opaque');
        });	
    };

    function onResize(repeat) {
        clearTimeout(timerForResize);
        timerForResize = setTimeout(updateDOM, 1);
        if (repeat) {
            timerForResize = setTimeout(updateDOM, 50);
            timerForResize = setTimeout(updateDOM, 100);
            timerForResize = setTimeout(updateDOM, 150);
            timerForResize = setTimeout(updateDOM, 280);
            timerForResize = setTimeout(updateDOM, 320);
            timerForResize = setTimeout(updateDOM, 350);
        }
    };

    function addResizeHandler() {
        jQuery(window).resize(onResize);
    };

    function bindAllClicks() {
        panelInner.click(function() {
            resetPositions(true, false);
        });
    };

    function onLoadTiles(tilesCont, tileDim) {
        initContainerVars(tilesCont, tileDim);
        updateDOM();
        addResizeHandler();
        bindAllClicks();
    };


    self.onLoadTiles = onLoadTiles;
    self.onResize = onResize;
    self.tileClicked = tileClicked;
    self.closePanel = closePanel;
    self.initContainerVars = initContainerVars;

    return self;
}();