(function( $ ) {
    $.App = {
        init: function(el) {
            $('a.jLink').bind('click', function(){
                var func = $(this).data('func');
                if (typeof $.App[func] == 'function') {
                    $.App[func].call();
                }
            });
            // retrieve tasks lists
        },
        addtask: function(){
            $('<div></div>').dialog();
            // display form (dialog)
            // submit form and close dialog
        }
    };
})( jQuery );

$(document).ready(function() {
    $.App.init(document.getElementsByTagName('body'));
});
