;(function($) {
    'use strict';

    $.extend($.fn, {
        tasksColumn: function(){
            return this.each(function (){
                var $this = $(this),
                   status = $this.data('status')

                $.task.findByStatus($this.data('status')).forEach(function(task){
                    $.App._loadTpl('taskColumn', task, function(err, out) {
                        $this.find('.tasks').append($(out))
                    })
                })
            })
        }
    })

})(Zepto)
