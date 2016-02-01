;(function($) {
    'use strict';

    $.ui = {
        templates: {},
        notifyLevels: {
            debug: ['Dev debug', 'alert-info'],
            info: ['Information', 'alert-info', 3000],
            success: ['Success', 'alert-success', 3000],
            warning: ['Warning', 'alert-warning', 5000],
            error: ['Error', 'alert-danger']
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
            $.ajaxPromise({
                type: 'GET',
                url: '/templates/',
                // type of data we are expecting in return:
                dataType: 'json'
            })
            .then(function(data){
                if (Object.keys(data).length == 0) {
                    return Promise.reject('no template found');
                }
                $.templates = data;
                $(document.body).trigger('templates:load')
            })
            .catch(function(data){
                console.log('CATCH initTemplates', data);
                $('#FatalError').show()
            })
         },
         initNotifications: function(){
             $(document).on('notify', function(e, msg, type){
                 // handle default values
                 (typeof type === "undefined"
                  || typeof $.ui.notifyLevels[type] === "undefined"
                 ) && (type = "info")

                 var id = $.ui.notifyId++

                 $.ui._loadTplPromise(
                     'alert',
                     {
                         level_label: $.ui.notifyLevels[type][0],
                         class: $.ui.notifyLevels[type][1],
                         msg: msg,
                         id: id
                     }
                 ).then(function(out) {
                     $('.alerts').prepend($(out))
                 })

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
            if (typeof $.templates[name] === 'undefined') {
                throw 'template ' + name + ' not found';
            }
            typeof dust.cache[name] === 'undefined'
                && dust.loadSource(dust.compile($.templates[name], name))

            dust.render(name, data, end)
        },
        _loadTplPromise: function(name, data) {
            return new Promise(function (resolve, reject) {
                $.ui._loadTpl(name, data, function (err, out){
                    if (err) {
                        console.error(err)
                        reject(err)
                    }
                    resolve(out)
                })
            })
        }
     }

    Zepto(function($){
        $.ui.init();
    })

})(Zepto)
