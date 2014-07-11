;(function($) {
    'use strict';

    $.App = {
        dashboardId: null,
        init: function() {
            $(document).one('templates:load', function(e){
                $.App.ui.init();
                // perform an empty search to fill the page with task and tags
                $.App.addColumn()
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
        // jForm success method
        addTask: {
            success: function(data) {
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


             $('<form class="jForm" action="/savetask/" method="POST" data-method="addTask">')
                .on('post:success', function (e){
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
