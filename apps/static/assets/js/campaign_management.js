$(document).ready(function () {
    //weather
    $.ajax({
        url: 'https://api.openweathermap.org/data/2.5/weather',
        type: 'GET',
        data: {lat: '6.9271', lon: '79.8612', appid: 'b70aec80b5664714ac487a6d4309b4ad', units: 'metric'},
        dataType: 'json',
        success: function (msg) {
            $('.w-temp').text(msg.main['temp']);
            $('.w-feel-temp').text(msg.main['feels_like']);
            $('.w-clouds').text(msg.weather[0]['description']);
            let imrUrl = "http://openweathermap.org/img/wn/" + msg.weather[0]['icon'] + "@2x.png";
            $('.icon-weather').attr('src', imrUrl);
        },
        error: function (request, status, error) {
            //alert(request);
        }
    });

    // DateRangePicker Start
	var start = moment().subtract('months', 1);
	var end = moment();

    // $('#datePicker').daterangepicker({
    //     opens: 'center',
    //     drops: 'auto',
    //     startDate: start,
    //     endDate: end,
    //     maxDate: end,
    //     showDropdowns: true,
	// 	locale: {                                // Formatting options
	// 		format: 'MMMM D, YYYY'               // Set display format
	// 	}
    // },);

    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var today = ((''+month).length<2 ? '0' : '') + month + '/' +((''+day).length<2 ? '0' : '') + day
        + '/' + d.getFullYear() ;

    var beforeWeek = moment().subtract('days', 7).format('DD-MM-YYYY');
    today = moment().format('DD-MM-YYYY');

    $('#datePicker').daterangepicker({
        "showCustomRangeLabel": false,
        "startDate": beforeWeek,
        "endDate": today,
        locale: {
            format: 'DD-MM-YYYY'
        }
    });
    // DateRangePicker End
    
    // DataTable Start
    $('#tableCampaignManagement').DataTable({
        searching: true, 
        paging: true, 
        info: true, 
        ordering: false,
        "pageLength": 5,
        "bLengthChange" : false,
        language: {
            'paginate': {
              'previous': '<span class="prev-icon"><i class="fa fa-angle-double-left"></i></span>',
              'next': '<span class="next-icon"><i class="fa fa-angle-double-right"></i></span>'
            }
        },
        "initComplete": function () {
            $('#tableCampaignManagement_paginate').css('float', 'right');
        }
    });
    // DataTable End
});

//Responsive view for data table
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    $($.fn.dataTable.tables(true)).DataTable()
        .columns.adjust()
        .responsive.recalc();
});