;(function($) {
    'use strict';

    $.ui = {
        templates: {},
        notifyLevels: {
            debug: ['Dev debug', 'alert-info'],
            info: ['Information', 'alert-info', 3000],
            success: ['Success', 'alert-success', 3000],
            warning: ['Warning', '', 5000],
            error: ['Error', 'alert-error']
        },
        notifyId: 0,

         init: function(){
             $(document).on('submit', 'form.jForm', function(e){
                 e.preventDefault()
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

                 var id = $.ui.notifyId++

                 $.ui._loadTpl(
                     'alert',
                     {
                         level_label: $.ui.notifyLevels[type][0],
                         class: $.ui.notifyLevels[type][1],
                         msg: msg,
                         id: id
                     },
                     function(err, out) {
                         $('.alerts').prepend($(out))
                     }
                 )

                 if (typeof $.ui.notifyLevels[type][2] != 'undefined') {
                    setTimeout(function(){
                            $(document.body).trigger('notify:timeout', [id])
                        },
                        $.ui.notifyLevels[type][2]
                    )
                 }
             })

             $(document).on('notify:timeout', function(e, id){
                 $('#notify-'+id).remove()
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
