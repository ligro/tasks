;(function($) {
    'use strict';

    $.task = {
        initialized: false,
        tasks: {},
        state: {},
        projects: {},
        init: function(){
            $.task.get({})
        },
        get: function(options) {
            $.extend(options, {limit: 20})


            // TODO already loaded / force reload
            $.ajax({
                type: 'GET',
                url: '/tasks/',
                data: options,
                // type of data we are expecting in return:
                dataType: 'json',
                success: function(data){
                    $.task.tasks = data.tasks
                    // TODO add event state:add
                    $.task.state = data.state
                    $.task.initialized = true

                    for (var k in data.projects) {
                        $(document.body).trigger('project:add', [data.projects[k]])
                    }

                    for (var k in data.tags) {
                        $(document.body).trigger('tags:add', [data.tags[k]])
                    }

                    $(document.body).trigger('task:load')
                    $(document.body).trigger('state:load')
                },
                error: function(xhr, type){
                    $('#FatalError').show()
                }
            })
        },
        findByState: function(state){
            var tasks = []

            // TODO init load ?
           $.each($.task.tasks, function(index, item){
               item.state === state
                   && (tasks.push(item))
           })

           return tasks
        }
    }

    Zepto(function($){
        $.task.init();
    })

})(Zepto)
