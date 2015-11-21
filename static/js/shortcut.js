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
                    // FIXME found the current column, or take the first one
                    $('#page input.jSearchQuery').focus()
                }
            },
            106: {
                'key': 'j',
                'desc': 'Focus task down',
                'func' : function(e){
                    // TODO
                }
            },
            107: {
                'key': 'k',
                'desc': 'Focus task up',
                'func' : function(e){
                    // TODO
                }
            },
            104: {
                'key': 'h',
                'desc': 'Focus column at left',
                'func' : function(e){
                    // TODO
                }
            },
            108: {
                'key': 'l',
                'desc': 'Focus column at right',
                'func' : function(e){
                    // TODO
                }
            },
            101: {
                'key': 'e',
                'desc': 'Edit focused task',
                'func' : function(e){
                    // TODO
                }
            },
            116: {
                'key': 't',
                'desc': 'Tag focused task',
                'func' : function(e){
                    // TODO
                }
            },
            100: {
                'key': 'd',
                'desc': 'Delete focused task',
                'func' : function(e){
                    // TODO
                }
            },
        },
        init: function() {
            $(document).on('keypress', function(e){
                // FIXME issue to unfocus from the search
                // FIXME issue when focus is on a link or a button
                if (e.target !== document.body) {
                    return true;
                }

                if (e.altKey || e.metaKey || e.ctrlKey || e.isComposing) {
                    return true;
                }

                var code = (e.charCode == 0) ? e.keyCode : e.charCode
                /**/
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
