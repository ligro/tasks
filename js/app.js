;(function($) {
    'use strict';

     $.App = {
        init: function() {

            $(document).one('templates:load', function(e){
                $.App.ui.init();
            })

            // TODO event on templates load
            $(document).one('state:load', function(e){
                if (!$.task.initialized) {
                    $(document).one('task:load', function(){
                        $('.tasksColumns').tasksColumns()
                        $(document.body).trigger('task:refresh')
                    })
                } else {
                    $('.tasksColumns').tasksColumns()
                    $(document.body).trigger('task:refresh')
                }
            })
        },
        addTask: {
            success: function(data) {
                $.modal.closeModal()
                $(document.body).trigger('task:saved', [data.datas])
                $(document.body).trigger('notify', ['Task saved', 'info'])
                $.task.tasks[data.datas._id] = data.datas
                for (var k in data.datas.tags) {
                    if (-1 == $.inArray(data.datas.tags[k], $.tags.tags)) {
                        $(document.body).trigger('tags:add', [data.datas.tags[k]])
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

            typeof task.project === 'undefined'
                && (task.project = $.projects.current)

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
