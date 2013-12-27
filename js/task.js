;(function($) {
    'use strict';

    $.task = {
        initialized: false,
        tasks: {},
        nbtasksLoaded: 0,
        nbtasks: 0,
        init: function(){
            $.task.get({})
        },
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
                $.task.nbtasksLoaded = data.tasks.len
            } else {
                $.extend($.task.tasks, data.tasks)
                $.task.nbtasksLoaded += data.tasks.len
            }
            $.task.nbtasks = data.nbTasks

            var more = $.task.nbtasksLoaded < $.task.nbtasks
            $(document.body).trigger('ui:refresh', [more, data.tasks, replace])
        }
    }

    Zepto(function($){
        $.task.init();
    })

})(Zepto)
