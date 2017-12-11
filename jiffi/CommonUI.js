var LMI = LMI || {};
LMI.Appmatic = LMI.Appmatic || {};

LMI.Appmatic.CommonUI = (function () {

    function setSelectedItems() {
        var pathName = window.location.pathname.toLowerCase();
        $('div.commonUILeftnav ul li a').each(function() {
            var linkHref = $(this).attr('href').split('#')[0].toLowerCase();
                linkHref = linkHref.split('?')[0];
            if (pathName == linkHref) {
                $(this).addClass('selected');
                var parentLink = $(this).parent().parent().parent();
                if (parentLink.prop("tagName") == 'LI')
                    parentLink.children('a').addClass('selected');
            }
        })
    }

    function setNavItemHover() {
        $('div.commonUILeftnav ul li').mouseenter(function() {
            $(this).find("ul li:first-child a").addClass('hovered');
        });
        $('div.commonUILeftnav ul li ul').mouseleave(function() {
            $(this).find("li:first-child a").addClass('hovered');
        });
        $('div.commonUILeftnav ul li ul li a').hover(
            function() {
                $(this).parent().parent().find("li a").removeClass('hovered');
                $(this).addClass('hovered');
            }, 
            function() {$(this).removeClass('hovered');}
        );
    }
    
    function addMenuDecoration() {
        $('div.commonUILeftnav ul li ul').after('<div class="arrow"></div>');
        $('<div/>', { 'class': 'pin', 'click': toggleNav }).appendTo('div.commonUILeftnav');
    }
    
    function addNavClass(hasFatNav) {
        $('div.commonUILeftnav').removeClass('fat slim').addClass(hasFatNav ? 'fat' : 'slim');
    }

    function toggleNav() {
        $('body').toggleClass('fatnav');
        var hasFatNav = $('body').hasClass('fatnav');
        addNavClass(hasFatNav);
        $(window).trigger('resize');
    }
    
    function bindHeaderEvents() {
        var dropDownsDom = $('div.commonUIHeader div.rightside div.clicker').parent();
        var dropDowns = [];
        var currentMenu;

        $(document.body).click(function() {
            $('div.commonUIHeader div.rightside > div').removeClass('on')
        })

        dropDownsDom.each(function() { dropDowns.push($(this).attr('id')) });

        $('div.commonUIHeader div.rightside div.clicker').click(function(event) {
            LMI.stopEvent(event);
            currentMenu = $(this).parent().attr('id');
            $('#' + currentMenu).toggleClass('on');
            for (idx in dropDowns) {
                if (typeof dropDowns[idx] == 'string' && dropDowns[idx] != currentMenu) {
                    $('#' + dropDowns[idx]).removeClass('on')
                }
            }
        })
        
        $('div.commonUIHeader div.rightside #language .actionmenu a').click(function(event) {
            LMI.stopEvent(event);
            $('div.commonUIHeader').click();
            $('div.commonUIHeader div.rightside #language .actionmenu a').removeClass('selected');
            $(this).addClass('selected');
            decorateLangButton();
        })
    }
    
    function decorateLangButton() {
        $('div.commonUIHeader div.rightside #language .menubutton span.lng').text($('#language a.selected').data('lng'));
    }
    
    function initHeader() {
        bindHeaderEvents();
        $('div.commonUILeftnav').addClass('dotrans');
        decorateLangButton();
    }

    return {
        initHeader: initHeader,
        toggleNav: toggleNav
    }
} ());