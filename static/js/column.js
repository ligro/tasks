;(function($) {
    'use strict';

    /**
     * [
     *  'element' : {},
     *  'tasks' : {},
     *  'total' : 0, // total number of tasks
     *  'loaded': 0  // number of tasks loaded (displayed
     * ]
     */
    var columns = {},
        nbColumns = 0,
        columnsId = 0

    function saveColumns()
    {
        var dashboardsQueries = JSON.parse(window.localStorage.getItem('dashboards:queries'))
        if (dashboardsQueries == null) {
            dashboardsQueries = {}
        }
        dashboardsQueries[$.App.dashboardId] = []

        $.each(columns, function(i, column) {
            if (typeof column !== 'undefined') {
                dashboardsQueries[$.App.dashboardId].push(column.element.find('input.jSearchQuery')[0].value)
            }
        })

        window.localStorage.setItem('dashboards:queries', JSON.stringify(dashboardsQueries))
    }

    $.extend($.fn, {
        column: function(){
            return this.each(function (){
                var $this = $(this),
                   $searchForm = $this.find(".jFormSearch"),
                   $searchInput = $searchForm.find("input.jSearchQuery"),
                   $tags = $this.find('.tags'),
                   $totalTask = $this.find('.totalTask'),
                   $tasks = $this.find('.tasks'),
                   $moreBtn = $('.moreBtn'),
                   id = columnsId++

                nbColumns++
                $this.data('id', id)
                columns[id] = {
                    element: $this,
                    tasks: {},
                    loaded: 0,
                    total: 0
                }

                // display or not the close button
                $('.column .jColumnClose').css('display', id != 0 ? '' : 'none')

                $this
                .on('click', '.jColumnClose', function(e) {
                    e.preventDefault()
                    if (nbColumns == 1) {
                        $(document.body).trigger('notify', ['Impossible to remove the last column', 'warning']);
                        return
                    }
                    $this.remove()
                    // remove the entry in the array
                    nbColumns--
                    delete columns[$this.data('id')]

                    $('#page .column')
                    .removeClass('col-sm-' + (12/(nbColumns + 1)))
                    .addClass('col-sm-' + (12/nbColumns))

                    // erase and save all queries
                    saveColumns()
                })
                .on('click', '.tags a.jTagFilter', function(e) {
                    var search = $searchInput.val()
                    e.preventDefault();

                    (search != '') && (search += ' AND ')
                    search += 'tag:"' + $(e.target).closest('a.jTagFilter').attr('data-tag').toLowerCase() + '"'
                    $searchInput.val(search)
                })
                .on('click', '.moreBtn button', function(e) {
                    e.preventDefault()
                    $searchForm.post({offset: columns[$this.data('id')].loaded})
                })
                .on('click', '.task .jTaskModify', function(e){
                    var id = $(e.target).closest('.task').data('id')

                    e.preventDefault()

                    // TODO store only one time tasks
                    $.App.ui.taskEditModal(columns[$this.data('id')].tasks[id])
                })
                .on('click', '.task .jTaskRemove', function(e){
                    var $task = $(this).parent()
                    e.preventDefault()

                    $.ajaxPromise({
                        type: 'POST',
                        url: '/api/rmtask/',
                        data: {id: $task.data('id')}
                    })
                    .then(function(data){
                        $task.remove()
                        $(document.body).trigger('notify', ['Task removed', 'info']);
                    })
                    .catch(function(data){
                        $(document.body).trigger('notify', ['An error occured', 'error']);
                    })

                    $(".column").trigger('task:refresh')
                })
                .on('task:refresh', function(e){
                    $searchForm.submit()
                })

                $searchForm
                    .on('submit', function(e, data){
                        $totalTask.html('-')
                        $tasks.html('')
                        columns[$this.data('id')].tasks = {}
                        columns[$this.data('id')].loaded = 0
                        columns[$this.data('id')].total = 0
                    })
                    .on('post:success', function(e, data){
                        $.extend(columns[$this.data('id')].tasks, data.tasks)
                        columns[$this.data('id')].total = data.nbTasks

                        $totalTask.html(columns[$this.data('id')].total)

                        // update tag view
                        $tags.html('')
                        for (var tag in data.tags) {
                            $.ui._loadTpl('tag', {'tag': tag, 'nb': data.tags[tag]}, function(err, out) {
                                $tags.append($(out))
                            })
                        }

                        // add tasks in view
                        for (var taskId in data.tasks) {
                            $.ui._loadTpl('task', data.tasks[taskId], function(err, out) {
                                $tasks.append($(out))
                            })
                            columns[$this.data('id')].loaded++
                        }

                        $moreBtn.css('display', columns[$this.data('id')].total > columns[$this.data('id')].loaded ? '' : 'none')

                        saveColumns()
                    })

                // submit and not post to force to reset column[id]
                $searchForm.submit()
            })
        }
    })

    Zepto(function($){
        $(document).on('dashboard:change', function(e, dashboardId){
            var cpt = 0,
            dashboardsQueries = JSON.parse(window.localStorage.getItem('dashboards:queries'))

console.log('load', dashboardId, dashboardsQueries[dashboardId])
            $.App.dashboardId = dashboardId

            // reset
            $('#page .column').remove()
            columns = {}
            nbColumns = 0
            columnsId = 0

            if (dashboardsQueries && typeof dashboardsQueries[dashboardId] !== 'undefined' && dashboardsQueries[dashboardId].length) {
                $.each(dashboardsQueries[dashboardId], function(i, query){
                    $.App.addColumn(query)
                })
            } else {
                $.App.addColumn()
            }
        })
    })


})(Zepto)
