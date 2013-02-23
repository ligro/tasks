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
                console.log('you must provide a task description');
                // ui error
            }

            console.log(task)

            // TODO sync tasks with the server
            var opt = {
                type: 'POST',
                url: '/savetask',
                data: task,
                dataType: 'json',
                success: function(data, state, xhr){
                    $.App.tasks[data._id] = data
                    // TODO update the ui
                    if (typeof task._id === 'undefined') {
                        // new task add it

                    } else {
                        // update task data
                        // if state change, add it to new stateColumn
                    }
                    success()
                },
                error: function(data, state, xhr){
                    // @TODO show ui error to specify we can't run
                    error('an error occured')
                }
            }
            console.log(opt)
            $.ajax(opt)
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

    $.extend($.fn, {
        task: function(){
            var $this = $(this)

            $this.find('a').on('click', function(e){
                var $this = $(this)
                e.stopPropagation()

                // load modal with task value
                console.log('on click');

            })
        }
    })

    Zepto(function($){
        $.task.loadTasks();
        $.task.loadState();
    })

})(Zepto)
