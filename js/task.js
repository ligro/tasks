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
                    $.extend($.task.tasks, data.tasks)
                    $.task.nbtasksLoaded += options.limit
                    $.task.nbtasks = data.nbTasks

                    var more = $.task.nbtasksLoaded < $.task.nbtasks
                console.log(more)
                   $(document.body).trigger('ui:refresh', [more, data.tasks])
                },
                error: function(xhr, type){
                    $('#FatalError').show()
                }
            })
        },
    }

    Zepto(function($){
        $.task.init();
    })

})(Zepto)
