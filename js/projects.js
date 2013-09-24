;(function($) {
    'use strict';

    $.projects = {
        element: {},
        init: function(){
            $.projects.element = $('#projects')

            $(document).on('click', '.jProjectSelect', function(e){
                // FIXME filter ?
                var $this = $(this)

                e.preventDefault()
                $(document.body).trigger('project:select', [$this.data('project')])
            })

            $(document).on('task:load', function(e){
                $.each($.task.projects, function(index, project) {
                    $.ui._loadTpl('project', {project: project}, function(err, out) {
                        $.projects.element.append(out)
                    })
                })
                $.ui._loadTpl('project', {project: 'default', label: 'label-info'}, function(err, out) {
                    $.projects.element.append(out)
                })
            })
        }
    }

    Zepto(function($) {
        $.projects.init();
    })

})(Zepto)
