;(function($){
    'use strict';

    $.extend($.fn, {
        modal: function(tpl, data, modalData) {
            var $this = $(this)

            return $.ui._loadTplPromise(tpl, data)
                .then(function(out) {
                    modalData.content = out
                    return $.ui._loadTplPromise('modal', modalData)
                })
                .then(function(out) {

                    $this.html($(out).css('display', 'block').addClass('in'))

                    // add close event
                    $this.on('click', '.close', function(){ $this.remove() })
                    $('body').append($this)

                    return $this
                })
                .catch(function(e){
                    console.log(e)
                })
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
