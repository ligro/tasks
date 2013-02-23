;(function($) {
    'use strict';

    var taskColumns = {
        columns: {},
        getColumnByState: function(state) {
            return this.columns[state]
        },
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

                $columns.trigger('column:added', [$columns.find('#'+data.id), state])
            })
        }
    },
    taskColumn = {
        addTask: function($column, task){
            $.App._loadTpl('task', task, function(err, out) {
                $column.append($(out))
            })
        },
        updateTask: function($task, task){
            $.App._loadTpl('task', task, function(err, out) {
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
                       var $column = $(column).find('.tasks')
                    // handle state == undefined
                    taskColumns.columns[state] = $column
                    $column.tasksColumn()
                })

                $(document).on('task:saved', function(e, task){
                    console.log('task:saved')
                    var $column,
                        $task = $('#task-'+task._id)

                    if ($task.length != 0) {
                        taskColumn.updateTask($task, task)
                    } else {
                        $column = taskColumns.getColumnByState(task.state)
                        taskColumn.addTask($column, task)
                    }
                })

                // click on task
                $this.on('click', '.tasks .task a', function(e){
                    var $this = $(this),
                        task = $.App.tasks[$(e.target).closest('.task').data('id')]

                    e.stopPropagation()
                    // load modal with task value
                    console.log(task)
                    $.App.ui.taskEditModal(task)
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
