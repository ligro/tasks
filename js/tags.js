;(function($) {
    'use strict';

    $.tags = {
        tags: [],
        // where we put the list of tags
        element: {},
        tagsToShow: {},
        init: function(){
            $.tags.element = $('#tags')
            $(document).on('tags:add', function(e, tag){
                if ($.inArray(tag, $.tags.tags)) {
                    $.tags.tags.push(tag)
                }
                $.tags.element.css('display', 'block')
                $.ui._loadTpl('tag', {tag: tag}, function(err, out) {
                    $.tags.element.append(out)
                })
            })

            $(document).on('click', '.jTagFilter', function(e){
                var $this = $(this),
                    $label = $this.find('.label')

                e.preventDefault()
                $label.toggleClass('label-info')
                $(document.body).trigger('tag:filter', [
                    $this.data('tag'), $label.hasClass('label-info')
                ])
            })

            $(document).on('tag:filter', function(e, tag, selected) {
                if (!selected) {
                    delete $.tags.tagsToShow[tag]
                    var count = 0;
                    for (var k in $.tags.tagsToShow) {
                        count = 1;
                    }
                    if (!count) {
                        $('.task').show();
                        return
                    }
                } else {
                    $.tags.tagsToShow[tag] = tag;
                }

                $('.task').hide();

                var classes = []
                for (var i in $.tags.tagsToShow) {
                    classes.push('.jTagFilter'+i)
                }
                $(classes.join(', ')).show();
            })
        }
    }

    Zepto(function($) {
        $.tags.init()
    })

})(Zepto)
