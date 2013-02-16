;(function($) {
    'use strict';

    $.extend($.fn, {
        tasksColumn: function(tasks){
            console.log(this);
            return this.each(function (){
                console.log($(this));
                console.log(tasks);

            })
        }
    })

    Zepto(function($){
        $.task.loadTasks();
    })

})(Zepto)
