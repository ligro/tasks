;(function($) {
    'use strict';

    $.projects = {
        element: {},
        init: function(){
            $.projects.element = $('#projects')
            $(document).on('tasks:load', function(e, tag){
                if ($.task.projects.length > 1) {
                    // display project list
                } else {
                    // hide dropdown, display add link
                }
            })
        }
    }

    Zepto(function($) {
    })

})(Zepto)
