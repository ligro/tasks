;(function($) {
    'use strict';

    $.tag = {
        tags: {},
        init: function(){
            $(document).on('tag:refresh', function(e, tags){
                var $tags = $('.tags')

                // clear
                $tags.html('')
                // fill
                $.tag.tags = tags
                for (var tag in $.tag.tags) {
                    $.ui._loadTpl('tag', {'tag': tag, 'nb': $.tag.tags[tag]}, function(err, out) {
                        $tags.append($(out))
                    })
                }
            })
        }
    }

    Zepto(function($){
        $.tag.init();
    })

})(Zepto)
