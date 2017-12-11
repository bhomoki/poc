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
        rows = 0,
        columns = rows,
        selectedItem = null,
        panelOuter, panelSlider, panelInner, panelArrow, panelCloser, scrollShadow,
        timerForResize, animtimer3, animtimer4, animtimer5,
        tilesContainer,
        lastMinRow = -1, lastMaxRow = -1, lastColumns = -1,
        allTilesArray;


    function initContainerVars(tilesCont, tileDimensions) {
        jQuery.fx.off = false;
        tilesContainer = jQuery(tilesCont);
        allTilesArray = tilesContainer.find('.tile');
        panelOuter = jQuery('#panelOuter');
        panelSlider = panelOuter.find('#panelSlider');
        panelInner = panelOuter.find('#panelInner');
        panelArrow = panelOuter.find('#panelArrow');
        panelCloser = panelOuter.find('#panelCloser');
        scrollShadow = jQuery('#scrollShadow')
        if (tileDimensions) {
            tileW = tileDimensions.tileW || tileW;
            tileH = tileDimensions.tileH || tileH;
            gap = tileDimensions.gap || gap;
            panelH = tileDimensions.panelH || panelH;
        }
        if (gap != 15)
            panelInner.css('marginTop', gap);
    };
    
    function getViewportRows() {
        var tileHPlusGap = tileH + gap,
            scrollT = tilesContainer.scrollTop(),
            heightT = tilesContainer.height(),
            minTop = scrollT - tileH - panelH,
            maxTop = scrollT + heightT + panelH,
            minRow = Math.floor(minTop / tileHPlusGap),
            maxRow = Math.floor(maxTop / tileHPlusGap);

        if (minRow < 0) minRow = 0;
        if (maxRow > rows) maxRow = rows;

        return {'min': minRow, 'max': maxRow}
    };
    
    function getCoordinates(whichTile) {
        var currentRow = whichTile.attr('row'),
            currentIdx = whichTile.attr('tidx'),
            plusSlider = 0;
        
        if (isPanelOn) {
            if (currentRow > Number(getSelectedTile().attr('row')))
                plusSlider = sliderH;
        }

        return {top: (currentRow * (tileH + gap)) + plusSlider, left: (currentIdx - (currentRow * columns)) * (tileW + gap)}
    };

    function getCurrentSliderHeight() {
        return panelInner.height() + gap;
    };

    function setCurrentSliderHeight() {
        panelSlider.height(getCurrentSliderHeight())
    };

    function setupDom() {
        tilesContainer.height(jQuery(window).height() - tilesContainer.offset().top - jQuery('#footer').height());

        setupTileAttributes();

        if (isPanelOn)
            resetPositions();
    };
    
    function setupTileAttributes() {
        var tilesSum = allTilesArray.length,
            top,
            tileHPlusGap = tileH + gap,
            tileWPlusGap = tileW + gap,
            tileSerial = -1,
            row = 0,
            col = -1,
            displayClass,
            currentTile,
            visibleRows, minRow, maxRow;

        columns = Math.floor(tilesContainer.width() / tileWPlusGap);
        rows = Math.ceil(tilesSum / columns);
        visibleRows = getViewportRows();
        minRow = visibleRows.min;
        maxRow = visibleRows.max;
          
        allTilesArray.each(function() {
            tileSerial++;
            col++;
            if (col == columns) {
                col = 0;
                row++;
            };
            top = row * tileHPlusGap;
            displayClass = row >= minRow && row <= maxRow ? 'shown' : 'hidden';
            currentTile = jQuery(this);
            currentTile.addClass(displayClass)
                        .attr({'tidx': tileSerial, 'row': row});
            if (displayClass == 'shown')
                currentTile.css({'top': top + 'px', 'left': (col * tileWPlusGap) + 'px'});
        });

        scrollbarSetter();
    };
    
    function resetPositions() {
        var newHeight = getCurrentSliderHeight();

        sliderH = newHeight > panelH + gap ? newHeight : panelH + gap;
        setTilePositions();
        setPanelPosition();
    };

    function setTilePositions() {
        var si = getSelectedTile(),
            sr = Number(si.attr('row')),
            row,
            top = 0,
            tileHPlusGap = tileH + gap,
            currentTile,
            shownTilesArray = tilesContainer.find('.tile.shown');

        shownTilesArray.each(function() {
            currentTile = jQuery(this);
            row = Number(currentTile.attr('row'));
            top = row * tileHPlusGap;
            if (isPanelOn && (row > sr))
                top += sliderH;
            currentTile.css('top', top + 'px');
        });
        scrollbarSetter();
    };

    function setPanelPosition() {
        var si = getSelectedTile(),
            sr = Number(si.attr('row')),
            siTop = getCoordinates(si).top,
            pos = siTop + tileH;

        setPanelArrowPosition();
        panelOuter.css('top', pos + 'px');
    };

    function setPanelArrowPosition() {
        var si = getSelectedTile(),
            pos = getCoordinates(si).left,
            arrowPos = pos + Math.round((tileW - 20)/2);

        panelArrow.css('left', arrowPos + 'px');
    };

    function isPanelOpen() {
        return isPanelOn
    };

    function overFlowOn() {
        clearTimeout(animtimer4);
        clearTimeout(animtimer5);

        panelSlider.addClass('on');
        panelSlider.removeClass('gone');
        setCurrentSliderHeight();
        resetPositions();

        animtimer4 = setTimeout(function() {setCurrentSliderHeight(); resetPositions()}, 50);

        clearTimeout(animtimer3);
        animtimer3 = setTimeout(function() {
            panelSlider.addClass('overflowvisible');
        }, 300);
    };

    function overFlowOff() {
        clearTimeout(animtimer3);
        clearTimeout(animtimer4);
        clearTimeout(animtimer5);

        panelSlider.removeClass('on');
        panelSlider.height(0);
        panelSlider.removeClass('overflowvisible');
        animtimer5 = setTimeout(function() {panelSlider.addClass('gone')}, 350);
    };

    function showPanel() {	
        if (!isPanelOn) {
            isPanelOn = true;
            panelOuter.removeClass('animate');
            overFlowOn();
            setTimeout(function() {panelOuter.addClass('animate')}, 1);
            scrollContainer();
        }
        else {
            setTimeout(resetPositions, 1);
            scrollContainer();
        }
    };
    
    function closePanel() {
        isPanelOn = false;
        selectedItem = null;
        overFlowOff();
        setTilePositions();
        removeTileHighlight();
        sliderH = panelH + gap;
    };
    
    function scrollContainer() {
        if (!isPanelOn)
            return false;

        var fromWhere = tilesContainer.scrollTop(),
            toWhere = getCoordinates(getSelectedTile()).top;
        
        if (fromWhere != toWhere) {
            tilesContainer.animate({
                scrollTop: toWhere
            }, 350);
        }
    };

    function scrollbarSetter() {
        var tilesLength = allTilesArray.length;
        jQuery('#scrollbarsetter').remove();
        if (tilesLength > 0) {
            var setterTop = getCoordinates(jQuery(tilesContainer.find('.tile')[tilesLength - 1])).top + tileH;
            tilesContainer.append('<div id="scrollbarsetter" style="top: ' + setterTop + 'px; left: 0"></div>');
        }
    };

    function addRemoveScrollShadow() {
        if (tilesContainer.scrollTop() > 1) {
            if (!scrollShadow.hasClass("on"))
                scrollShadow.addClass("on");
        }
        else
            scrollShadow.removeClass("on")
    };

    function tileClicked(which) {
        var si = Number(which.attr('tidx'));

        if (si !== selectedItem) {
            selectedItem = si;
            showPanel();
            highlightSelectedTile();
        }
        else
            closePanel();
    };

    function getSelectedTile() {
        return jQuery(tilesContainer.find('.tile')[selectedItem])
    };

    function highlightSelectedTile() {
        var si = getSelectedTile(),
            sserial = Number(si.attr('tidx')),
            currentTile,
            tileSerial;

        allTilesArray.each(function() {
            currentTile = jQuery(this);
            tileSerial = Number(currentTile.attr('tidx'));
            currentTile.addClass('opaque');
            if (tileSerial == sserial)
                currentTile.removeClass('opaque');
        });	
    };

    function removeTileHighlight() {
        allTilesArray.each(function() {
            jQuery(this).removeClass('opaque');
        });	
    };

    function onResize(repeatedly) {
        clearTimeout(timerForResize);
        setupDom();

        if (typeof(repeatedly) != "number") {
            return false
        };

        timerForResize = setTimeout(setupDom, 100);
        timerForResize = setTimeout(setupDom, 200);
        timerForResize = setTimeout(setupDom, 300);
        timerForResize = setTimeout(function() {
            setupDom();
            scrollContainer()
        }, 350);
    };

    function infinity() {
        var row,
            visibleRows = getViewportRows(),
            minRow = visibleRows.min,
            maxRow = visibleRows.max,
            currentTile,
            currentlyHidden,
            currentCoordinates;
        
        if (lastMinRow == minRow && lastMaxRow == maxRow && lastColumns == columns)
            return false;
        
        lastMinRow = minRow;
        lastMaxRow = maxRow;
        lastColumns = columns;

        allTilesArray.each(function() {
            currentTile = jQuery(this);
            currentlyHidden = currentTile.hasClass('hidden');
            row = Number(currentTile.attr('row'));
            if ((row >= minRow) && (row <= maxRow)) {
                if (!currentlyHidden) return true;
                else {
                    currentCoordinates = getCoordinates(currentTile);
                    currentTile.css({'top': currentCoordinates.top + 'px', 'left': currentCoordinates.left + 'px'});
                    currentTile.removeClass('hidden').addClass('shown');
                }
            }
            else {
                if (currentlyHidden) return true
                else currentTile.addClass('hidden').removeClass('shown');
            }
        });
    };

    function addResizeAndScrollHandler() {
        var resizeDelay;

        jQuery(window).resize(function() {
            clearTimeout(resizeDelay);
            resizeDelay = setTimeout(function() {
                onResize();
                infinity()
            }, 100); 
        });
        tilesContainer.scroll(function() {
            infinity();
            addRemoveScrollShadow()
        });
    };

    function bindPanelClicks() {
        panelInner.click(function() {
            setTimeout(resetPositions, 1);
        });
    };

    function onLoadTiles(tilesCont, tileDim) {
        initContainerVars(tilesCont, tileDim);
        setupDom();
        addResizeAndScrollHandler();
        bindPanelClicks();
    };


    self.onLoadTiles = onLoadTiles;
    self.onResize = onResize;
    self.tileClicked = tileClicked;
    self.closePanel = closePanel;
    self.isPanelOpen = isPanelOpen;
    self.initContainerVars = initContainerVars;

    return self;
}();