;(function($) {
    'use strict';

    var taskColumns = {
        columns: {},
        getColumnByState: function(state) {
            return this.columns[state]
        },
        addColumn: function($columns, title, state){
            var data = {
                id: (typeof state === 'undefined') ? 'state' : 'state'+state.replace(' ', '_'),
                title: title,
                state: state
            }

            $.ui._loadTpl('tasksColumn', data, function(err, out) {
                $columns.append($(out))
                typeof state !== "undefined"
                    && $columns.find('#'+data.id).data('state', state)

                $columns.trigger('column:added', [$columns.find('#'+data.id), state])
            })
        }
    },
    taskColumn = {
        addTask: function($column, task){
            $.ui._loadTpl('task', task, function(err, out) {
                $column.append($(out))
            })
        },
        updateTask: function($task, task){
            $.ui._loadTpl('task', task, function(err, out) {
                $task.html($(out))
            })
        }
    }

    // TODO handle span width according the number of column
    $.extend($.fn, {
        tasksColumns: function(){
            return this.each(function (){
                var $this = $(this)

                // add columns => add task in this column
                $this.on('column:added', function(e, column, state){
                    var $column = column.find('.tasks')
                    // handle state == undefined
                    taskColumns.columns[state] = $column
                    $column.tasksColumn(state)
                })

                $(document).on('task:saved', function(e, task){
                    var $column,
                        $task = $('#task-'+task._id),
                        oldState = $task.closest('.column').data('state')

                    $column = taskColumns.getColumnByState(task.state)
                    if (typeof $column === 'undefined') {
                        taskColumns.addColumn($this, task.state, task.state)
                        $column = taskColumns.getColumnByState(task.state)
                    }

                    if ($task.length == 0) {
                        taskColumn.addTask($column, task)
                    } else {
                        taskColumn.updateTask($task, task)
                        if (task.state !== oldState) {
                            $column.append($task.html())
                            $task.remove()
                        }
                    }

                    $(document.body).trigger('task:refresh')
                })


                taskColumns.addColumn($this, 'backlog')
                $.task.state.forEach(function(state){
                    taskColumns.addColumn($this, state, state)
                })
            })
        },
        tasksColumn: function(state){
            return this.each(function (){
                var $this = $(this)

                $.task.findByState(state).forEach(function(task){
                    taskColumn.addTask($this, task)
                })
            })
        }
    })

})(Zepto)
