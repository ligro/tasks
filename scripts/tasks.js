(function($) {
    'use strict';

    var App = {

        templates: {},
        tasks: {},

        init: function(el) {
            $('a.jLink').bind('click', function(){
                var func = $(this).data('func');
                if (typeof App[func] == 'function') {
                    App[func].call();
                }
            });

            // retrieve templates
            // @TODO handles error
            $.ajax({
                type: 'GET',
                url: '/templates',
                // type of data we are expecting in return:
                dataType: 'json',
                timeout: 300,
                success: function(data){
                    App.templates = data;
                },
                error: function(xhr, type){
                    // @TODO show ui error to specify we can't run
                }
            });

            // retrieve tasks lists
            $.ajax({
                type: 'GET',
                url: '/tasks',
                // type of data we are expecting in return:
                dataType: 'json',
                timeout: 300,
                success: function(data){
                    App.tasks = data;
                    // trigger event to display data
                },
                error: function(xhr, type){
                    // @TODO show ui error to specify we can't run
                }
            });

        },
        _loadTpl: function(name) {
            typeof dust.cache[name] === 'undefined'
                && dust.loadSource(dust.compile(App.templates[name], name));
        },
        abouts: function(){
            App._loadTpl("abouts");
            dust.render("abouts", {}, function(err, out) {
                // @TODO put it somewhere else
                $("#page footer").html(out);
                // @TODO allow to close the new window
            });
        },
        addtask: function(){
            App._loadTpl("addTask");

            // will be usefull for i18n
            dust.render("addTask", {}, function(err, out) {
                // display the view en the end of the page
                $("#page footer").html(out);

                // @TODO allow to close the new window
            });

            // submit form and close dialog
        }
    };

    Zepto(function($){
        App.init(document.getElementsByTagName('body'));
    })

})(Zepto);

