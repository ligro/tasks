;(function($){
    'use strict';

    $.extend($.fn, {
        modal: function(tpl, data, modalData){
            var $this = $(this)

            $.modal.closeModal()

            $.ui._loadTpl(tpl, data, function(err, out) {

                modalData.content = out
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

    $.modal = {
        init: function(){
            $(document).on('keypress', function(e){
                if (e.keyCode == '27') {
                    $.modal.closeModal()
                }
            })
        },
        closeModal: function(){
            $('.modal').parent().remove()
        }
   }

    Zepto(function($) {
        $.modal.init()
    })

})(Zepto)
