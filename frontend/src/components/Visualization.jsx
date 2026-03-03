import React, { useContext, useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  ArcElement,
  RadarController,
  RadialLinearScale,
} from "chart.js";
import { Bar, Line, Pie, Radar } from "react-chartjs-2";
import DataContext from "./DataContext";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import Layout from "./Layout";
import { Download, BarChart3, Settings2 } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  RadarController,
  RadialLinearScale
);

const chartColors = [
  "#6366f1", "#22d3ee", "#10b981", "#f59e0b", "#ef4444", "#a855f7", "#ec4899", "#06b6d4"
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: "#a1a1aa", font: { family: "Outfit" } },
    },
    tooltip: {
      backgroundColor: "rgba(28, 28, 38, 0.95)",
      titleColor: "#f4f4f5",
      bodyColor: "#a1a1aa",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: { color: "#71717a", font: { size: 11 } },
      grid: { color: "rgba(255,255,255,0.05)" },
    },
    y: {
      ticks: { color: "#71717a", font: { size: 11 } },
      grid: { color: "rgba(255,255,255,0.05)" },
    },
  },
};

const Bar3D = ({ data, labels }) => {
  const colors = chartColors;
  return (
    <Canvas camera={{ position: [5, 5, 10], fov: 50 }} className="rounded-xl bg-zinc-900/50">
      <ambientLight intensity={0.6} />
      <directionalLight position={[0, 5, 5]} intensity={1.5} />
      <OrbitControls />
      {data.map((val, index) => (
        <group key={index} position={[index * 1.5, 0, 0]}>
          <mesh position={[0, val / 2, 0]}>
            <boxGeometry args={[1, val, 1]} />
            <meshStandardMaterial color={colors[index % colors.length]} />
          </mesh>
          <Text
            position={[0, -0.8, 0]}
            fontSize={0.4}
            color="#a1a1aa"
            anchorX="center"
            anchorY="middle"
          >
            {labels[index]}
          </Text>
        </group>
      ))}
    </Canvas>
  );
};

const Visualization = () => {
  const { data } = useContext(DataContext);
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [mode, setMode] = useState("2d");
  const navigate = useNavigate();
  const chartRef = useRef(null);

  if (data.length === 0) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center p-6">
          <div className="card text-center p-12 max-w-md animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-3">No data available</h2>
            <p className="text-zinc-500 mb-8">
              Upload a file from the dashboard to visualize your data.
            </p>
            <button onClick={() => navigate("/uploadFile")} className="btn-primary">
              Upload file
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const keys = Object.keys(data[0]);

  const chartData = {
    labels: data.map((row) => row[xKey]),
    datasets: [
      {
        label: `${yKey} vs ${xKey}`,
        data: data.map((row) => parseFloat(row[yKey])),
        backgroundColor: chartColors.map((c) => c + "cc"),
        borderColor: chartColors,
        borderWidth: 2,
        hoverBackgroundColor: chartColors,
      },
    ],
  };

  const renderChart = () => {
    if (mode === "3d") {
      return (
        <div className="w-full h-[400px]">
          <Bar3D
            data={data.map((row) => parseFloat(row[yKey]))}
            labels={data.map((row) => row[xKey])}
          />
        </div>
      );
    }
    const commonProps = { data: chartData, options: chartOptions, ref: chartRef };
    switch (chartType) {
      case "bar": return <Bar {...commonProps} />;
      case "line": return <Line {...commonProps} />;
      case "pie": return <Pie {...commonProps} />;
      case "radar": return <Radar {...commonProps} />;
      default: return null;
    }
  };

  const handleDownload = () => {
    const chartCanvas = document.querySelector(".chart-container canvas");
    const threeCanvas = document.querySelector("canvas[data-engine]");
    const target = chartCanvas || threeCanvas;
    if (!target) return;
    html2canvas(target).then((canvas) => {
      const link = document.createElement("a");
      link.download = "datalytics-chart.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <Layout>
      <div className="p-6 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 animate-slide-up">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-zinc-100">Data visualization</h1>
            <p className="text-zinc-500">Build charts from your uploaded data</p>
          </div>
          <button
            onClick={handleDownload}
            className="btn-outline inline-flex items-center gap-2 self-start lg:self-auto"
          >
            <Download className="w-4 h-4" />
            Download PNG
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 animate-slide-up">
          {/* Controls */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="card p-6 sticky top-24">
              <h3 className="text-lg font-bold text-zinc-200 mb-6 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-indigo-400" />
                Chart controls
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="input-field"
                  >
                    <option value="2d">2D charts</option>
                    <option value="3d">3D visualization</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">X-axis</label>
                  <select
                    value={xKey}
                    onChange={(e) => setXKey(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select column</option>
                    {keys.map((key) => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Y-axis</label>
                  <select
                    value={yKey}
                    onChange={(e) => setYKey(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select column</option>
                    {keys.map((key) => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>
                {mode === "2d" && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Chart type</label>
                    <select
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value)}
                      className="input-field"
                    >
                      <option value="bar">Bar</option>
                      <option value="line">Line</option>
                      <option value="pie">Pie</option>
                      <option value="radar">Radar</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 min-h-[400px]">
            <div className="card p-6 h-full min-h-[400px] flex items-center justify-center">
              {xKey && yKey ? (
                <div className="chart-container w-full h-[400px]">
                  {renderChart()}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-4 animate-bounce-gentle">
                    <BarChart3 className="w-8 h-8 text-indigo-400" />
                  </div>
                  <p className="text-zinc-400 font-medium">Select X and Y axes to view the chart</p>
                  <p className="text-sm text-zinc-500 mt-1">Choose columns from the controls panel</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Visualization;
