;(function($) {
    'use strict';

     $.App = {

        templates: {},
        tasks: {},

        init: function() {
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
                .modal('abouts', {}, {title: 'Abouts'})
        },
        addtask: function(){
            $('<div>')
                .modal('addTask', {}, {
                    title: 'Create task',
                    buttons: [
                        {name: 'Create', class: 'primary-btn', id: 'addTaskSave'}
                    ]
                })
                .on('click', '#addTaskSave', function(){
                    var fields = $.App.getFormFields(this)

                    if (typeof fields.task === 'undefined') {
                        console.log('you must provide a task description');
                    }
                    // POST them in ajax
                    $.ajax({
                        type: 'POST',
                        url: '/task',
                        data: fields,
                        success: function(data, status, xhr){
                            console.log(data)
                            console.log(status)
                            console.log(xhr)
                        },
                        error: function(data, status, xhr){
                            console.log(data)
                            console.log(status)
                            console.log(xhr)
                        }
                    })
                    // handle success and errors
                })
        },
        getFormFields: function(form){
            var fields=[]

            $(form).find('input').each(function(){
                this.val() !== ''
                    && (fields[this.name] = this.val())
            })

            $(form).find('textarea').each(function(){
                this.val() !== ''
                    && (fields[this.name] = this.val())
            })

            return fields
        }
    }

    Zepto(function($){
        $.App.init();
    })

})(Zepto)
