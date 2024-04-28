import Chart from 'chart.js/auto';

import '../../sass/chart.scss';

export { drawBalanceChart, drawRatioChart };

const chartAreaBorder = {
  id: 'chartAreaBorder',
  beforeDraw(chart, args, options) {
    const {
      ctx,
      chartArea: { left, top, width, height },
    } = chart;
    ctx.save();
    ctx.strokeStyle = options.borderColor;
    ctx.lineWidth = options.borderWidth;
    ctx.setLineDash(options.borderDash || []);
    ctx.lineDashOffset = options.borderDashOffset;
    ctx.strokeRect(left + 1, top, width - 1, height);
    ctx.restore();
  },
};

function drawBalanceChart(canvas, labels, data, ticks) {
  canvas.setAttribute('aria-label', 'Диаграмма динамики баланса по месяцам');
  canvas.setAttribute(
    'aria-description',
    createBalanceChartDescription(labels, data)
  );

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Баланс',
          data: data,
          backgroundColor: '#116acc',
          maxBarThickness: 100,
          barPercentage: 1,
          categoryPercentage: 0.6,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      // aspectRatio: 2.6,
      responsive: true,
      // height: 400,
      scales: {
        x: {
          position: 'bottom',
          grid: {
            color: 'transparent',
          },
          border: {
            color: 'black',
          },
          ticks: {
            callback: function (val) {
              return labels[val].substring(0, 3);
            },
            color: 'black',
            font: {
              size: 20,
              weight: 700,
              family: '"Open Sans", sans-serif',
            },
          },
        },
        y: {
          color: 'black',
          beginAtZero: true,
          position: 'right',
          grid: {
            color: 'transparent',
          },
          border: {
            color: 'black',
          },
          afterBuildTicks: (scale) => {
            scale.ticks = ticks.map((tick) => {
              return { value: tick };
            });
          },
          ticks: {
            callback: function (val) {
              return val + ' ₽';
            },
            padding: 15,
            color: 'black',
            font: {
              size: 20,
              weight: 500,
              family: '"Open Sans", sans-serif',
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        chartAreaBorder: {
          borderColor: 'black',
          borderWidth: 1,
        },
      },
    },
    plugins: [chartAreaBorder],
  });
}

function drawRatioChart(canvas, labels, data1, data2, ticks) {
  canvas.setAttribute(
    'aria-label',
    'Диаграмма соотношения входящих и исходящих транзакций'
  );
  canvas.setAttribute(
    'aria-description',
    createRatioChartDescription(labels, data1, data2)
  );

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Расходные транзакции',
          data: data1,
          backgroundColor: '#fd4e5d',
          // barThickness: 50,
          barPercentage: 1,
          categoryPercentage: 0.6,
          stacked: true,
        },
        {
          label: 'Доходные транзакции',
          data: data2,
          backgroundColor: '#76ca66',
          // barThickness: 50,
          barPercentage: 1,
          categoryPercentage: 0.6,
          stacked: true,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      // aspectRatio: 2.6,
      responsive: true,
      // height: 400,
      scales: {
        x: {
          stacked: true,
          position: 'bottom',
          grid: {
            color: 'transparent',
          },
          border: {
            color: 'black',
          },
          ticks: {
            callback: function (val) {
              return labels[val].substring(0, 3);
            },
            color: 'black',
            font: {
              size: 20,
              weight: 700,
              family: '"Open Sans", sans-serif',
            },
          },
        },
        y: {
          stacked: true,
          color: 'black',
          beginAtZero: true,
          position: 'right',
          grid: {
            color: 'transparent',
          },
          border: {
            color: 'black',
          },
          afterBuildTicks: (scale) => {
            scale.ticks = ticks.map((tick) => {
              return { value: tick };
            });
          },
          ticks: {
            callback: function (val) {
              return val.toString() + ' ₽';
            },
            padding: 15,
            color: 'black',
            font: {
              size: 20,
              weight: 500,
              family: '"Open Sans", sans-serif',
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        chartAreaBorder: {
          borderColor: 'black',
          borderWidth: 1,
        },
      },
    },
    plugins: [chartAreaBorder],
  });
}

function createBalanceChartDescription(labels, data) {
  let resultDescription = '';

  for (let i = labels.length - 1; i >= 0; i--) {
    resultDescription += `${labels[i]}.${data[i]} рублей. `;
  }

  return resultDescription.trim();
}

function createRatioChartDescription(labels, data1, data2) {
  let resultDescription = '';

  for (let i = labels.length - 1; i >= 0; i--) {
    resultDescription += `${labels[i]}. Входящие транзакции ${data2[i]} рублей. Исходящие транзакции ${data1[i]} рублей. `;
  }

  return resultDescription.trim();
}
