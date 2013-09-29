;(function($) {
    'use strict';

    $.shortcuts = {
        shortcuts: {
            63: {
                'key': '?',
                'desc': 'display this help',
                'func': function(e){
                    var data = {shortcuts: []}
                    for (var i in $.shortcuts.shortcuts) {
                        data.shortcuts.push($.shortcuts.shortcuts[i])
                    }
                    $('<div>')
                        .modal('shortcuthelp', data, {title: 'Help', id: 'help'})
                    console.log('help')
                }
            }
        },
        init: function(shortcuts) {
        // fixme listen only on body ?
            $(document).on('keypress', function(e){
                if (e.target !== document.body) {
                    return true;
                }
                var code = (e.charCode == 0) ? e.keyCode : e.charCode
                if (typeof $.shortcuts.shortcuts[code] === 'object'
                    && typeof $.shortcuts.shortcuts[code]['func'] === 'function'
                ) {
                    console.log(e)
                    console.log(code)
                    e.preventDefault()
                    $.shortcuts.shortcuts[code]['func'](e)
                }
            });
        }
    }

    Zepto(function($) {
        $.shortcuts.init({})
    })

})(Zepto)
