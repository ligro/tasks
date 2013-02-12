;(function($){
    'use strict';

    $.extend($.fn, {
        modal: function(tpl, data, modalData)
        {
            var $this = $(this)

            $.App._loadTpl(tpl, data, function(err, out) {
                modalData.content = out
                $.App._loadTpl('modal', modalData, function(err, out) {
                    $this.html($(out))
                    $this.on('click', '.close', function(){ $this.remove() })
                    $('body').append($this)

                    // add events on buttons
                })
            })
        }
    })
})(Zepto)
