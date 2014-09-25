;(function($) {
    'use strict';

    /**
     * [
     *  'tasks' : {},
     *  'total' : 0, // total number of tasks
     *  'loaded': 0  // number of tasks loaded (displayed
     * ]
     */
    var columns = []

    $.extend($.fn, {
        column: function(){
            return this.each(function (){
                var $this = $(this),
                   $searchForm = $this.find(".jFormSearch"),
                   $searchInput = $searchForm.find("input.search-query"),
                   $tags = $this.find('.tags'),
                   $totalTask = $this.find('.totalTask'),
                   $tasks = $this.find('.tasks'),
                   $moreBtn = $('.moreBtn'),
                   id = columns.length

                $this.data('id', id)

                // display or not the close button
                $('.column .jColumnClose').css('display', id != 0 ? '' : 'none')

                $this
                .on('click', '.jColumnClose', function(e) {
                    e.preventDefault()
                    if (columns.length == 1) {
                        $(document.body).trigger('notify', ['Impossible to remove the last column', 'warning']);
                        return
                    }
                    $this.remove()
                })
                .on('click', '.tags a.jTagFilter', function(e) {
                    var search = $searchInput.val()
                    e.preventDefault();

                    (search != '') && (search += ' AND ')
                    search += 'tag:"' + $(e.target).closest('a.jTagFilter').attr('data-tag') + '"'
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

                    $.ajax({
                        type: 'POST',
                        url: '/rmtask/',
                        data: {id: $task.data('id')},
                        success: function(data){
                            $task.remove()
                            $(document.body).trigger('notify', ['Task removed', 'info']);
                        },
                        error: function(xhr, type){
                            $(document.body).trigger('notify', ['An error occured', 'error']);
                        }
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
                        columns[$this.data('id')] = {
                            tasks: {},
                            loaded: 0,
                            total: 0
                        }
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
                    })

                // submit and not post to force to reset column[id]
                // TODO, to this when dashboard are ready
                $searchForm.submit()
            })
        }
    })

    Zepto(function($){
        //$(document).on('dashboard:change', function(e, dashboardId){
        //    $('.jInputDashboardId').val(dashboardId)
        //    $('.jFormSearch').trigger('task:refresh')
        //})
    })

})(Zepto)
