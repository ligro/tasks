;(function($) {
    'use strict';

     $.App = {

        templates: {},
        tasks: {},

        init: function(el) {
            $('a.jLink').bind('click', function(){
                var func = $(this).data('func');
                if (typeof $.App[func] == 'function') {
                    $.App[func].call();
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
                    $.App.templates = data;
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
                    $.App.tasks = data;
                    // trigger event to display data
                },
                error: function(xhr, type){
                    // @TODO show ui error to specify we can't run
                }
            });

        },
        _loadTpl: function(name, data, end) {
            typeof dust.cache[name] === 'undefined'
                && dust.loadSource(dust.compile($.App.templates[name], name))

            dust.render(name, data, end)
        },
        abouts: function(){
            $('<div>')
                .modal('abouts', {}, {title: "Abouts"})
        },
        addtask: function(){
            $('<div>')
                .modal('addTask', {}, {
                    title: "Add task",
                    buttons: [
                        {name: 'Add', class: "primary-btn"}
                    ]
                })
        }
    };

    Zepto(function($){
        $.App.init(document.getElementsByTagName('body'));
    })

})(Zepto)
