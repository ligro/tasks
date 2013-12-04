;(function($) {
    'use strict';

    $.task = {
        initialized: false,
        tasks: {},
        nbtasks: 0,
        init: function(){
            $.task.get({})
        },
        get: function(options) {
            $.extend(options, {limit: 20})


            // TODO already loaded / force reload
            $.ajax({
                type: 'GET',
                url: '/tasks/',
                data: options,
                // type of data we are expecting in return:
                dataType: 'json',
                success: function(data){
                    $.task.tasks = data.tasks
                    $.task.nbtasks = data.nbTasks

                    $(document.body).trigger('ui:refresh')
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
