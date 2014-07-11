;(function($) {
    'use strict';

    var dashboards = {
        $el: null,
        add: function(id, name) {
            if ($.App.dashboardId == null) {
                $.App.dashboardId = id
            }
            dashboards.$el.append('<option value="' + id + '">' + name + '</option>')
        },
        select: function(id) {

            if ($.App.dashboardId != dashboards.$el.val()) {
                $.App.dashboardId = dashboards.$el.val()
                $('.column').trigger('task:refresh')
            }
        }
    }

    Zepto(function($){
        dashboards.$el = $('.jDashboard')

        $.ajax({
            type: 'GET',
            url: '/dashboards',
            success: function(data){
                if (data.length == 0) {
                    $('#FatalError').show()
                    return
                }


                for (var dashboardId in data) {
                    dashboards.add(dashboardId, data[dashboardId].name)
                }
                dashboards.add("", "Add a new dashboard")

                dashboards.$el.on('change', function (e) {
                    if (dashboards.$el.val() == '') {
                        // launch modal to add a new dashboard
                         $('<form class="jForm" action="/dashboard/add" method="POST">')
                            .on('post:success', function (e, data){
                                // FIXME doesn't work
                                dashboards.$el.val(data.datas.id)
                                dashboards.select(data.datas.id)
                                $.modal.closeModal()
                            })
                            .modal('addDashboard', {}, {
                                title: 'Dashboard',
                                submit: {name: 'Add', class: 'btn-primary'}
                            })

                    } else {
                        dashboards.select(dashboards.$el.val())
                    }
                })
            },
            error: function(xhr, type){
                $('#FatalError').show()
            }
        })
    })

})(Zepto)
