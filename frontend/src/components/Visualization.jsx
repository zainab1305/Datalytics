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
  return (
    <Canvas camera={{ position: [5, 5, 10], fov: 50 }} className="rounded-lg">
      <ambientLight intensity={0.6} />
      <directionalLight position={[0, 5, 5]} intensity={1.5} />
      <OrbitControls />
      {data.map((val, index) => (
        <group key={index} position={[index * 1.5, 0, 0]}>
          <mesh position={[0, val / 2, 0]}>
            <boxGeometry args={[1, val, 1]} />
            <meshStandardMaterial color={"#8e24aa"} />
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
      <div className="h-screen flex items-center justify-center text-gray-700 text-lg">
        No data found. Please upload a file from the dashboard.
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
          "rgba(255, 223, 186, 0.6)",
          "rgba(255, 192, 203, 0.6)",
          "rgba(255, 255, 153, 0.6)",
          "rgba(204, 229, 255, 0.6)",
        ],
        borderColor: "rgba(255, 192, 203, 1)",
        borderWidth: 1,
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
    <div className="h-screen flex bg-gradient-to-r from-[#f3e5f5] to-[#e0c3fc] text-[#3e1f47]">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6 text-[#6a1b9a]">Datalytics</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full mb-4 bg-[#d1b3ff] hover:bg-[#c29eff] text-[#3e1f47] font-medium px-4 py-2 rounded"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/uploadFile")}
            className="w-full mb-4 bg-[#e1bee7] hover:bg-[#d7aef7] text-[#3e1f47] font-medium px-4 py-2 rounded"
          >
            Upload Another File
          </button>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-[#f48fb1] hover:bg-[#f06292] text-white font-medium px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 relative">
        <h2 className="text-3xl font-bold mb-4 text-center">📊 Data Visualization</h2>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="absolute top-6 right-6 bg-yellow-300 hover:bg-yellow-400 text-[#3e1f47] font-bold px-4 py-2 rounded shadow-md"
        >
          Download PNG
        </button>

        <div className="flex h-[85%] gap-6">
          {/* Controls */}
          <div className="w-1/4 bg-white p-5 rounded-lg shadow-md h-full overflow-y-auto">
            <label className="block mb-2 font-semibold">Mode:</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="2d">2D</option>
              <option value="3d">3D</option>
            </select>

            <label className="block mb-2 font-semibold">X-axis:</label>
            <select
              value={xKey}
              onChange={(e) => setXKey(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="">Select</option>
              {keys.map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>

            <label className="block mb-2 font-semibold">Y-axis:</label>
            <select
              value={yKey}
              onChange={(e) => setYKey(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="">Select</option>
              {keys.map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>

            {mode === "2d" && (
              <>
                <label className="block mb-2 font-semibold">Chart Type:</label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="bar">Bar</option>
                  <option value="line">Line</option>
                  <option value="pie">Pie</option>
                  <option value="radar">Radar</option>
                </select>
              </>
            )}
          </div>

          {/* Chart */}
          <div className="flex-grow bg-white p-6 rounded-lg shadow-md h-full flex items-center justify-center">
            {xKey && yKey ? (
              <div className="w-full h-full">{renderChart()}</div>
            ) : (
              <p className="text-center text-sm text-gray-600">
                Please select X and Y axes to view the chart.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualization;
