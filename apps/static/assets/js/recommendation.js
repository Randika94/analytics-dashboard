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

    // StartDateRangePicker Start
    $('#startDatePicker').val(moment().format('YYYY-MM-DD'));
  
    $('#startDatePicker').datepicker({
        format: "yyyy-mm-dd",
        autoclose: true, 
        todayHighlight: true,
        startDate: "2010-01-01"
    });
    // StartDateRangePicker End

    // EndDateRangePicker Start
    $('#endDatePicker').val(moment().format('YYYY-MM-DD'));
    
    $('#endDatePicker').datepicker({
        format: "yyyy-mm-dd",
        autoclose: true, 
        todayHighlight: true,
        startDate: "2010-01-01"
    });
    // EndDateRangePicker End
    
    // DataTable Start
    $('#tableActiveUsers').DataTable({
        searching: true, 
        paging: true, 
        info: true, 
        ordering: false,
        "pageLength": 10,
        "bLengthChange" : false,
        language: {
            'paginate': {
              'previous': '<span class="prev-icon"><i class="fa fa-angle-double-left"></i></span>',
              'next': '<span class="next-icon"><i class="fa fa-angle-double-right"></i></span>'
            }
        },
        "initComplete": function () {
            $('#tableActiveUsers_paginate').css('float', 'right');
        }
    });

    $('#tableInactiveUsers').DataTable({
        searching: true, 
        paging: true, 
        info: true, 
        ordering: false,
        "pageLength": 10,
        "bLengthChange" : false,
        language: {
            'paginate': {
              'previous': '<span class="prev-icon"><i class="fa fa-angle-double-left"></i></span>',
              'next': '<span class="next-icon"><i class="fa fa-angle-double-right"></i></span>'
            }
        },
        "initComplete": function () {
            $('#tableInactiveUsers_paginate').css('float', 'right');
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

$(document).ready(function () {
    $('.create-campaign').slideUp();
    $('.is-create-campaign').change(function () {
        if ($(this).is(':checked')) {
            $('.create-campaign').slideDown(); // Show the div with a slide-down animation
        } else {
            $('.create-campaign').slideUp(); // Hide the div with a slide-up animation
        }
    });
});