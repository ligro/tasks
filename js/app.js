;(function($) {
    'use strict';

     $.App = {

        templates: {},

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

            // retrieve templates
            // TODO handles error
            $.ajax({
                type: 'GET',
                url: '/templates',
                // type of data we are expecting in return:
                dataType: 'json',
                success: function(data){
                    $.App.templates = data;
                    $(document.body).trigger('templates:load')
                },
                error: function(xhr, type){
                    // @TODO show ui error to specify we can't run
                }
            })
        },
        _loadTpl: function(name, data, end) {
            typeof dust.cache[name] === 'undefined'
                && dust.loadSource(dust.compile($.App.templates[name], name))

            dust.render(name, data, end)
        },

     }

     $.App.ui = {
         init: function(){
             $('a.jLink').on('click', function(e){
                 var func = $(this).data('func')+'_link';
                 e.stopPropagation()
                 if (typeof $.App.ui[func] == 'function') {
                     $.App.ui[func].call();
                 }
             })
         },
         closeModal: function(){
             $('.modal').parent().remove()
         },
         taskEditModal: function(task){
            typeof task === 'undefined'
               && (task = {})

             $('<form>', {action: 'javascript:void(0);'})
                 .modal('addTask', task, {
                     title: 'Create task',
                     buttons: [
                         {name: 'Create', class: 'primary-btn', id: 'addTaskSave'}
                     ]
                 })
                 .on('click', '#addTaskSave', function (){
                     var $this = $(this)

                     task = $this.closest('form').getFormFields()
                     $.task.save(task, function(){
                         console.log('saved task')
                         // success
                         //FIXME move it to modal.js // event ?
                         $.App.ui.closeModal()
                     },
                     function(msg){
                         // error
                         // display error
                         console.log(msg)
                     })
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
