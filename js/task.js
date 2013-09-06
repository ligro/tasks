;(function($) {
    'use strict';

    $.task = {
        loadTasks: function(){
            // TODO already loaded / force reload
            $.ajax({
                type: 'GET',
                url: '/tasks/',
                // type of data we are expecting in return:
                dataType: 'json',
                success: function(data){
                    $.App.tasks = data
                    $(document.body).trigger('task:load')
                },
                error: function(xhr, type){
                    $('#FatalError').show()
                }
            })
        },
        loadState: function(){
            $.ajax({
                type: 'GET',
                url: '/state/',
                // type of data we are expecting in return:
                dataType: 'json',
                success: function(data){
                    $.App.state = data
                    $(document.body).trigger('state:load')
                },
                error: function(xhr, type){
                    $('#FatalError').show()
                }
            })
        },
        loadTags: function(){
            $.ajax({
                type: 'GET',
                url: '/tags/',
                // type of data we are expecting in return:
                dataType: 'json',
                success: function(data){
                    $.App.tags = data
                    for (var k in data) {
                        $(document.body).trigger('tags:add', data[k])
                    }
                },
                error: function(xhr, type){
                    $('#FatalError').show()
                }
            })
        },
        save: function(task, success, error){
            // TODO sync tasks with the server
            $.ajax({
                type: 'POST',
                url: '/savetask/',
                data: task,
                dataType: 'json',
                success: function(data, state, xhr){
                    // TODO verify the server return
                    success()
                },
            })
        },
        findByState: function(state){
            var tasks = []

            // TODO init load ?
           $.each($.App.tasks, function(index, item){
               item.state === state
                   && (tasks.push(item))
           })

           return tasks
        },
        find: function(query){

        }
    }

    Zepto(function($){
        $.task.loadTasks();
        $.task.loadState();
        $.task.loadTags();
    })

})(Zepto)
