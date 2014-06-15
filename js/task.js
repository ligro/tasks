;(function($) {
    'use strict';

    $.task = {
        tasks: {},
        nbtasksLoaded: 0,
        nbtasks: 0,
        get: function(options) {
            $.extend(options, {limit: 20})

            // ask for the first page, reset counter and cache
            if (typeof options.offset === 'undefined' || options.offset == 0) {
                $.task.tasks = {}
                $.task.nbtasks = 0
            }

            // TODO already loaded / force reload
            $.ajax({
                type: 'GET',
                url: '/tasks/',
                data: options,
                // type of data we are expecting in return:
                dataType: 'json',
                success: function(data){
                    $.task.add(data, /*replace*/false)
                },
                error: function(xhr, type){
                    $('#FatalError').show()
                }
            })
        },
        add: function(data, replace) {
            if (replace) {
                $.task.tasks = data.tasks
                $.task.nbtasksLoaded = data.tasks.length
            } else {
                $.extend($.task.tasks, data.tasks)
                $.task.nbtasksLoaded += data.tasks.length
            }
            $.task.nbtasks = data.nbTasks

            var more = $.task.nbtasksLoaded < $.task.nbtasks
            $(document.body).trigger('task:refreshed', [more, data.tasks, replace])
            if (replace) {
                $(document.body).trigger('tag:refresh', [data.tags])
            }
        }
    }

})(Zepto)
