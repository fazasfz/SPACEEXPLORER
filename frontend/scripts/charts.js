// ============================================================
// SpaceExplorer 2.0 — Charts (Chart.js)
// ============================================================

let discoveryChartInstance = null;
let obsChartInstance = null;

function initDiscoveryChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  if (discoveryChartInstance) { discoveryChartInstance.destroy(); }

  const discoveries = getDiscoveries();
  const counts = { geological: 0, astronomical: 0, biological: 0, chemical: 0, technological: 0 };
  discoveries.forEach(d => { if (counts[d.type] !== undefined) counts[d.type]++; });

  discoveryChartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Geological', 'Astronomical', 'Biological', 'Chemical', 'Technological'],
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
        legend: {
          position: 'bottom',
          labels: { color: '#7a9bbf', font: { family: 'JetBrains Mono', size: 11 }, padding: 14, boxWidth: 12 }
        },
        tooltip: {
          backgroundColor: '#0d1424',
          borderColor: 'rgba(0,212,255,0.3)',
          borderWidth: 1,
          titleColor: '#00d4ff',
          bodyColor: '#e8f4ff',
          titleFont: { family: 'Orbitron', size: 11 },
          bodyFont: { family: 'JetBrains Mono', size: 11 }
        }
      },
      animation: { animateRotate: true, duration: 1200, easing: 'easeOutQuart' }
    }
  });
}

function initObsChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  if (obsChartInstance) { obsChartInstance.destroy(); }

  // Count observations per month for last 6 months
  const obs = getObservations();
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
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0d1424',
          borderColor: 'rgba(0,255,204,0.3)',
          borderWidth: 1,
          titleColor: '#00ffcc',
          bodyColor: '#e8f4ff',
          bodyFont: { family: 'JetBrains Mono', size: 11 }
        }
      },
      scales: {
        x: { grid: { color: 'rgba(0,212,255,0.06)' }, ticks: { color: '#7a9bbf', font: { family: 'JetBrains Mono', size: 10 } } },
        y: { grid: { color: 'rgba(0,212,255,0.06)' }, ticks: { color: '#7a9bbf', font: { family: 'JetBrains Mono', size: 10 }, stepSize: 1 }, beginAtZero: true }
      },
      animation: { duration: 1000, easing: 'easeOutQuart' }
    }
  });
}
