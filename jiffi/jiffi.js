var animtimer;

function tooltipGlobalOptions() {
    var tooltipDuration = 50,
        tooltipDelay = 100;
    return {
        show: { 
            duration: tooltipDuration,
            delay: tooltipDelay
        },
        hide: { 
            duration: tooltipDuration,
            delay: tooltipDelay
        },
        position: {
            using: function( position, feedback ) {
                $( this ).css( position );
                $( "<div>" )
                .addClass( "tiparrow" )
                .addClass( feedback.vertical )
                .addClass( feedback.horizontal )
                .appendTo( this );
            }
        }
    }
};
function openDialog() {
    $('#_dialog').addClass('on')
}
function closeDialog() {
    $('#_dialog').removeClass('on')
}

function switchTo(which) {
    
    if (!$('body').hasClass(which)) {
        $('body').attr("class", which);
        $('.content.in').removeClass('in').addClass('movin');
        $('.content.' + which).removeClass('out').addClass('in');

        if (which == 'pageHome') {
            $('#search').attr('placeholder', 'Start typing to search...');
            $('#search').val('');
            $("#search").trigger("keyup");
        }
        if (which == 'pageAdd') {
            $('#search').attr('placeholder', '');
            $("#search").trigger("keyup");
            $('#search').focus();
        }
        if (which == 'pageDown') {
            $('.jumbo #x').addClass('off');
        }
        if (which == 'pageApp') {
            $('.jumbo #x').addClass('off');
        }

        clearTimeout(animtimer);
        animtimer = setTimeout(function() {
            $('.content.movin').removeClass('movin').addClass('out');
        }, 450);
    }

}

function handleInput() {
    var inputVal = $('#search').val();
    if (inputVal.length > 2) {
        switchTo('pageNot');
        $('#searchterm').text(inputVal);
    }
    if (inputVal.length < 3 && !$('body').hasClass('pageHome')) {
        switchTo('pageAdd');
    }
    
    $('.jumbo #x').toggleClass('off', inputVal.length == 0);
    
}


function init() {
    switchTo('pageHome');
    $('#search').blur();
    
    var tooltipOptions = tooltipGlobalOptions();
    $( document ).tooltip({
        show: tooltipOptions.show,
        hide: tooltipOptions.hide,
        position: {
            my: "bottom",       // arrow
            at: "top-5",        // tooltip
            using: tooltipOptions.position.using
        }
    })
   
    $('.tile .inner').each(function() {
        var logo = $(this).find('.appname').text();
        logo = logo.substr(0, 1);
        $(this).append('<div class="logo">'+logo+'</div>');
    });
 
    $(document).bind('keydown', function (evt) {
        $('#search').focus()
    })
    
    $('#search').on('keyup', handleInput);
    
    $('.jumbo #x').click(function() {
        $('#search').val('');
        $("#search").trigger("keyup");
    })
    
    $('.jumbo #back').click(function() {
        switchTo('pageHome');
    })
 
    $('.tiles .tile a').click(function(event) {
        LMI.stopEvent(event);
        switchTo('pageApp')
    })
    
    $('.tile.add').click(function() {
        switchTo('pageAdd');
    })
    
    $('.dialog .x').click(function() {
        closeDialog()
    })
    
    $('.dialog button').click(function() {
        closeDialog()
    })
}

$(document).ready(init);