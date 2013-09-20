;(function($) {
    'use strict';

    $.task = {
        init: false,
        tasks: {},
        state: {},
        projects: {},
        loadTasks: function(){
            // TODO already loaded / force reload
            $.ajax({
                type: 'GET',
                url: '/tasks/',
                // type of data we are expecting in return:
                dataType: 'json',
                success: function(data){
                    $.task.tasks = data.tasks
                    $.task.projects = data.projects
                    // TODO add event state:add
                    $.task.state = data.state
                    $.task.init = true

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
        $.task.loadTasks();
    })

})(Zepto)
