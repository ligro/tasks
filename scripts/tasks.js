(function( $ ) {
    $.App = {
        init: function(el) {
            console.log(el)

            // retrieve tasks lists
        }
    };
})( jQuery );

$(document).ready(function()
    {
        $.App.init(document.getElementsByTagName('body'));
    }
);
