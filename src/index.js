import "./styles.css";
const START_DATE = "08/01/2019";
const END_DATE = "09/01/2019";

$('input[name="dates"]').daterangepicker(
  {
    startDate: START_DATE,
    endDate: END_DATE
  },
  function(start, end) {
    drawChart(start, end);
  }
);
const cubejsApi = cubejs(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.K9PiJkjegbhnw4Ca5pPlkTmZihoOm42w8bja9Qs2qJg",
  { apiUrl: "https://cubejs-ecom.herokuapp.com/cubejs-api/v1" }
);

// A helper method to format data for Chart.js
// and add some nice colors
var chartJsData = function(resultSet) {
  return {
    datasets: [
      {
        label: "Orders Count",
        data: resultSet.chartPivot().map(function(r) {
          return r["Orders.count"];
        }),
        backgroundColor: "rgb(255, 99, 132)"
      }
    ],
    labels: resultSet.categories().map(function(c) {
      return c.x;
    })
  };
};
var options = {
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          displayFormats: {
            hour: "MMM DD"
          },
          tooltipFormat: "MMM D"
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          beginAtZero: true
        }
      }
    ]
  }
};
var drawChart = function(startDate, endDate) {
  cubejsApi
    .load({
      measures: ["Orders.count"],
      timeDimensions: [
        {
          dimension: "Orders.createdAt",
          granularity: `day`,
          dateRange: [startDate, endDate]
        }
      ]
    })
    .then(resultSet => {
      var data = chartJsData(resultSet);
      if (window.chart) {
        window.chart.data = data;
        window.chart.update();
      } else {
        window.chart = new Chart(document.getElementById("chart-canvas"), {
          type: "line",
          options: options,
          data: data
        });
      }
    });
};

drawChart(START_DATE, END_DATE);
