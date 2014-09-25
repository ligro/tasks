;(function($) {
    'use strict';

    $.App = {
        init: function() {
            $(document).one('templates:load', function(e){
                $.App.ui.init();
            })
            .on('click', '.jColumnAdd', function(e) {
                $.App.addColumn()
            })
            .on('dashboard:change', function(e, dashboardId) {
                console.log('dashboard:change ' + dashboardId)
                $.App.dashboardId = dashboardId

                $('#page .column').remove()

                var dashboardsQueries = window.localStorage.getItem('dashboards:queries')
                // window.localStorage.setItem('dashboards:queries', JSON.stringify({'540f6ece4888112648a68ccd':['', 'tag:"atag"']}))
                console.log(dashboardsQueries)
                console.log($.App.dashboardId)
                console.log(dashboardsQueries[$.App.dashboardId])
                console.log(dashboardsQueries[$.App.dashboardId].length)
                if (typeof dashboardsQueries[$.App.dashboardId] !== 'undefined') {
                    if (dashboardsQueries[$.App.dashboardId].length) {
                        for (var query in dashboardsQueries[$.App.dashboardId]) {
                            $.App.addColumn(query)
                        }
                    }
                }

                if ($('#page .column').empty()) {
                    $.App.addColumn()
                }
            })
        },
        addColumn: function(query = '') {
            var columns

            $.ui._loadTpl('column', {'query': query}, function(err, out) {
                $("#page").append($(out))
                columns = $('#page .column')
                $(columns[columns.length - 1]).column()
            })
        },
        // jForm success method
        addTask: {
            success: function(data) {
                // FIXME should be merged with .on 'post:success'
                $.modal.closeModal()
                $(document.body).trigger('notify', ['Task saved', 'info'])
                $(document.body).trigger('task:refresh')

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
             var button = 'Modify'
             if (typeof task === 'undefined') {
                 task = {}
                 button = 'Create'
             }

             if ($.App.dashboardId !== null) {
                task.dashboardId = $.App.dashboardId;
             }

             $('<form class="jForm" action="/savetask/" method="POST" data-method="addTask">')
                .on('post:success', function (e){
                    // FIXME should be merged with addTask.success
                    // reload all columns
                    $(".column").trigger('task:refresh')
                })
                .modal('addTask', task, {
                    title: 'Task',
                    submit: {name: button, class: 'btn-primary'}
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
