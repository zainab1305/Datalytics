export function generateSummary(data) {
  if (!data.length) return "No data to analyze.";

  const summary = [];
  const columns = Object.keys(data[0]);

  summary.push(`📊 The dataset contains **${data.length}** rows and **${columns.length}** columns.`);

  columns.forEach((col) => {
    const values = data.map((row) => row[col]).filter(Boolean);
    const numericValues = values.filter((val) => typeof val === "number");
    const unique = [...new Set(values)];

    if (numericValues.length) {
      const avg = (numericValues.reduce((a, b) => a + b, 0) / numericValues.length).toFixed(2);
      summary.push(`• Column **${col}** has average **${avg}** from ${numericValues.length} numeric values.`);
    } else {
      summary.push(`• Column **${col}** has ${unique.length} unique values.`);
    }

    const missing = data.length - values.length;
    if (missing > 0) {
      summary.push(`⚠️ Column **${col}** has ${missing} missing entries.`);
    }
  });

  return summary.join("\n");
}
