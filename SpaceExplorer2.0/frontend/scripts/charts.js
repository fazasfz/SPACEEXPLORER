// ============================================================
// SpaceExplorer 2.0 — Fully Fixed Charts Controller
// ============================================================

let discoveryChartInstance = null;
let obsChartInstance = null;

async function initDiscoveryChart(elementId) {
  const container = document.getElementById(elementId);
  if (!container) return;

  const response = await getDiscoveries();
  const discoveries = Array.isArray(response) ? response : (response.data || []);
  
  if (discoveries.length === 0) {
    container.innerHTML = "<p>No discovery data available.</p>";
    return;
  }

  // Count discoveries by type
  const counts = { Geological: 0, Astronomical: 0, Biological: 0, Chemical: 0, Technological: 0 };
  discoveries.forEach(d => {
    if (counts.hasOwnProperty(d.type)) counts[d.type]++;
  });

  // Create canvas element dynamically inside container
  container.innerHTML = '<canvas></canvas>';
  const canvas = container.querySelector('canvas');

  if (discoveryChartInstance) discoveryChartInstance.destroy();

  discoveryChartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts),
        backgroundColor: ['#00d4ff','#ffd700','#00ffcc','#ff6b35','#c896ff'],
        borderColor: '#0d1424',
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { position: 'bottom', labels: { color: '#7a9bbf', font: { family: 'JetBrains Mono', size: 11 } } }
      }
    }
  });
}

async function initObsChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  if (obsChartInstance) { obsChartInstance.destroy(); }

  const obs = await getObservations(); // Added await as it's an API call
  const months = [];
  const counts = [];
  const now = new Date('2026-03-24');
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleString('default', { month: 'short' }));
    counts.push(obs.filter(o => {
      const od = new Date(o.datetime || o.date);
      return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
    }).length);
  }

  obsChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{
        label: 'Observations',
        data: counts,
        backgroundColor: 'rgba(0,255,204,0.3)',
        borderColor: '#00ffcc',
        borderWidth: 2,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } }
      }
    }
  });
}