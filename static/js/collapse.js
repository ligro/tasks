;(function($) {
    'use strict';

    var collapse = {
        toggle: function(){
            var $this = $(this)

            $($this.data('target')).toggleClass('in')
            $this.toggleClass('collapsed')
        }
    }

    Zepto(function($){
        $('.navbar-toggle').on('click', collapse.toggle);
    })

})(Zepto)
