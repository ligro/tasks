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

                // handle state == undefined
                taskColumns.columns[state] = $columns.find('#'+data.id)
                $columns.trigger('column:added', taskColumns.columns[state])
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
                    $(column).find('.tasks').tasksColumn()
                })

                $(document).on('task:saved', function(e, task){
                    console.log('task:saved')
                    var $column = taskColumns.getColumnByState(task.state)

                    taskColumn.addTask($column, task)
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
