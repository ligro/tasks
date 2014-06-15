;(function($) {
    'use strict';

    $.extend($.fn, {
        column: function(){
            return this.each(function (){
                var $this = $(this),
                   $searchForm = $this.find(".jFormSearch"),
                   $searchInput = $searchForm.find("input.search-query")

                console.log("column %o", $this);

                // todo handle refresh
                $this
                .on('click', '.tags a.jTagFilter', function(e) {
                    var search = $searchInput.val()
                    e.preventDefault()

                    (search != '') && (search += ' AND ')
                    search += 'tag:"' + $(e.target).closest('a.jTagFilter').attr('data-tag') + '"'
                    $("#formsearch input.search-query").val(search)
                })
                .on('click', '.moreBtn button', function(e) {
                    e.preventDefault()
                    $searchForm.post({offset: $.task.nbLoadedTasks})
                })
                .on('task:refresh', function(e){
                    $searchForm.post()
                })

                $searchForm.on('post:success', function(e, data){
                    // TODO handle replace
                    // TODO stop using $.task
                    var replace = true
                    if (replace) {
                        $.task.tasks = data.tasks
                        $.task.nbtasksLoaded = data.tasks.length
                    } else {
                        $.extend($.task.tasks, data.tasks)
                        $.task.nbtasksLoaded += data.tasks.length
                    }
                    $.task.nbtasks = data.nbTasks

                    var more = $.task.nbtasksLoaded < $.task.nbtasks

                    // iterate on task add it in the view
                    var $tasks = $this.find('.tasks')
                    if (replace) { $tasks.html('') }

                    $this.find('.totalTask').html($.task.nbtasks)
                    for (var taskId in data.tasks) {
                        $.ui._loadTpl('task', data.tasks[taskId], function(err, out) {
                            $tasks.append($(out))
                        })
                    }

                    $('.moreBtn').css('display', more ? '' : 'none')
                })

                $searchForm.post()
            })
        }
    })
})(Zepto)
