import './style.css';
import { createChart, ColorType } from 'lightweight-charts';
import type { IChartApi, ISeriesApi } from 'lightweight-charts';
import { createShell } from './layout';

// State
let currentView = 'overview';
const API_BASE = 'http://localhost:8000/api';

const appRoot = document.querySelector<HTMLDivElement>('#app');
if (appRoot) {
  appRoot.appendChild(createShell());
}

// DOM Elements
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarCollapseToggle = document.getElementById('sidebar-collapse-toggle');
const shell = document.getElementById('app-shell');
const navItems = document.querySelectorAll('.nav-item[data-view]');
const viewSections = document.querySelectorAll('.view-section');

// Chart instance
let chart: IChartApi | null = null;
let candleSeries: ISeriesApi<"Candlestick"> | null = null;
let volumeSeries: ISeriesApi<"Histogram"> | null = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupThemeModeToggle();
  setupActions();
  setupSettingsTabs();
  
  // Load initial view data
  loadOverview();
});

// Navigation Logic
function setupNavigation() {
  sidebarToggle?.addEventListener('click', () => {
    shell?.classList.toggle('shell--nav-collapsed');
  });

  sidebarCollapseToggle?.addEventListener('click', () => {
    shell?.classList.toggle('shell--nav-collapsed');
  });

  // Simple responsive sidebar handling
  if (window.innerWidth <= 1100) {
    shell?.classList.add('shell--nav-collapsed');
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Update active state
      navItems.forEach(n => n.classList.remove('nav-item--active'));
      item.classList.add('nav-item--active');

      // Switch view
      const targetView = item.getAttribute('data-view') || 'overview';
      currentView = targetView;
      
      viewSections.forEach(v => {
        const el = v as HTMLElement;
        if (el.id === `view-${targetView}`) {
          el.style.display = 'block';
        } else {
          el.style.display = 'none';
        }
      });

      // Load specific view data
      if (targetView === 'overview') loadOverview();
      if (targetView === 'portfolio') loadPortfolio();
      if (targetView === 'market') loadMarket();
      if (targetView === 'logs') loadLogs();
      
      // Close sidebar on mobile after clicking
      if (window.innerWidth <= 1100) {
        shell?.classList.add('shell--nav-collapsed');
      }
    });
  });
}

function setupThemeModeToggle() {
  const root = document.documentElement;
  const lightBtn = document.getElementById('theme-light');
  const darkBtn = document.getElementById('theme-dark');

  const applyMode = (mode: 'light' | 'dark') => {
    root.dataset.themeMode = mode;
    if (mode === 'light') {
      lightBtn?.classList.add('topbar-theme-mode__btn--active');
      darkBtn?.classList.remove('topbar-theme-mode__btn--active');
      root.dataset.theme = 'openknot-light';
    } else {
      darkBtn?.classList.add('topbar-theme-mode__btn--active');
      lightBtn?.classList.remove('topbar-theme-mode__btn--active');
      root.dataset.theme = 'openknot';
    }
  };

  const initialMode = (root.dataset.themeMode as 'light' | 'dark') || 'light';
  applyMode(initialMode);

  lightBtn?.addEventListener('click', () => applyMode('light'));
  darkBtn?.addEventListener('click', () => applyMode('dark'));
}

function setupSettingsTabs() {
  const tabButtons = document.querySelectorAll<HTMLButtonElement>('[data-settings-tab]');
  const panels = document.querySelectorAll<HTMLElement>('[data-settings-panel]');

  if (!tabButtons.length || !panels.length) return;

  const activate = (target: string) => {
    tabButtons.forEach((btn) => {
      const isActive = btn.dataset.settingsTab === target;
      btn.classList.toggle('settings-tab--active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.settingsPanel === target;
      panel.classList.toggle('settings-panel--active', isActive);
    });
  };

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.settingsTab || 'api';
      activate(target);
    });
  });
}

function setupActions() {
  document.getElementById('btn-refresh')?.addEventListener('click', () => {
    if (currentView === 'overview') loadOverview();
    if (currentView === 'portfolio') loadPortfolio();
    if (currentView === 'market') loadMarket();
    if (currentView === 'logs') loadLogs();
  });

  document.getElementById('btn-stop')?.addEventListener('click', async () => {
    if(confirm('Are you sure you want to STOP the trading bot?')) {
      try {
        const res = await fetch(`${API_BASE}/stop`, { method: 'POST' });
        if(res.ok) alert('STOP signal sent successfully.');
      } catch (e) {
        console.error(e);
        alert('Failed to send stop signal.');
      }
    }
  });
}

// Data Fetching & Rendering
async function loadOverview() {
  try {
    const [balRes, portRes, stratRes] = await Promise.all([
      fetch(`${API_BASE}/balance`).then(r => r.json()),
      fetch(`${API_BASE}/portfolio`).then(r => r.json()),
      fetch(`${API_BASE}/strategy`).then(r => r.json())
    ]);

    // Update Balance in Topbar
    const balEl = document.getElementById('wallet-balance');
    if(balEl) balEl.textContent = `Balance: ${balRes.balance.toFixed(4)} SOL`;

    // Update Overview Cards
    let openPos = 0;
    let totalInv = 0;
    let currentVal = 0;

    if (Array.isArray(portRes) && portRes.length > 0) {
      openPos = portRes.length;
      portRes.forEach((pos: any) => {
        totalInv += pos.initial_cost_sol || 0;
        currentVal += (pos.amount_held || 0) * (pos.highest_price || pos.entry_price || 0);
      });
    }

    const pnl = currentVal - totalInv;
    
    document.getElementById('val-open-pos')!.textContent = `${openPos} / 5`;
    document.getElementById('val-total-inv')!.textContent = `${totalInv.toFixed(2)} SOL`;
    
    const pnlEl = document.getElementById('val-unrealized-pnl')!;
    pnlEl.textContent = `${pnl > 0 ? '+' : ''}${pnl.toFixed(3)} SOL`;
    pnlEl.className = `page-title ${pnl >= 0 ? 'text-green' : 'text-red'}`;

    if(stratRes && stratRes.formula) {
        document.getElementById('val-strategy')!.textContent = 'AlphaGPT-v1'; // Or dynamic based on stratRes
    }

  } catch (error) {
    console.error("Error loading overview:", error);
  }
}

async function loadPortfolio() {
  try {
    const data = await fetch(`${API_BASE}/portfolio`).then(r => r.json());
    const tbody = document.querySelector('#portfolio-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">No active positions</td></tr>';
      return;
    }

    data.forEach((pos: any) => {
      const tr = document.createElement('tr');
      // Pass token address or symbol to chart loader on click
      tr.addEventListener('click', () => loadChart(pos.token || pos.symbol, 'chart-container'));
      
      const pnlPct = pos.pnl_pct ? (pos.pnl_pct * 100).toFixed(2) : '0.00';
      const pnlClass = parseFloat(pnlPct) >= 0 ? 'text-green' : 'text-red';
      
      tr.innerHTML = `
        <td><strong>${pos.symbol}</strong></td>
        <td>${Number(pos.entry_price).toFixed(6)}</td>
        <td>${Number(pos.highest_price || pos.entry_price).toFixed(6)}</td>
        <td>${Number(pos.amount_held).toFixed(2)}</td>
        <td class="${pnlClass}">${pnlPct}%</td>
        <td>${pos.is_moonbag ? '✅' : '-'}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading portfolio:", error);
  }
}

async function loadMarket() {
  try {
    const data = await fetch(`${API_BASE}/market`).then(r => r.json());
    const tbody = document.querySelector('#market-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">No market data available</td></tr>';
      return;
    }

    data.forEach((item: any) => {
      const tr = document.createElement('tr');
      tr.addEventListener('click', () => {
         // Assuming chart container could be moved or we use a modal.
         // For simplicity, let's just log or maybe you want to show chart below table.
         alert(`Load K-line for ${item.symbol}: ${item.address}`);
      });
      
      tr.innerHTML = `
        <td><strong>${item.symbol}</strong></td>
        <td style="font-family: monospace; font-size: 11px;">${item.address}</td>
        <td>${Number(item.close).toFixed(6)}</td>
        <td>$${Number(item.volume).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
        <td>$${Number(item.liquidity).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading market:", error);
  }
}

async function loadLogs() {
  try {
    const data = await fetch(`${API_BASE}/logs`).then(r => r.json());
    const container = document.getElementById('logs-container');
    if (!container) return;
    
    if (data.logs && data.logs.length > 0) {
      container.textContent = data.logs.join('');
    } else {
      container.textContent = 'No logs available.';
    }
  } catch (error) {
    console.error("Error loading logs:", error);
  }
}

// Lightweight Charts Implementation
async function loadChart(address: string, containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.style.display = 'block';
  
  try {
    const klineData = await fetch(`${API_BASE}/kline/${address}?limit=200`).then(r => r.json());
    
    if(!klineData || klineData.length === 0) {
        console.warn("No K-line data for", address);
        return;
    }

    if (!chart) {
      chart = createChart(container, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#3c3c43',
        },
        grid: {
          vertLines: { color: 'rgba(0, 0, 0, 0.04)' },
          horzLines: { color: 'rgba(0, 0, 0, 0.04)' },
        },
        crosshair: {
          mode: 0,
        },
      });

      // @ts-ignore
      candleSeries = chart.addCandlestickSeries({
        upColor: '#16a34a',
        downColor: '#dc2626',
        borderDownColor: '#dc2626',
        borderUpColor: '#16a34a',
        wickDownColor: '#dc2626',
        wickUpColor: '#16a34a',
      });
      
      // @ts-ignore
      volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: { type: 'volume' },
        priceScaleId: '', // set as an overlay by setting a blank priceScaleId
      });
      
      if(volumeSeries) {
          volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.8, // highest point of the series will be 80% away from the top
                bottom: 0,
            },
          });
      }
    }

    // Format data for lightweight charts
    const formattedCandles = klineData.map((d:any) => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close
    }));
    
    const formattedVolume = klineData.map((d:any) => ({
        time: d.time,
        value: d.value,
        color: d.close >= d.open ? 'rgba(22, 163, 74, 0.3)' : 'rgba(220, 38, 38, 0.3)'
    }));

    if(candleSeries) candleSeries.setData(formattedCandles);
    if(volumeSeries) volumeSeries.setData(formattedVolume);
    
    chart.timeScale().fitContent();

  } catch (error) {
    console.error("Error loading chart data:", error);
  }
}

// Handle window resize for chart
window.addEventListener('resize', () => {
    if (chart && document.getElementById('chart-container')?.style.display === 'block') {
        const container = document.getElementById('chart-container');
        if(container) chart.applyOptions({ width: container.clientWidth });
    }
});
