

const dom = document.getElementById("donut");
const myChart = echarts.init(dom);

const option = {
  tooltip: {
    trigger: "item",
  },
  legend: {
    width: "90px",
    height: "100%",
    left: "left",
    icon: "pin",
    padding: [
      100, 
      0, 
      0,
      200,
    ],
    animation: "true",
  },
  series: [
    {
      name: "ხარჯების მოცულობა",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: "40",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [],
    },
  ],
};

const URL =
  "https://api.next.insight.optio.ai/api/v2/analytics/transactions/facts/aggregate";


const donutChartBody = {
  dimension: "parent-category",
  types: ["spending", "withdrawal"],
  gteDate: "2018-01-01",
  lteDate: "2018-01-31",
  includeMetrics: ["volume"],
};

function aggregate(body) {
  return fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body), 
  });
}

aggregate(donutChartBody)
  
  .then((res) => res.json())
  .then((result) => {
    const processedData = result.data;

    const mappedDimension = processedData.map((x) => ({
      name: x.dimension,
      value: x.volume,
    }));

    option.series[0].data = mappedDimension;
    option && myChart.setOption(option);
  });


var heatmaptDom = document.getElementById("heatmap");
var myHeatmapChart = echarts.init(heatmaptDom);

const range = [];

const days = [
  "Saturday",
  "Friday",
  "Thursday",
  "Wednesday",
  "Tuesday",
  "Monday",
  "Sunday",
];

const heatMapStartDate = "2018-01-01";
const heatMapEndDate = "2018-01-31";

heatmapOption = {
  title: {
    top: 30,
    left: "center",
    text: "my awesome heatmap chart",
  },
  tooltip: {},
  visualMap: {
    min: 0,
    max: 12000,
    type: "piecewise",
    orient: "horizontal",
    left: "center",
    top: 65,
  },
  calendar: {
    top: 120,
    left: 30,
    right: 30,
    cellSize: ["auto", 13],
    range: [heatMapStartDate, heatMapEndDate],
    itemStyle: {
      borderWidth: 0.5,
    },
    yearLabel: { show: false },
  },
  series: {
    type: "heatmap",
    coordinateSystem: "calendar",
    data: [],
  },
};

const HEATMAP_URL =
  "https://api.next.insight.optio.ai/api/v2/analytics/transactions/facts/aggregate";

const heatmapBody = {
  dimension: "date",
  types: ["spending", "withdrawal"],
  gteDate: heatMapStartDate,
  lteDate: heatMapEndDate,
  includeMetrics: ["volume", "quantity"],
};

function aggregateHeatmap(heatBody) {
  return fetch(HEATMAP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(heatBody),
  });
}

heatmapOption && myHeatmapChart.setOption(heatmapOption);

const heatMapSelector = document.getElementById("heatMapSelector");
heatMapSelector.addEventListener("change", (event) => {
  drawHeatMap(event.target.value);
});

let heatmapData = [];

function drawHeatMap(metrics) {
  if (metrics === "volume") {
    const mappedHeatMapData = heatmapData.map((d) => [
      echarts.format.formatTime("yyyy-MM-dd", new Date(d.dimension).getTime()),
      d.volume,
    ]);

    const maxVolume = Math.max(...heatmapData.map((x) => x.volume));

    heatmapOption.series.data = mappedHeatMapData;
    heatmapOption.visualMap.max = maxVolume;
    heatmapOption.title.text = "თანხის მოცულობა";
  }

  if (metrics === "quantity") {
    const mappedHeatMapData = heatmapData.map((d) => [
      echarts.format.formatTime("yyyy-MM-dd", new Date(d.dimension).getTime()),
      d.quantity,
    ]);
    const maxQuantity = Math.max(...heatmapData.map((x) => x.quantity));

    heatmapOption.series.data = mappedHeatMapData;
    heatmapOption.visualMap.max = maxQuantity;
    heatmapOption.title.text = "ტრანზაქციების რაოდენობა";
  }

  heatmapOption && myHeatmapChart.setOption(heatmapOption);
}

aggregateHeatmap(heatmapBody)
  .then((response) => response.json())
  .then((result) => {
    heatmapData = result.data;
    drawHeatMap(heatMapSelector.value);
  });

var LineDom = document.getElementById("lineChart");
var myLineChart = echarts.init(LineDom);

LineChartOption = {
  title: {
    text: "",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: [],
    top: "4%",
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [],
};

const LINE_Chart_URL =
  "https://api.next.insight.optio.ai/api/v2/analytics/transactions/facts/find";

let lineChartPage = 0;

const lineChartPageEl = document.getElementById("line-chart-page");
lineChartPageEl.textContent = lineChartPage;

const lineChartPrev = document.getElementById("line-chart-prev");
const lineChartNext = document.getElementById("line-chart-next");

lineChartNext.addEventListener("click", () => {
  lineChartPage++;
  lineChartPageEl.textContent = lineChartPage + 1;
  fetchAndRenderLineChart();
});

lineChartPrev.addEventListener("click", () => {
  if (lineChartPage > 0) {
    lineChartPage--;
  }
  lineChartPageEl.textContent = lineChartPage + 1;
  fetchAndRenderLineChart();
});

function aggregateLineChart(body) {
  return fetch(LINE_Chart_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function getMappedLineChartData(lineChartData) {
  const obj = {};

  for (let data of lineChartData) {
    if (!obj[data.dimension]) {
      obj[data.dimension] = {
        dates: [],
        volumes: [],
      };
    }

    obj[data.dimension].dates.push(data.date);
    obj[data.dimension].volumes.push(data.volume);
  }

  return obj;
}

function mapDataToSeries(data) {
  const arr = [];

  for (let key in data) {
    arr.push({
      name: key,
      type: "line",
      stack: "Total",
      data: data[key].volumes,
    });
  }

  return arr;
}

function fetchAndRenderLineChart() {
  const lineChartBody = {
    dimension: "category",
    types: ["income"],
    gteDate: "2018-01-01",
    lteDate: "2018-01-31",
    sortBy: "date",
    sortDirection: "asc",
    pageIndex: lineChartPage,
    pageSize: 50,
    includes: ["dimension", "date", "volume"],
  };

  aggregateLineChart(lineChartBody)
    .then((res) => res.json())
    .then((result) => {
      const lineChartData = result.data.entities;

      const mappedLineChartData = getMappedLineChartData(lineChartData);

      const dates = Array.from(
        new Set(
          lineChartData.map((x) =>
            echarts.format.formatTime("yyyy-MM-dd", new Date(x.date).getTime())
          )
        )
      );

      const series = mapDataToSeries(mappedLineChartData);
      const legends = series.map((x) => x.name);

      LineChartOption.xAxis.data = dates;
      LineChartOption.series = series;
      LineChartOption.legend.data = legends;

      console.log(LineChartOption);

      if (!series.length) {
        myLineChart.clear();
      } else {
        myLineChart.setOption(LineChartOption);
      }
    });
}

fetchAndRenderLineChart();


