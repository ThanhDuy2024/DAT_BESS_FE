import React, { useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { BarElement, CategoryScale, Chart, Filler, Legend, LinearScale, LineElement, PointElement, scales, Title, Tooltip } from 'chart.js';
import ChartDataLables from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';
import { signal } from "@preact/signals-react";
import { callApi } from "../../Api/Api";
import moment from "moment-timezone";
import { useSignals } from "@preact/signals-react/runtime";
const verticalCrosshairPlugin = {
  id: 'verticalCrosshair',

  afterEvent(chart, args) {
    const { event } = args;

    if (event.type === 'mousemove') {
      chart.$crosshairX = event.x;
      chart.draw();
    }

    if (event.type === 'mouseout') {
      chart.$crosshairX = null;
      chart.draw();
    }
  },

  afterDraw(chart) {
    const x = chart.$crosshairX;
    if (x == null) return;

    const { ctx, chartArea } = chart;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#999';
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.restore();
  },
};
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ChartDataLables, Title, Tooltip, Filler, Legend, zoomPlugin, annotationPlugin, verticalCrosshairPlugin);

const labelLine = signal(["00:00:00", "00:05:00", "00:10:00", "00:15:00", "00:20:00", "00:25:00", "00:30:00", "00:35:00", "00:40:00", "00:45:00", "00:50:00", "00:55:00",
  "01:00:00", "01:05:00", "01:10:00", "01:15:00", "01:20:00", "01:25:00", "01:30:00", "01:35:00", "01:40:00", "01:45:00", "01:50:00", "01:55:00",
  "02:00:00", "02:05:00", "02:10:00", "02:15:00", "02:20:00", "02:25:00", "02:30:00", "02:35:00", "02:40:00", "02:45:00", "02:50:00", "02:55:00",
  "03:00:00", "03:05:00", "03:10:00", "03:15:00", "03:20:00", "03:25:00", "03:30:00", "03:35:00", "03:40:00", "03:45:00", "03:50:00", "03:55:00",
  "04:00:00", "04:05:00", "04:10:00", "04:15:00", "04:20:00", "04:25:00", "04:30:00", "04:35:00", "04:40:00", "04:45:00", "04:50:00", "04:55:00",
  "05:00:00", "05:05:00", "05:10:00", "05:15:00", "05:20:00", "05:25:00", "05:30:00", "05:35:00", "05:40:00", "05:45:00", "05:50:00", "05:55:00",
  "06:00:00", "06:05:00", "06:10:00", "06:15:00", "06:20:00", "06:25:00", "06:30:00", "06:35:00", "06:40:00", "06:45:00", "06:50:00", "06:55:00",
  "07:00:00", "07:05:00", "07:10:00", "07:15:00", "07:20:00", "07:25:00", "07:30:00", "07:35:00", "07:40:00", "07:45:00", "07:50:00", "07:55:00",
  "08:00:00", "08:05:00", "08:10:00", "08:15:00", "08:20:00", "08:25:00", "08:30:00", "08:35:00", "08:40:00", "08:45:00", "08:50:00", "08:55:00",
  "09:00:00", "09:05:00", "09:10:00", "09:15:00", "09:20:00", "09:25:00", "09:30:00", "09:35:00", "09:40:00", "09:45:00", "09:50:00", "09:55:00",
  "10:00:00", "10:05:00", "10:10:00", "10:15:00", "10:20:00", "10:25:00", "10:30:00", "10:35:00", "10:40:00", "10:45:00", "10:50:00", "10:55:00",
  "11:00:00", "11:05:00", "11:10:00", "11:15:00", "11:20:00", "11:25:00", "11:30:00", "11:35:00", "11:40:00", "11:45:00", "11:50:00", "11:55:00",
  "12:00:00", "12:05:00", "12:10:00", "12:15:00", "12:20:00", "12:25:00", "12:30:00", "12:35:00", "12:40:00", "12:45:00", "12:50:00", "12:55:00",
  "13:00:00", "13:05:00", "13:10:00", "13:15:00", "13:20:00", "13:25:00", "13:30:00", "13:35:00", "13:40:00", "13:45:00", "13:50:00", "13:55:00",
  "14:00:00", "14:05:00", "14:10:00", "14:15:00", "14:20:00", "14:25:00", "14:30:00", "14:35:00", "14:40:00", "14:45:00", "14:50:00", "14:55:00",
  "15:00:00", "15:05:00", "15:10:00", "15:15:00", "15:20:00", "15:25:00", "15:30:00", "15:35:00", "15:40:00", "15:45:00", "15:50:00", "15:55:00",
  "16:00:00", "16:05:00", "16:10:00", "16:15:00", "16:20:00", "16:25:00", "16:30:00", "16:35:00", "16:40:00", "16:45:00", "16:50:00", "16:55:00",
  "17:00:00", "17:05:00", "17:10:00", "17:15:00", "17:20:00", "17:25:00", "17:30:00", "17:35:00", "17:40:00", "17:45:00", "17:50:00", "17:55:00",
  "18:00:00", "18:05:00", "18:10:00", "18:15:00", "18:20:00", "18:25:00", "18:30:00", "18:35:00", "18:40:00", "18:45:00", "18:50:00", "18:55:00",
  "19:00:00", "19:05:00", "19:10:00", "19:15:00", "19:20:00", "19:25:00", "19:30:00", "19:35:00", "19:40:00", "19:45:00", "19:50:00", "19:55:00",
  "20:00:00", "20:05:00", "20:10:00", "20:15:00", "20:20:00", "20:25:00", "20:30:00", "20:35:00", "20:40:00", "20:45:00", "20:50:00", "20:55:00",
  "21:00:00", "21:05:00", "21:10:00", "21:15:00", "21:20:00", "21:25:00", "21:30:00", "21:35:00", "21:40:00", "21:45:00", "21:50:00", "21:55:00",
  "22:00:00", "22:05:00", "22:10:00", "22:15:00", "22:20:00", "22:25:00", "22:30:00", "22:35:00", "22:40:00", "22:45:00", "22:50:00", "22:55:00",
  "23:00:00", "23:05:00", "23:10:00", "23:15:00", "23:20:00", "23:25:00", "23:30:00", "23:35:00", "23:40:00", "23:45:00", "23:50:00", "23:55:00",
  "23:59:55"]);
const datasetLine = signal([]);

const labelBar = signal([]);
const datasetBar = signal([]);
const maxValue = signal(0);



const LineChart = (props) => {
  useSignals();
  const lang = useIntl();
  const [onzoom, setOnzoom] = useState(false);
  const zoomRef = useRef(null);

  const trendModes = [
    { key: "Date", label: lang.formatMessage({ id: "day" }) },
    { key: "Month", label: lang.formatMessage({ id: "month" }) },
  ];

  const [mode, setMode] = useState(trendModes[0].key);



  let data_tempLine = {
    labels: labelLine.value,
    datasets: datasetLine.value
  };
  let optionLine = {
    type: 'line',
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',       // 👈 lấy toàn bộ dataset tại cùng X
      intersect: false,    // 👈 không cần trỏ đúng điểm
    },
    scales: {
      x: {
        grid: {
          display: false
        },
      },
      y: {
        beginAtZero: false,
        border: {
          dash: [4, 2]
        },
      }
    },
    plugins: {
      datalabels: {
        display: false,
        color: 'black',
        font: {
          size: 20,
          fontFamily: 'Arial',
          weight: 'bold'
        },
        // formatter: (value, context) => {
        //     return `${Number(value).toFixed(1)} kWh` ;
        // },
      },
      zoom: {
        limits: {
          x: { min: 'original', max: 'original', minRange: 5 },
          y: { min: 'original', max: 'original', minRange: 10 },
        },
        pan: {
          enabled: onzoom,
          mode: 'xy',
          modifierKey: 'ctrl',
        },
        zoom: {
          wheel: {
            enabled: onzoom,
            speed: 0.05,
          },
          pinch: {
            enabled: onzoom
          },
          drag: {
            enabled: onzoom,
          },
          mode: 'xy',
        }
      },
      tooltip: {
        // enabled: true,
        // mode: 'index',
        // intersect: false,

        callbacks: {
          title(items) {
            // hiển thị time ở title tooltip
            return items[0].label; // label = "00:55:00"...
          },
          label(context) {
            // const dsLabel = context.dataset.label || "";
            // const kw = context.parsed.y; // y value
            // const time = context.label;  // "HH:MM:SS"
            // const { type, unitPrice, cost } = calcElecCostAtDatetime(mydateSelect.value, time, kw, { high: 3398, mid: 1833, low: 1190 });

            // // format tuỳ bạn
            // const kwStr = (Number(kw) || 0).toLocaleString("en-US", { maximumFractionDigits: 3 });
            // const costStr = (Number(cost) || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });

            // return `${dsLabel}: ${kw.toFixed(1).toLocaleString('en-US')} - ${detectMoney(cost).text} (${type})`;
          }
          // nếu muốn in thêm 1 dòng riêng "Tiền: ..."
          // afterLabel(context) { ... return `Tiền: ₫...`; }
        }

      },
      filler: {
        propagate: false, // Prevents fill from propagating to other datasets if hidden
      },
    },
  }

  let data_tempBar = {
    labels: labelBar.value,
    datasets: datasetBar.value
  }

  let optionBar = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {

      x: {
        grid: {
          display: false
        },
        // stacked: true
      },
      y: {
        max: maxValue.value,
        border: {
          dash: [4, 2]
        },
        // stacked: true
      }
    },
    plugins: {
      datalabels: {
        display: false,
        color: 'grey',
        anchor: 'end',
        align: 'top',
        // formatter: Math.round,
        font: {
          size: 14,
          weight: 'bold'
        },
        formatter: (value, context) => {
          return Number(parseFloat(value)).toFixed(1).toLocaleString('en-US');
        },
      },
      zoom: {
        limits: {
          x: { min: 'original', max: 'original', minRange: 5 },
          y: { min: 'original', max: 'original', minRange: 5 },
        },
        pan: {
          enabled: onzoom,
          mode: 'xy',
          modifierKey: 'ctrl',
        },
        zoom: {
          wheel: {
            enabled: onzoom,
            speed: 0.05,

          },
          pinch: {
            enabled: onzoom
          },
          drag: {
            enabled: onzoom,
          },
          mode: 'xy',
        }
      },
    },
  }


  const DailyChart = async (date) => {

    let chart = await callApi("post", process.env.REACT_APP_API + "/data/getChart", {
      deviceid: 'N150FL4L2C072590',
      code: 'M1',
      date: moment(date).format('MM/DD/YYYY')
    });
    console.log(chart);
    if (chart.status === 'true') {
      let chart_ = chart.data.result;


      datasetLine.value = [
        {
          label: `Sạc (kW)`,
          lineTension: 0.3,
          borderColor: 'rgb(15, 86, 173)',
          backgroundColor: 'rgb(73, 125, 187)',
          pointRadius: 0,
          borderWidth: 1.5,
          data: []
        },
        {
          label: `Xả (kW)`,
          lineTension: 0.3,
          borderColor: 'rgb(255, 205, 68)',
          backgroundColor: 'rgb(255, 205, 68)',
          pointRadius: 0,
          borderWidth: 1.5,
          data: []
        }
      ];

      labelLine.value.map((item, index) => {

        let idx = chart_.findIndex(i => i[0] === item);
        if (idx === -1) {
          datasetLine.value[0].data.push(0);
          datasetLine.value[1].data.push(0);
        } else {
          datasetLine.value[0].data.push(chart_?.[idx]?.[5] || 0);
          datasetLine.value[1].data.push(chart_?.[idx]?.[6] || 0);
        } // nếu không tìm thấy time tương ứng trong chart thì lấy index (trường hợp này sẽ lấy giá trị 0 cho cả 2 dataset)
      });
    } else {
      console.log("Failed to get chart data");
      datasetLine.value = [
        {
          label: `Sạc (kW)`,
          lineTension: 0.3,
          borderColor: 'rgb(15, 86, 173)',
          backgroundColor: 'rgb(73, 125, 187)',
          pointRadius: 0,
          borderWidth: 1.5,
          data: []
        },
        {
          label: `Xả (kW)`,
          lineTension: 0.3,
          borderColor: 'rgb(255, 205, 68)',
          backgroundColor: 'rgb(255, 205, 68)',
          pointRadius: 0,
          borderWidth: 1.5,
          data: []
        }
      ];
    }

  }

  const MonthlyChart = async (month) => {
    console.log('month', month);
    let monthchart = await callApi("post", process.env.REACT_APP_API + "/data/getMonthChart", {
      deviceid: 'N150FL4L2C072590',
      code: 'M1',
      month: moment(month).format('MM/YYYY')
    });
    // console.log(chart);

    const [mm, yyyy] = moment(month).format('MM/YYYY').split("/");
    const daysInMonth = new Date(Number(yyyy), Number(mm), 0).getDate();

    if (monthchart.status === 'true') {
      // console.log(monthchart.data);


      let dataBar = monthchart.data.result.map((item, index) => {
        // Riêng index 0, các giá trị số đều bằng 0
        if (index === 0) {
          return [item[0], 0, 0];
        }

        // Lấy phần tử liền trước đó
        const prevItem = monthchart.data.result[index - 1];

        // Tính giá trị: item hiện tại - item trước đó
        return [
          item[0],                 // Giữ nguyên ngày tháng
          item[1] - prevItem[1],   // Giá trị thứ 2 hiện tại - trước đó
          item[2] - prevItem[2]    // Giá trị thứ 3 hiện tại - trước đó
        ];
      });

      const allNumbers = dataBar.flatMap(item => item.slice(1));
      maxValue.value = Math.max(...allNumbers);

      datasetBar.value = [
        {
          label: `Sạc (kWh)`,
          borderColor: 'rgb(0, 131, 187)',
          backgroundColor: 'rgb(0, 131, 187)',
          borderWidth: 1.5,
          data: [],

        },
        {
          label: `Xả (kWh)`,
          borderColor: 'rgb(255, 205, 68)',
          backgroundColor: 'rgb(255, 205, 68)',
          borderWidth: 1.5,
          data: [],

        }
      ]

      labelBar.value = [];
      for (let i = 1; i <= daysInMonth; i++) {
        labelBar.value = [...labelBar.value, i < 10 ? `${mm}/0${i}/${yyyy}` : `${mm}/${i}/${yyyy}`];
      }

      labelBar.value.map((item, index) => {

        let idx = dataBar.findIndex(i => i[0] === item);
        // console.log('idx', idx, 'item', item);
        if (idx === -1) {
          datasetBar.value[0].data.push(0);
          datasetBar.value[1].data.push(0);
        } else {
          datasetBar.value[0].data.push(dataBar?.[idx][1] || 0);
          datasetBar.value[1].data.push(dataBar?.[idx][2] || 0);
        } // nếu không tìm thấy time tương ứng trong chart thì lấy index (trường hợp này sẽ lấy giá trị 0 cho cả 2 dataset)
      });


    } else {
      console.log("Failed to get chart data");
      datasetBar.value = [
        {
          label: `Sạc (kWh)`,
          borderColor: 'rgb(0, 131, 187)',
          backgroundColor: 'rgb(0, 131, 187)',
          borderWidth: 1.5,
          data: [],

        },
        {
          label: `Xả (kWh)`,
          borderColor: 'rgb(255, 205, 68)',
          backgroundColor: 'rgb(255, 205, 68)',
          borderWidth: 1.5,
          data: [],

        }
      ]
      labelBar.value = [];
      for (let i = 1; i <= daysInMonth; i++) {
        labelBar.value = [...labelBar.value, i < 10 ? `${mm}/0${i}/${yyyy}` : `${mm}/${i}/${yyyy}`];
      }
    }
  }

  useEffect(() => {
    DailyChart(new Date());
  }, []);


  return (
    <div className="DAT_LineChart_Card">
      <div className="DAT_LineChart_Card_Header">
        <div className="DAT_LineChart_Card_Header_Content">
          <span className="DAT_LineChart_Card_Header_Content_Title">
            {lang.formatMessage({ id: "titchart1" })}
          </span>
        </div>
        <div className="DAT_LineChart_Card_Header_Controls">
          <input
            id="input"
            type={mode === 'Date' ? "date" : "month"}
            className="DAT_LineChart_Card_Header_Controls_DateInput"
            defaultValue={moment().format('YYYY-MM-DD')}
            max={mode === 'Date' ? moment().format('YYYY-MM-DD') : moment().format('YYYY-MM')}
            onChange={(e) => { mode === 'Date' ? DailyChart(e.target.value) : MonthlyChart(e.target.value) }}
          />
          <div className="DAT_LineChart_Card_Header_Controls_Switcher">

            {trendModes.map((item) => (
              <button
                key={item.key}
                type="button"
                className="DAT_LineChart_Card_Header_Controls_Switcher_Button"
                aria-pressed={mode === item.key}
                onClick={() => {


                  setMode(item.key)
                  setTimeout(() => {
                    let input = document.getElementById("input");
                    console.log('Date', input.type);
                    if (input.type === 'date') {
                      input.value = moment().format('YYYY-MM-DD');
                      DailyChart(moment().format('YYYY-MM-DD'));
                    } else {
                      input.value = moment().format('YYYY-MM');
                      MonthlyChart(moment().format('YYYY-MM'));
                    }
                    // input.defaultValue = moment().format('yyyy-MM-dd');
                  }, 500);


                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="DAT_LineChart_Card_Body">
        {mode === 'Date'
          ? <Line ref={zoomRef} data={data_tempLine} options={optionLine} />
          : <Bar ref={zoomRef} data={data_tempBar} options={optionBar} />
        }
      </div>
    </div>
  );
};

export default LineChart;
