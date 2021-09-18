import { useEffect, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

function Graph() {
  const [state, setState] = useState({
    dates: [],
    values: [],
  });
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    axios
      .get(
        "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=demo"
      )
      .then((response) => {
        console.log(response.data);
        transformData(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    renderChart();
  }, [state]);

  function transformData(data) {
    const dataObj = data["Time Series (Daily)"];

    const dates = Object.keys(dataObj);

    const values = [];

    for (let key in dataObj) {
      values.push(dataObj[key]["4. close"]);
    }

    setState({
      ...state,
      dates: [...dates.reverse()],
      values: [...values.reverse()],
    });
  }

  function renderChart() {
    if (chartInstance) {
      chartInstance.destroy();
    }

    const chart = new Chart(document.getElementById("myChart"), {
      type: "line",
      data: {
        labels: state.dates,
        datasets: [
          {
            label: "Price of IBM Stock over time",
            data: state.values,
            fill: true,
            borderColor: "#FF6383",
            backgroundColor: "#FF6383",
            tension: 0.1,
          },
        ],
      },
    });

    setChartInstance(chart);
  }

  return (
    <div>
      <canvas id="myChart"></canvas>
    </div>
  );
}

export default Graph;
