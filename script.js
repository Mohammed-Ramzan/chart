let image_hover = document.querySelectorAll(".info-svg");
let exp_two = document.querySelectorAll(".explanation");

image_hover.forEach((img, index) => {
    img.addEventListener("mouseover", function() {
        exp_two[index].style.display = "block";
    });
    
    img.addEventListener("mouseout", function() {
        exp_two[index].style.display = "none";
    });
});



var monthlyBillInput, yearlyIncreaseInput, chart, lastValueDiv, chartSlider, sliderValueDiv, total_years, currentValueDiv, result_data, total_payment;

        document.addEventListener("DOMContentLoaded", function () {
            // Get the input elements
            monthlyBillInput = document.getElementById('monthly-bill-input');
            yearlyIncreaseInput = document.getElementById('yearlyIncrease');
            chartSlider = document.getElementById('chartSlider');
            sliderValueDiv = document.getElementById('sliderValue');
            currentValueDiv = document.getElementById('c-epayment');
            lastValueDiv = document.getElementById('f-epayment');
            result_data = document.querySelector('.result-data');
            total_payment = document.querySelector('.total-payment');
            total_years = document.querySelector('.total-ynum');

            // Get the canvas element
            var canvas = document.getElementById('billChart');
            var ctx = canvas.getContext('2d');

            // Initialize Chart.js
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                      labels: Array.from({
                        length: 26
                    }, (_, i) => i), // 26 intervals for 25 increases
                    datasets: [{
                        data: [],
                        borderColor: 'orange',
                        borderWidth: 2,
                        fill: true,
                        backgroundColor: "red"
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            beginAtZero: true, // Start x-axis from 0
                            grid: {
                                display: false // Hide x-axis grid lines
                            }
                        },
                        y: {
                            beginAtZero: false, // Allow the axis to start from the entered monthly bill value
                            grid: {
                                display: false // Hide y-axis grid lines
                            },
                            ticks: {
                                callback: function (value, index, values) {
                                    return '$' + value;
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false // Hide the legend
                        }
                    }
                }
            });
            sliderValueDiv.textContent = chartSlider.value;
        });

  // Function to update the chart based on user inputs
function updateChart() {
    if (monthlyBillInput.value === "" || yearlyIncreaseInput.value === "") {
        alert("Please enter value");
    } else {
        var monthlyBill = parseFloat(monthlyBillInput.value) || 0;
        var yearlyIncrease = parseFloat(yearlyIncreaseInput.value) || 0;
        var sliderValue = parseInt(chartSlider.value);

        // Generate data for the chart based on inputs
        var data = Array.from({
            length: 26
        }, (_, i) => Math.round(monthlyBill * Math.pow((1 + (yearlyIncrease / 100)), i)));

        // Update chart data based on slider value
        chart.data.datasets[0].data = data.slice(0, sliderValue + 1);

        // Update the chart
        chart.update();

        // Calculate total payment based on different formulas for the first month and subsequent months
        var totalPayment;
        if (sliderValue === 0) {
            // For the first month
            totalPayment = monthlyBill * 12;
        } else {
            // For subsequent months
            totalPayment = data.slice(0, sliderValue + 1).reduce((sum, value, index) => {
                return sum + (index === 0 ? monthlyBill * 12 : monthlyBill * 13.2);
            }, 0);
        }

        // Update total payment text content
        total_payment.textContent = "$" + totalPayment;

        var lastValue = data[sliderValue];
        lastValueDiv.textContent = "$" + lastValue;
        currentValueDiv.textContent = "$" + monthlyBill;
        result_data.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

         // Function to update slider value display
         function updateSliderValue() {
            sliderValueDiv.textContent = chartSlider.value;
            total_years.innerHTML = chartSlider.value;
            updateLabelPosition();
        } 
        function updateLabelPosition() {
            var thumbWidth = 15; // Adjust this value based on your slider thumb width
            var labelWidth = sliderValueDiv.offsetWidth;
            var maxPosition = chartSlider.offsetWidth - thumbWidth;
            var position = (chartSlider.value / chartSlider.max) * maxPosition;

            // Set the left position of the label
            sliderValueDiv.style.left = position + "px";

            // Adjust the label position to keep it centered over the thumb
            if (position < labelWidth / 2) {
                sliderValueDiv.style.left = "0";
            } else if (position > maxPosition - labelWidth / 2) {
                sliderValueDiv.style.left = maxPosition - labelWidth + "px";
            }
        }