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
                    $(document.body).trigger('task:load')
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
            }
            console.log(opt)
            $.ajax(opt)
        },
        findByStatus: function(status){
            var tasks = []

            // TODO init load ?
           $.each($.App.tasks, function(index, item){
               item.status === status
                   && (tasks.push(item))
           })

           return tasks
        },
        find: function(query){

        }
    }

    Zepto(function($){
        $.task.loadTasks();
    })

})(Zepto)
