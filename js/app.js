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

             $('<form class="jForm" action="/savetask">', {action: 'javascript:void(0);'})
                 .modal('addTask', task, {
                     title: 'Create task',
                     buttons: [
                         {name: 'Create', class: 'primary-btn', id: 'addTaskSave'}
                     ]
                 })
                 .on('click', '#addTaskSave', function (){
                     var $form = $(this).closest('form')

                     task = $form.getFields()
                     if (typeof task.task === 'undefined') {
                         $form.find('textarea[name="task"]').errorMsg('you must provide a task description');
                         return;
                     }

                     $form.post(function(){
                         // success
                         $(document.body).trigger('task:saved', [data])
                         $(document.body).trigger('notify', ['Task saved', 'info'])
                         $.App.tasks[data._id] = data
                         $.App.ui.closeModal()
                     });
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
