;(function($) {
    'use strict';

    $.App = {
        init: function() {

            $(document).one('templates:load', function(e){
                $.App.ui.init();
                // perform an empty search to fill the page with task and tags
                $('#formsearch').post()
            })

            $(document).on('task:refresh', function(e, more, tasks, replace){
                // iterate on task add it in the view
                var $page = $('#page .tasksColumns')
                if (replace) { $page.html('') }

                $('.totalTask').html($.task.nbtasks)
                for (var taskId in tasks) {
                    $.ui._loadTpl('task', tasks[taskId], function(err, out) {
                        $page.append($(out))
                    })
                }
                if (more) {
                    $('.moreBtn').css('display', '')
                } else {
                    $('.moreBtn').css('display', 'none')
                }
            })

            $(document).on('click', '#page .moreBtn button', function(e) {
                var $search = $('#page input.search-query')
                e.preventDefault()
                $.task.get({offset: $.task.nbtasksLoaded, query: $search.val()})
            })

            $(document).on('click', '#page .tags a.jTagFilter', function(e) {
                var $searchInput = $("#formsearch input.search-query"),
                    search = $searchInput.val()

                e.preventDefault()

                search += 'tag:' + $(e.target).closest('a.jTagFilter').attr('data-tag')
                $("#formsearch input.search-query").val(search)
            })
        },
        addTask: {
            success: function(data) {
                $.modal.closeModal()
                $(document.body).trigger('task:saved', [data.datas])
                $(document.body).trigger('notify', ['Task saved', 'info'])
                $.task.tasks[data.datas._id] = data.datas
                // update tags not in tags list
                for (var k in data.datas.tag) {
                    if (-1 == $.inArray(data.datas.tag[k], $.tags.tags)) {
                        $(document.body).trigger('tags:add', [data.datas.tag[k]])
                    }
                }
            },
            validate: function($form) {
                var res = true;

                $form.find('textarea').each(function(index) {
                    var $this = $(this)
                    if ($this.val() === '') {
                        $this.errorMsg('can not be empty')
                        res = false
                    }
                })

                return res
            }
        },
        search: {
            success: function (data) {
                $.task.add(data, /*replace*/true)
            }
        }
    }

     $.App.ui = {
         init: function(){
             $('a.jLink').on('click', function(e){
                 var func = $(this).data('func')+'_link';
                 e.stopPropagation()
                 if (typeof $.App.ui[func] == 'function') {
                     $.App.ui[func].call()
                 }
             })

         },
         taskEditModal: function(task){
            typeof task === 'undefined'
                && (task = {})

            $('<form class="jForm" action="/savetask/" method="POST" data-method="addTask">')
                .modal('addTask', task, {
                    title: 'Create task',
                    submit: {name: 'Create', class: 'btn-primary'}
                })
         },
         abouts_link: function(){
             $('<div>')
                 .modal('abouts', {}, {title: 'Abouts'})
         },
         addtask_link: function(){
             $.App.ui.taskEditModal()
         }
     }

    Zepto(function($){
        $.App.init();
    })

})(Zepto)
