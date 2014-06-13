;(function($) {
    'use strict';

    $.extend($.fn, {
        column: function(){
            return this.each(function (){
                var $this = $(this)
                console.log('column')
                console.log($this)
                $this.find('.jFormSearch').post()
                // todo handle refresh
            })
        }
    })


})(Zepto)
