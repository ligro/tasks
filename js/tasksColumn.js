;(function($) {
    'use strict';

    var taskColumns = {
        addColumn: function($columns, title, state){
            var data = {
                id: (typeof state === 'undefined') ? 'state' : 'state'+state,
                title: title,
                state: state
            }

            $.App._loadTpl('tasksColumn', data, function(err, out) {
                typeof state !== 'undefined'
                    && $(out).data('state', state)
                $columns.append($(out))
                $columns.trigger('column:added', $columns.find('#'+data.id))
            })
        }
    },
    taskColumn = {
        addTask: function($column, task){
            $.App._loadTpl('task', task, function(err, out) {
                $column.append($(out))
            })
        }
    }

    // TODO handle span width according the number of column
    $.extend($.fn, {
        tasksColumns: function(){
            return this.each(function (){
                var $this = $(this)

                // add columns => add task in this column
                $this.on('column:added', function(e, column){
                    console.log('column:added')
                    console.log(column)
                    console.log($(column))
                    $(column).find('.tasks').tasksColumn()
                })

                // click on task
                $this.on('click', '.tasks .task a', function(e){
                    var $this = $(this)
                    e.stopPropagation()

                    // load modal with task value
                    console.log('on click')
                })


                taskColumns.addColumn($this, 'backlog')
                $.App.state.forEach(function(state){
                    taskColumns.addColumn($this, state, state)
                })
            })
        },
        tasksColumn: function(){
            return this.each(function (){
                var $this = $(this),
                    state = $this.data('state')

                $.task.findByState(state).forEach(function(task){
                    taskColumn.addTask($this, task)
                })
            })
        }
    })

})(Zepto)
