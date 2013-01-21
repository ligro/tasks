(function( $ ) {
    $.App = {
        templates: {
            addTask: '<div>'
                +'<h1>Formulaire d\'ajout de tache</h1>'
                +'<form action="javascript:void(0)">'
                +'<label>Name</label><input type="text" name="name" />'
                +'<label>Description</label><input type="text" name="desc" />'
                +'<!--'
                +'<label>Project</label><input type="text" name="project" />'
                +'<label>Feature</label><input type="text" name="feature" />'
                +'-->'
                +'</form>'
                +'</div>'
        },
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
            $($.App.templates.addTask).dialog();
            // display form (dialog)
            // submit form and close dialog
        }
    };
})( jQuery );

$(document).ready(function() {
    $.App.init(document.getElementsByTagName('body'));
});
