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
                }
            }
        },
        init: function(shortcuts) {
            $.extend($.shortcuts.shortcuts, shortcuts)
            $(document).on('keypress', function(e){
                if (e.target !== document.body) {
                    return true;
                }
                var code = (e.charCode == 0) ? e.keyCode : e.charCode
                /**console.log(e)
                console.log(code)
                /**/
                if (typeof $.shortcuts.shortcuts[code] === 'object'
                    && typeof $.shortcuts.shortcuts[code]['func'] === 'function'
                ) {
                    e.preventDefault()
                    $.shortcuts.shortcuts[code]['func'](e)
                }
            });
        }
    }

    Zepto(function($) {
        $.shortcuts.init({
            99: {
                'key': 'c',
                'desc': 'Create a new task',
                'func' : function(e){ $.App.ui.taskEditModal() }
            }
        })
    })

})(Zepto)
