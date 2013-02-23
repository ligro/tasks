;(function($) {
    'use strict';

    $.task = {
        loadTasks: function(){
            // TODO already loaded / force reload
            $.ajax({
                type: 'GET',
                url: '/tasks',
                // type of data we are expecting in return:
                dataType: 'json',
                success: function(data){
                    $.App.tasks = data
                    $(document.body).trigger('task:load')
                },
                error: function(xhr, type){
                    // @TODO show ui error to specify we can't run
                }
            })
        },
        loadState: function(){
            $.ajax({
                type: 'GET',
                url: '/state',
                // type of data we are expecting in return:
                dataType: 'json',
                success: function(data){
                    $.App.state = data
                    $(document.body).trigger('state:load')
                },
                error: function(xhr, type){
                    // @TODO show ui error to specify we can't run
                }
            })
        },
        save: function(task, success, error){
            if (typeof task.task === 'undefined') {
                // ui error
                error('you must provide a task description');
            }

            // TODO sync tasks with the server
            $.ajax({
                type: 'POST',
                url: '/savetask',
                data: task,
                dataType: 'json',
                success: function(data, state, xhr){
                    // TODO verify the server return
                    $.App.tasks[data._id] = data
                    $(document.body).trigger('task:saved', [data])
                    success()
                },
                error: function(data, state, xhr){
                    error('an error occured')
                }
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
    })

})(Zepto)
