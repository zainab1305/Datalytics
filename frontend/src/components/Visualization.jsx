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
import ExcelDataContext from "./ExcelDataContext";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

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

const Bar3D = ({ data, labels }) => {
  const colors = [
    "#3B82F6", // Blue
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Violet
    "#EC4899", // Pink
    "#06B6D4", // Cyan
    "#22C55E", // Green
  ];

  return (
    <Canvas camera={{ position: [5, 5, 10], fov: 50 }} className="rounded-lg">
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
            color="#333"
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
  const { excelData } = useContext(ExcelDataContext);
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [mode, setMode] = useState("2d");
  const navigate = useNavigate();
  const chartRef = useRef(null);

  if (excelData.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center animate-fade-in">
        <div className="card text-center p-12 max-w-md">
          <div className="text-6xl mb-6 text-blue-500">📈</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No Data Available</h2>
          <p className="text-lg text-gray-600 mb-6">Please upload a file from the dashboard to visualize your data.</p>
          <button
            onClick={() => navigate("/uploadFile")}
            className="btn-primary"
          >
            Upload File
          </button>
        </div>
      </div>
    );
  }

  const keys = Object.keys(excelData[0]);

  const chartData = {
    labels: excelData.map((row) => row[xKey]),
    datasets: [
      {
        label: `${yKey} vs ${xKey}`,
        data: excelData.map((row) => parseFloat(row[yKey])),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)", // Blue
          "rgba(16, 185, 129, 0.8)", // Emerald
          "rgba(245, 158, 11, 0.8)", // Amber
          "rgba(239, 68, 68, 0.8)", // Red
          "rgba(139, 92, 246, 0.8)", // Violet
          "rgba(236, 72, 153, 0.8)", // Pink
          "rgba(6, 182, 212, 0.8)", // Cyan
          "rgba(34, 197, 94, 0.8)", // Green
        ],
        borderColor: [
          "rgb(59, 130, 246)", // Blue
          "rgb(16, 185, 129)", // Emerald
          "rgb(245, 158, 11)", // Amber
          "rgb(239, 68, 68)", // Red
          "rgb(139, 92, 246)", // Violet
          "rgb(236, 72, 153)", // Pink
          "rgb(6, 182, 212)", // Cyan
          "rgb(34, 197, 94)", // Green
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          "rgba(59, 130, 246, 1)", // Blue
          "rgba(16, 185, 129, 1)", // Emerald
          "rgba(245, 158, 11, 1)", // Amber
          "rgba(239, 68, 68, 1)", // Red
          "rgba(139, 92, 246, 1)", // Violet
          "rgba(236, 72, 153, 1)", // Pink
          "rgba(6, 182, 212, 1)", // Cyan
          "rgba(34, 197, 94, 1)", // Green
        ],
      },
    ],
  };

  const renderChart = () => {
    if (mode === "3d") {
      return (
        <div className="w-full h-full">
          <Bar3D
            data={excelData.map((row) => parseFloat(row[yKey]))}
            labels={excelData.map((row) => row[xKey])}
          />
        </div>
      );
    }
    switch (chartType) {
      case "bar":
        return <Bar data={chartData} ref={chartRef} />;
      case "line":
        return <Line data={chartData} ref={chartRef} />;
      case "pie":
        return <Pie data={chartData} ref={chartRef} />;
      case "radar":
        return <Radar data={chartData} ref={chartRef} />;
      default:
        return null;
    }
  };

  const handleDownload = () => {
    const chartCanvas = document.querySelector("canvas");
    if (!chartCanvas) return;
    html2canvas(chartCanvas).then((canvas) => {
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div className="h-screen flex animate-fade-in">
      {/* Sidebar */}
      <div className="w-64 sidebar-card p-6 flex flex-col justify-between animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Datalytics</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full mb-4 btn-primary"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/uploadFile")}
            className="w-full mb-4 btn-secondary"
          >
            Upload Another File
          </button>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 relative animate-slide-up">
        <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">
          Data Visualization
        </h2>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="absolute top-6 right-6 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
        >
          Download PNG
        </button>

        <div className="flex h-[85%] gap-6">
          {/* Controls */}
          <div className="w-1/4 card h-full overflow-y-auto">
            <h3 className="text-xl font-bold mb-6 text-indigo-600">⚙️ Chart Controls</h3>

            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Mode:</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="input-field"
                >
                  <option value="2d">2D Charts</option>
                  <option value="3d">3D Visualization</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">X-axis:</label>
                <select
                  value={xKey}
                  onChange={(e) => setXKey(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Column</option>
                  {keys.map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">Y-axis:</label>
                <select
                  value={yKey}
                  onChange={(e) => setYKey(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Column</option>
                  {keys.map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>

              {mode === "2d" && (
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Chart Type:</label>
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="input-field"
                  >
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                  <option value="radar">Radar Chart</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="flex-grow card h-full flex items-center justify-center">
            {xKey && yKey ? (
              <div className="w-full h-full p-4">
                {renderChart()}
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce-gentle">📈</div>
                <p className="text-lg text-gray-600 font-medium">
                  Please select X and Y axes to view the chart
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Choose your data columns from the controls panel
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualization;
