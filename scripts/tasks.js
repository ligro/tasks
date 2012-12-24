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
            $('<div>Formulaire d\'ajout de tache</div>').dialog();
            // display form (dialog)
            // submit form and close dialog
        }
    };
})( jQuery );

$(document).ready(function() {
    $.App.init(document.getElementsByTagName('body'));
});
