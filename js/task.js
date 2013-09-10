;(function($) {
    'use strict';

    $.task = {
        init: false,
        tasks: {},
        state: {},
        loadTasks: function(){
            // TODO already loaded / force reload
            $.ajax({
                type: 'GET',
                url: '/tasks/',
                // type of data we are expecting in return:
            dataType: 'json',
            success: function(data){
                $.task.tasks = data
                $.task.init = true
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
                $.task.state = data
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
                for (var k in data) {
                        $(document.body).trigger('tags:add', data[k])
                    }
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
