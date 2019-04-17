import moment from 'moment';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const getFormattedTimeDurations = (timeDurations) => timeDurations.map((timeInMs) => Math.round(moment.duration(timeInMs).as(`hours`)));

export const createTimeChartInfo = (timeCountInfo) => {
  return {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(timeCountInfo),
      datasets: [{
        data: getFormattedTimeDurations(Object.values(timeCountInfo)),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}H`
        }
      },
      title: {
        display: true,
        text: `TIME SPENT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  };
};
