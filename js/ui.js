;(function($) {
    'use strict';

     $.ui = {
         templates: {},
         notifyLevels: {
             debug: ['Dev debug', 'alert-info'],
             info: ['Information', 'alert-info'],
             success: ['Success', 'alert-success'],
             warning: ['Warning', ''],
             error: ['Error', 'alert-error']
         },

         init: function(){
             $(document).on('submit', 'form.jForm', function(e){
                 $(this).post()
                 return false
             })

             $.ui.initTemplates()
             $(document).one('templates:load', function(e){
                 $.ui.initNotifications()
             })
         },
         initTemplates: function(){
            // retrieve templates
            $.ajax({
                type: 'GET',
                url: '/templates/',
                // type of data we are expecting in return:
                dataType: 'json',
                success: function(data){
                    $.templates = data;
                    $(document.body).trigger('templates:load')
                },
                error: function(xhr, type){
                    $('#FatalError').show()
                }
            })
         },
         initNotifications: function(){
             $(document).on('notify', function(e, msg, type){
                 // handle default values
                 (typeof type === "undefined"
                  || typeof $.ui.notifyLevels[type] === "undefined"
                 ) && (type = "info")

                 $.ui._loadTpl(
                     'alert',
                     {
                         level_label: $.ui.notifyLevels[type][0],
                         class: $.ui.notifyLevels[type][1],
                         msg: msg
                     },
                     function(err, out) {
                         $('#page')
                            .prepend($(out))
                     }
                 )
             })

             $(document).on('click', '.alert button.close', function(){
                 $(this).closest('.alert').remove()
             })
         },
        _loadTpl: function(name, data, end) {
            typeof dust.cache[name] === 'undefined'
                && dust.loadSource(dust.compile($.templates[name], name))

            dust.render(name, data, end)
        }
     }

    Zepto(function($){
        $.ui.init();
    })

})(Zepto)
