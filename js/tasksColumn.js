;(function($) {
    'use strict';

    // TODO handle span width according the number of column
    $.extend($.fn, {
        tasksColumns: function(){
            return this.each(function (){
                var $this = $(this),
                   data = {}

                $.App.state.forEach(function(state){
                    data.state = state
                    $.App._loadTpl('tasksColumn', data, function(err, out) {
                        $this.find('.tasksColumns').append(
                            $(out).find('.tasks').tasksColumn(state)
                        )
                    })
                })

                data.state = 'backlog'
                $.App._loadTpl('tasksColumn', data, function(err, out) {
                    $this.prepend($(out))
                        .find('.tasks').tasksColumn()
                })
            })
        },
        tasksColumn: function(state){
            return this.each(function (){
                var $this = $(this)

                $.task.findByState(state).forEach(function(task){

                    $.App._loadTpl('task', task, function(err, out) {
                        $this.append($(out))
                    })
                })

                $this.find('.task').task()
            })
        }
    })

})(Zepto)
