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
                timeout: 300,
                success: function(data){
                    $.App.tasks = data
                    console.log('task:load')
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
                timeout: 300,
                success: function(data){
                    $.App.state = data
                    console.log('state:load')
                    $(document.body).trigger('state:load')
                },
                error: function(xhr, type){
                    // @TODO show ui error to specify we can't run
                }
            })
        },
        save: function(){
            var $this = $(this),
                fields = $.App.getFormFields($this.parents('form'))

            if (typeof fields.task === 'undefined') {
                console.log('you must provide a task description');
            }

            console.log(fields)
            // POST them in ajax
            var opt = {
                type: 'POST',
                url: '/savetask',
                data: fields,
                dataType: 'json',
                success: function(data, state, xhr){
                    console.log(data)
                    console.log(state)
                    console.log(xhr)
                },
                error: function(data, state, xhr){
                    console.log(data)
                    console.log(state)
                    console.log(xhr)
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

    Zepto(function($){
        $.task.loadTasks();
        $.task.loadState();
    })

})(Zepto)
