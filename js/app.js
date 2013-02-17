;(function($) {
    'use strict';

     $.App = {

        templates: {},

        init: function() {
            $('a.jLink').on('click', function(e){
                var func = $(this).data('func');
                e.stopPropagation()
                if (typeof $.App[func] == 'function') {
                    $.App[func].call();
                }
            })

            $(document).on('task:load', function(e){
                // display tasks in page
                $('.column').tasksColumn()
            })

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
            })
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
            $('<form>', {action: 'javascript:void(0);'})
                .modal('addTask', {}, {
                    title: 'Create task',
                    buttons: [
                        {name: 'Create', class: 'primary-btn', id: 'addTaskSave'}
                    ]
                })
                .on('click', '#addTaskSave', $.task.save)
        },
        getFormFields: function(form){
            var fields = {}

            form.find('input, textarea').each(function(index, element){
                var $this = $(this)
                $this.val() !== ''
                    && (fields[$this.attr('name')] = $this.val())
            })

            return fields
        }
    }

    Zepto(function($){
        $.App.init();
    })

})(Zepto)
