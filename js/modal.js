;(function($){
    'use strict';

    $.extend($.fn, {
        modal: function(tpl, data, modalData){
            var $this = $(this)

        console.log(data)
            $.ui._loadTpl(tpl, data, function(err, out) {

                modalData.content = out
        console.log(modalData)
                $.ui._loadTpl('modal', modalData, function(err, out) {

                    $this.html($(out))
                    // add close event
                    $this.on('click', '.close', function(){ $this.remove() })
                    $('body').append($this)
                })
            })

            return $this
        }
    })
})(Zepto)
