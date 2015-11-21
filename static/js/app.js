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
        },
        addColumn: function(query = '') {
            var columns, datas

            datas = {
                'query': query,
                'dashboardId': $.App.dashboardId
            }

            $.ui._loadTpl('column', datas, function(err, out) {
                $("#page").append($(out))
                columns = $('#page .column')
                $(columns[columns.length - 1]).column()

                columns.removeClass('col-sm-' + (12/(columns.length - 1)))
                columns.addClass('col-sm-' + (12/columns.length))
            })
        },
        // jForm success method
        addTask: {
            success: function(data) {
                // FIXME should be merged with .on 'post:success'
                $.modal.closeModal()
                $(document.body).trigger('notify', ['Task saved', 'info'])
                $(".column").trigger('task:refresh')
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
                .modal('addTask', task, {
                    title: 'Task',
                    submit: {name: button, class: 'btn-primary'}
                },
                function($modal){
                    $modal.find('.jSelect').dashboardSelect()
                    $modal.find('textarea')[0].focus()
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
