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

    // Sales Overview DatePicker Start
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth();
    var currentYear = currentDate.getFullYear(); 
    var formattedDate = currentDate.toLocaleString('default', { month: 'long' }) + ", " + currentYear;

    $('#salesOverviewDatePicker').val(formattedDate);
  
    $('#dateTimePickerOne').datepicker({
        format: "MM, yyyy",
        minViewMode: 1,
        startDate: "2010-01",
        autoclose: true,
        todayHighlight: true
    });
    // Sales Overview DatePicker End

    // Top Merchants DateRangePicker Start
	var start = moment().subtract('months', 1);
	var end = moment();

    $('#topMerchantDateRangePicker').daterangepicker({
        opens: 'center',
        drops: 'auto',
        startDate: start,
        endDate: end,
        maxDate: end,
        showDropdowns: true,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
		locale: {                                // Formatting options
			format: 'MMMM D, YYYY'               // Set display format
		}
    },);
    // Top Merchants DateRangePicker End
    
    // Top Merchants DataTable Start
    $('#topMerchantsTable').DataTable({
        "dom": 'rtip',
        searching: false, 
        paging: true, 
        info: false, 
        ordering: false,
        "pageLength": 5,
        language: {
            'paginate': {
              'previous': '<span class="prev-icon"><i class="fa fa-angle-double-left"></i></span>',
              'next': '<span class="next-icon"><i class="fa fa-angle-double-right"></i></span>'
            }
        },
        "initComplete": function () {
            $('#topMerchantsTable_paginate').css('float', 'right');
        }
    });
    // Top Merchants DataTable End
});

//
// Charts
//

'use strict';

var Charts = (function() {

	// Variable

	var $toggle = $('[data-toggle="chart"]');
	var mode = 'light';//(themeMode) ? themeMode : 'light';
	var fonts = {
		base: 'Open Sans'
	}

	// Colors
	var colors = {
		gray: {
			100: '#f6f9fc',
			200: '#e9ecef',
			300: '#dee2e6',
			400: '#ced4da',
			500: '#adb5bd',
			600: '#8898aa',
			700: '#525f7f',
			800: '#32325d',
			900: '#212529'
		},
		theme: {
			'default': '#172b4d',
			'primary': '#5e72e4',
			'secondary': '#f4f5f7',
			'info': '#11cdef',
			'success': '#2dce89',
			'danger': '#f5365c',
			'warning': '#fb6340'
		},
		black: '#12263F',
		white: '#FFFFFF',
		transparent: 'transparent',
	};


	// Methods

	// Chart.js global options
	function chartOptions() {

		// Options
		var options = {
			defaults: {
				global: {
					responsive: true,
					maintainAspectRatio: false,
					defaultColor: (mode == 'dark') ? colors.gray[700] : colors.gray[600],
					defaultFontColor: (mode == 'dark') ? colors.gray[700] : colors.gray[600],
					defaultFontFamily: fonts.base,
					defaultFontSize: 13,
					layout: {
						padding: 0
					},
					legend: {
						display: false,
						position: 'bottom',
						labels: {
							usePointStyle: true,
							padding: 16
						}
					},
					elements: {
						point: {
							radius: 0,
							backgroundColor: colors.theme['primary']
						},
						line: {
							tension: .4,
							borderWidth: 4,
							borderColor: colors.theme['primary'],
							backgroundColor: colors.transparent,
							borderCapStyle: 'rounded'
						},
						rectangle: {
							backgroundColor: colors.theme['warning']
						},
						arc: {
							backgroundColor: colors.theme['primary'],
							borderColor: (mode == 'dark') ? colors.gray[800] : colors.white,
							borderWidth: 4
						}
					},
					tooltips: {
						enabled: true,
						mode: 'index',
						intersect: false,
					}
				},
				doughnut: {
					cutoutPercentage: 83,
					legendCallback: function(chart) {
						var data = chart.data;
						var content = '';

						data.labels.forEach(function(label, index) {
							var bgColor = data.datasets[0].backgroundColor[index];

							content += '<span class="chart-legend-item">';
							content += '<i class="chart-legend-indicator" style="background-color: ' + bgColor + '"></i>';
							content += label;
							content += '</span>';
						});

						return content;
					}
				}
			}
		}

		// yAxes
		Chart.scaleService.updateScaleDefaults('linear', {
			gridLines: {
				borderDash: [2],
				borderDashOffset: [2],
				color: (mode == 'dark') ? colors.gray[900] : colors.gray[300],
				drawBorder: false,
				drawTicks: false,
				drawOnChartArea: true,
				zeroLineWidth: 0,
				zeroLineColor: 'rgba(0,0,0,0)',
				zeroLineBorderDash: [2],
				zeroLineBorderDashOffset: [2]
			},
			ticks: {
				beginAtZero: true,
				padding: 10,
				callback: function(value) {
					if (!(value % 10)) {
						return value
					}
				}
			}
		});

		// xAxes
		Chart.scaleService.updateScaleDefaults('category', {
			gridLines: {
				drawBorder: false,
				drawOnChartArea: false,
				drawTicks: false
			},
			ticks: {
				padding: 20
			},
			maxBarThickness: 10
		});

		return options;

	}

	// Parse global options
	function parseOptions(parent, options) {
		for (var item in options) {
			if (typeof options[item] !== 'object') {
				parent[item] = options[item];
			} else {
				parseOptions(parent[item], options[item]);
			}
		}
	}

	// Push options
	function pushOptions(parent, options) {
		for (var item in options) {
			if (Array.isArray(options[item])) {
				options[item].forEach(function(data) {
					parent[item].push(data);
				});
			} else {
				pushOptions(parent[item], options[item]);
			}
		}
	}

	// Pop options
	function popOptions(parent, options) {
		for (var item in options) {
			if (Array.isArray(options[item])) {
				options[item].forEach(function(data) {
					parent[item].pop();
				});
			} else {
				popOptions(parent[item], options[item]);
			}
		}
	}

	// Toggle options
	function toggleOptions(elem) {
		var options = elem.data('add');
		var $target = $(elem.data('target'));
		var $chart = $target.data('chart');

		if (elem.is(':checked')) {

			// Add options
			pushOptions($chart, options);

			// Update chart
			$chart.update();
		} else {

			// Remove options
			popOptions($chart, options);

			// Update chart
			$chart.update();
		}
	}

	// Update options
	function updateOptions(elem) {
		var options = elem.data('update');
		var $target = $(elem.data('target'));
		var $chart = $target.data('chart');

		// Parse options
		parseOptions($chart, options);

		// Toggle ticks
		toggleTicks(elem, $chart);

		// Update chart
		$chart.update();
	}

	// Toggle ticks
	function toggleTicks(elem, $chart) {

		if (elem.data('prefix') !== undefined || elem.data('prefix') !== undefined) {
			var prefix = elem.data('prefix') ? elem.data('prefix') : '';
			var suffix = elem.data('suffix') ? elem.data('suffix') : '';

			// Update ticks
			$chart.options.scales.yAxes[0].ticks.callback = function(value) {
				if (!(value % 10)) {
					return prefix + value + suffix;
				}
			}

			// Update tooltips
			$chart.options.tooltips.callbacks.label = function(item, data) {
				var label = data.datasets[item.datasetIndex].label || '';
				var yLabel = item.yLabel;
				var content = '';

				if (data.datasets.length > 1) {
					content += '<span class="popover-body-label mr-auto">' + label + '</span>';
				}

				content += '<span class="popover-body-value">' + prefix + yLabel + suffix + '</span>';
				return content;
			}

		}
	}


	// Events

	// Parse global options
	if (window.Chart) {
		parseOptions(Chart, chartOptions());
	}

	// Toggle options
	$toggle.on({
		'change': function() {
			var $this = $(this);

			if ($this.is('[data-add]')) {
				toggleOptions($this);
			}
		},
		'click': function() {
			var $this = $(this);

			if ($this.is('[data-update]')) {
				updateOptions($this);
			}
		}
	});


	// Return

	return {
		colors: colors,
		fonts: fonts,
		mode: mode
	};

})();

'use strict';

//
// Sales chart
//

$(document).ready(function () {
    pieChart()
});

function pieChart() {
    var TypeChart = (function () {
		var $chart = $('#chart-type');

		// Init chart
		function initPieChart($chart) {


			var TypeChart = new Chart($chart, {
				type: 'pie',
				options: {
					legend: {
						display: true,
					},
				},
				data: {
					labels: ['Marketing Suitable Customers', 'Low CC Usage Customers',  'Total Transactions'],
					datasets: [{
						label: 'Sales',
						backgroundColor: ["#4e499b", "#0c182d", "#2b2728"],
						data: [2356,924, 1200]
					}]
				}
			});

			// Save to jQuery object
			$chart.data('chart', TypeChart);
		}


		// Init chart
		if ($chart.length) {
			initPieChart($chart);
		}

	})();
}

function filterDashboardKPI() {
    let selectedDate = $('#salesOverviewDatePicker').prop('value');
    let monthName = selectedDate.split(',')[0].trim();
    let year = selectedDate.split(',')[1].trim();
    let monthNumber = (new Date(Date.parse(monthName + " 1")).getMonth() + 1).toString().padStart(2, '0');
    let salesDate = year+'-'+monthNumber;
    let bank = $('#salesOverviewBankName :selected').prop('value');

    $.ajax({
        url: '/filter-sales-kpi',
        type: 'POST',
        data: {
            _token: $('meta[name="csrf-token"]').attr('content'),
            month: monthNumber,
            year: year,
            client_id: bank
        },
        dataType: 'json',
        success: function(response) {

            if (response.error_code == false) {
                let totalSales = parseInt(response.dashboardMetrics.total_sales).toLocaleString('en-US');
                let totalOrderCount = parseInt(response.dashboardMetrics.total_order_count).toLocaleString('en-US');
                $('#totalSales').text(totalSales);
                $('#totalOrderCount').text(totalOrderCount);

                let eVoucherTotalSales = parseInt(response.dashboardMetrics.evoucher_total_sales).toLocaleString('en-US');
                let eVoucherOrderCount = parseInt(response.dashboardMetrics.evoucher_order_count).toLocaleString('en-US');
                $('#eVoucherTotalSales').text(eVoucherTotalSales);
                $('#eVoucherOrderCount').text(eVoucherOrderCount);

                let f2fTotalSales = parseInt(response.dashboardMetrics.f2f_total_sales).toLocaleString('en-US');
                let f2fOrderCount = parseInt(response.dashboardMetrics.f2f_order_count).toLocaleString('en-US');
                $('#f2fTotalSales').text(f2fTotalSales);
                $('#f2fOrderCount').text(f2fOrderCount);

                let mallTotalSales = parseInt(response.dashboardMetrics.mall_total_sales).toLocaleString('en-US');
                let mallOrderCount = parseInt(response.dashboardMetrics.mall_order_count).toLocaleString('en-US');
                $('#mallTotalSales').text(mallTotalSales);
                $('#mallOrderCount').text(mallOrderCount);

                let redemptionChartData = response.dashboardMetrics.redemption_chart;
                updatePieChart(redemptionChartData);
            } else {
                $('.alert-danger').addClass('show');
                $('.alert-inner--text').html('<b>Error! </b> Something went wrong while filtering!');
                setTimeout(function () {
                    $('.alert-danger').removeClass('show');
                }, 500);
                location.reload();
            }
            
        }
    });
}

function updatePieChart(data) {
    var $chart = $('#chart-type');

    // Define static labels
    const staticLabels = ['E-Vouchers', 'Shopping Mall', 'Face To Face'];

    // Check if the chart already exists
    if ($chart.data('chart')) {
        // If the chart already exists, update the data only
        const chartInstance = $chart.data('chart');
        chartInstance.data.datasets[0].data = data;
        chartInstance.update(); // Update the chart with the new data
    } else {
        // Initialize a new chart if it doesn't exist yet
        var TypeChart = new Chart($chart, {
            type: 'pie',
            options: {
                legend: {
                    display: true,
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, chartData) {
                            // Get the index of the hovered segment
                            const index = tooltipItem.index;

                            // Retrieve the value and label for the segment
                            const value = chartData.datasets[0].data[index];
                            const label = staticLabels[index] || '';

                            // Return label and value only if value > 0
                            if (value > 0) {
                                return `${label}: ${value}`;
                            } else {
                                return null; // Skip tooltip for zero values
                            }
                        }
                    }
                }
            },
            data: {
                labels: staticLabels,
                datasets: [{
                    label: 'Sales',
                    backgroundColor: ["#509c1c", "#172b4d", "#2b2728"],
                    data: data
                }]
            }
        });

        // Save the chart object
        $chart.data('chart', TypeChart);
    }
}

$('#topMerchantDateRangePicker').on('apply.daterangepicker', function (ev, picker) {
	let start_date = picker.startDate.format('YYYY-MM-DD');
	let end_date = picker.endDate.format('YYYY-MM-DD');
	let CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');
console.log(start_date, end_date, CSRF_TOKEN);

	$.ajax({
		type: 'POST',
		url: '/filter-merchants',
		data: {
			_token: CSRF_TOKEN,
			start_date: start_date,
			end_date: end_date
		},
		dataType: 'json',
		success: function (data) {
			let table = $('#topMerchantsTable').DataTable();
			table.clear().draw();

			if (data.error_code === true && data.error_code == '1004') {
				$('.alert-danger').addClass('show');
				$('.alert-inner--text').html('<b>Error! </b> Something went wrong while filtering!');
				setTimeout(function () {
					$('.alert-danger').removeClass('show');
				}, 500);
				location.reload();
			} else {
				let merchants = data.top_merchants;
				$.each(merchants, function (index, obj) {
					table.row.add([
						obj.merchant_name,
						obj.total.toLocaleString('en-US')
					]).draw(false);
				});
			}
		
		}
	});
});
