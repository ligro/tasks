;(function($) {
    'use strict';

    $.tags = {
        element: {},
        init: function(){
            $.tags.element = $('#tags')
            $(document).on('tags:add', function(e, tag){
                $.tags.element.css('display', 'block')
                $.ui._loadTpl('tag', {tag: tag}, function(err, out) {
                    $.tags.element.append(out)
                })
            })

            $(document).on('click', '.jTagFilter', function(e){
                var $this = $(this)
                e.preventDefault()
                $this.find('.label').toggleClass('label-info')
                console.log($this.data('tag'))
                $(document.body).trigger('tag:filter', [$this.data('tag')])
            })

            $(document).on('tag:filter', function(e, tag){
                console.log('tag:filter')
                console.log('.jTagFilter'+tag)
                console.log($('.jTagFilter'+tag))
                $('.jTagFilter'+tag).toggle();
                console.log($('.jTagFilter'+tag))
            })
        }
    }

    Zepto(function($) {
        $.tags.init()
    })

})(Zepto)
