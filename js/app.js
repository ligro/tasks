;(function($) {
    'use strict';

    $.App = {
        init: function() {

            $(document).one('templates:load', function(e){
                $.App.ui.init();
                // perform an empty search to fill the page with task and tags
                $.App.addColumn()
            })
            .on('click', '.task .jTaskModify', function(e){
                var $this = $(this),
                    task = $.task.tasks[$(e.target).closest('.task').data('id')]

                e.stopPropagation()
                // load modal with task value
                $.App.ui.taskEditModal(task)
            })
            .on('click', '.task .jTaskRemove', function(e){
                var $task = $(this).parent(),
                    id = $task.data('id')

                $.ajax({
                    type: 'POST',
                    url: '/rmtask/',
                    data: {id: id},
                    success: function(data){
                        delete $.task.tasks.id
                        $task.remove()
                        $(document.body).trigger('notify', ['Task removed', 'info']);
                    },
                    error: function(xhr, type){
                        $(document.body).trigger('notify', ['An error occured', 'error']);
                    }
                })
                e.stopPropagation()
            })
            .on('click', '.jColumnAdd', function(e) {
                $.App.addColumn()
            })
        },
        addColumn: function(){
            var columns

            $("#page").append($.templates.column)
            columns = $('#page .column')
            $(columns[columns.length - 1]).column()
        },
        addTask: {
            success: function(data) {
                $.modal.closeModal()
                $(document.body).trigger('notify', ['Task saved', 'info'])
                $.task.tasks[data.datas._id] = data.datas
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
             var button = 'Modify'
             if (typeof task === 'undefined') {
                 task = {}
                 button = 'Create'
             }


             $('<form class="jForm" action="/savetask/" method="POST" data-method="addTask">')
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
