(function( $ ) {
    $.App = {
        templates: {},
        init: function(el) {
            $('a.jLink').bind('click', function(){
                var func = $(this).data('func');
                if (typeof $.App[func] == 'function') {
                    $.App[func].call();
                }
            });

            // retrieve templates
            $.get('/templates', function(data){
                $.App.templates = data;
            })
            .error(function(){ alert("templates can't be loaded the application can't run"); });

            // retrieve tasks lists
        },
        _loadTpl: function(name) {
            typeof dust.cache[name] === 'undefined'
                && dust.loadSource(dust.compile($.App.templates[name], name));
        },
        addtask: function(){
            $.App._loadTpl("addTask");

            // will be usefull for i18n
            dust.render("addTask", {}, function(err, out) {
                  $(out).dialog();
                  // click out close dialog
            });

            // submit form and close dialog
        }
    };
})( jQuery );

$(document).ready(function() {
    $.App.init(document.getElementsByTagName('body'));
});
