;(function($) {
    'use strict';

    $.extend($.fn, {
        dashboardSelect: function(){
            return this.each(function (){
                var $this = $(this)
                dashboards.getDashboard().then(function(dashboardsList){
                    $this.select(dashboardsList, dashboards.current)
                })
                .catch(function(data){
                    console.log('dashboardSelect', data);
                })
            })
        }
    })

    var dashboards = {
        list: {},
        $el: null,
        current: null,
        select: function(id) {
            if (dashboards.current != id) {
                dashboards.current = id
                $(document.body).trigger('dashboard:change', [dashboards.current])
                window.localStorage.setItem('dashboardId', dashboards.current)
            }
        },
        getDashboard: function(){
            if (dashboards.list == null) {
                return Promise.resolve(dashboards.list);
            }
            return $.ajaxPromise({
               type: 'GET',
               url: '/dashboards',
            })
            .then(function(data){
                if (data.length == 0) {
                    $('#FatalError').show()
                    return []
                }

                for (var dashboardId in data) {
                    dashboards.list[dashboardId] = data[dashboardId].name
                }

                return dashboards.list
            })
            .catch(function(data){
                console.error('getDashboard catch', data)
                return []
            })
        },
        init: function() {
            dashboards.$el = $('.jDashboard')
            $(document).one('templates:load', function(e){
                dashboards.getDashboard().then(function(dashboardsList){
                    var defaultDashboardId = false,
                        options = dashboardsList

                    for (var dashboardId in dashboardsList) {
                        !defaultDashboardId && (defaultDashboardId = dashboardId)
                    }
                    options[""] = "All my tasks"
                    options["add"] = "Add a new dashboard"

                    dashboards.$el.select(options)

                    dashboards.$el.on('select:change', function (e, id) {
                        console.log('select:change', id)
                        if (id == 'add') {
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
                            dashboards.select(id)
                        }
                    })

                    var currentDashboardId = window.localStorage.getItem('dashboardId')
                    if (!currentDashboardId) {
                        currentDashboardId = defaultDashboardId
                    }
                    dashboards.$el.val(currentDashboardId)
                    dashboards.select(currentDashboardId)
                })
                .catch(function(data){
                    console.log('dashboards.init catch', data)
                    $('#FatalError').show()
                })
            })
        }
    }

    Zepto(function($){
        dashboards.init()
    })

})(Zepto)
