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
            },
            99: {
                'key': 'c',
                'desc': 'Create a new task',
                'func' : function(e){ $.App.ui.taskEditModal() }
            },
            47: {
                'key': '/',
                'desc': 'Perform search',
                'func' : function(e){
                    $('#page input.search-query').focus()
                }
            }
        },
        init: function() {
            $(document).on('keypress', function(e){
                //console.log(e.target)
                // FIXME issue to unfocus from the search
                // FIXME issue when focus is on a link or a button
                if (e.target !== document.body) {
                    return true;
                }

                if (e.altKey || e.metaKey || e.ctrlKey || e.isComposing) {
                    return true;
                }

                var code = (e.charCode == 0) ? e.keyCode : e.charCode
                /**
                console.log(e)
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
        $.shortcuts.init()
    })

})(Zepto)
