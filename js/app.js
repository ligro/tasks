;(function($) {
    'use strict';

     $.App = {

        init: function() {

            $(document).one('templates:load', function(e){
                $.App.ui.init();
            })

            // TODO event on templates load
            $(document).one('state:load', function(e){
                if (typeof $.App.tasks === 'undefined') {
                    $(document).one('task:load', function(){
                        $('.tasksColumns').tasksColumns()
                    })
                } else {
                    $('.tasksColumns').tasksColumns()
                }
            })
        },
        addTask: {
            success: function(data) {
                $(document.body).trigger('task:saved', [data.datas])
                $(document.body).trigger('notify', ['Task saved', 'info'])
                $.App.tasks[data.datas._id] = data.datas
                $.App.ui.closeModal()
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
         closeModal: function(){
             $('.modal').parent().remove()
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
