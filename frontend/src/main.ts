import './style.css';
import { createChart, ColorType } from 'lightweight-charts';
import type { IChartApi, ISeriesApi } from 'lightweight-charts';

// State
let currentView = 'overview';
const API_BASE = 'http://localhost:8000/api';

// Render the UI Shell
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="shell shell--chat" id="app-shell">
    <!-- Topbar -->
    <header class="topbar">
      <div class="topbar-left">
        <button class="nav-collapse-toggle" id="sidebar-toggle" aria-label="Toggle Navigation">
          <span class="nav-collapse-toggle__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </span>
        </button>
        <div class="brand">
          <div class="brand-text">
            <span class="brand-title">🤖 ALPHAGPT COMMANDER</span>
            <span class="brand-sub">Autonomous Solana Trading Bot</span>
          </div>
        </div>
      </div>
      <button
        id="theme-mode-system"
        class="topbar-search"
        type="button"
        style="display:none"
      ></button>
      <div class="topbar-status">
        <span id="wallet-balance" class="brand-sub">Balance: ... SOL</span>
        <div class="topbar-theme-mode" aria-label="Color mode" role="group">
          <button
            type="button"
            class="topbar-theme-mode__btn"
            id="theme-light"
            aria-label="Light mode"
          >
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          </button>
          <button
            type="button"
            class="topbar-theme-mode__btn"
            id="theme-dark"
            aria-label="Dark mode"
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 3a6.5 6.5 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <nav class="shell-nav">
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-brand">
            <span class="sidebar-brand__title">MENU</span>
          </div>
          <button
            type="button"
            class="nav-collapse-toggle"
            aria-label="Collapse sidebar"
            id="sidebar-collapse-toggle"
          >
            <span class="nav-collapse-toggle__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </span>
          </button>
        </div>
        <div class="sidebar-nav">
          <!-- Control Group -->
          <div class="nav-group">
            <div class="nav-group__label">
              <span class="nav-group__label-text">控制 (Control)</span>
            </div>
            <div class="nav-group__items">
              <button class="nav-item nav-item--active" data-view="overview">
                <span class="nav-item__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <line x1="12" x2="12" y1="20" y2="10" />
                    <line x1="18" x2="18" y1="20" y2="4" />
                    <line x1="6" x2="6" y1="20" y2="16" />
                  </svg>
                </span>
                <span class="nav-item__text">概览 (Overview)</span>
              </button>
              <button class="nav-item" data-view="portfolio">
                <span class="nav-item__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
                <span class="nav-item__text">投资组合 (Portfolio)</span>
              </button>
              <button class="nav-item" data-view="market">
                <span class="nav-item__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                </span>
                <span class="nav-item__text">市场扫描 (Market)</span>
              </button>
            </div>
          </div>

          <!-- System Group -->
          <div class="nav-group" style="margin-top: 20px;">
            <div class="nav-group__label">
              <span class="nav-group__label-text">系统 (System)</span>
            </div>
            <div class="nav-group__items">
              <button class="nav-item" data-view="logs">
                <span class="nav-item__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"
                    />
                    <path d="M19 17V5a2 2 0 0 0-2-2H4" />
                    <path d="M15 8h-5" />
                    <path d="M15 12h-5" />
                  </svg>
                </span>
                <span class="nav-item__text">系统日志 (Logs)</span>
              </button>
              <button class="nav-item" data-view="settings">
                <span class="nav-item__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                    />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </span>
                <span class="nav-item__text">常规配置 (Settings)</span>
              </button>
            </div>
          </div>
        </div>
        <div class="sidebar-footer">
          <div class="stack" style="padding: 10px;">
            <button
              id="btn-refresh"
              class="nav-item"
              style="justify-content: center; background: var(--bg-hover);"
            >
              <span class="nav-item__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"
                  />
                  <path d="M21 3v5h-5" />
                </svg>
              </span>
              <span class="nav-item__text">刷新 (Refresh)</span>
            </button>
            <button
              id="btn-stop"
              class="nav-item"
              style="justify-content: center; background: var(--danger-subtle); color: var(--danger);"
            >
              <span class="nav-item__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <rect width="14" height="14" x="5" y="5" rx="1" />
                </svg>
              </span>
              <span class="nav-item__text">停止 (STOP)</span>
            </button>
          </div>
        </div>
      </aside>
    </nav>

    <!-- Main Content -->
    <main class="content">
      <!-- Overview View -->
      <div id="view-overview" class="view-section">
        <div class="content-header">
          <div>
            <div class="page-title">仪表盘概览</div>
            <div class="page-sub">用于快速干预和查看全局系统状态</div>
          </div>
        </div>
        <div class="ov-cards" style="margin-top: 24px;">
          <div class="ov-card">
            <div class="ov-card__label">开启仓位</div>
            <div class="ov-card__value" id="val-open-pos">-</div>
            <div class="ov-card__hint">当前已占用 / 最大可用仓位</div>
          </div>
          <div class="ov-card">
            <div class="ov-card__label">总投资额</div>
            <div class="ov-card__value" id="val-total-inv">- SOL</div>
            <div class="ov-card__hint">按初始建仓成本估算</div>
          </div>
          <div class="ov-card">
            <div class="ov-card__label">未实现盈亏 (估算)</div>
            <div class="ov-card__value" id="val-unrealized-pnl">- SOL</div>
            <div class="ov-card__hint">根据当前价格粗略估算的浮动盈亏</div>
          </div>
          <div class="ov-card">
            <div class="ov-card__label">活跃策略</div>
            <div class="ov-card__value" id="val-strategy">AlphaGPT-v1</div>
            <div class="ov-card__hint">当前运行中的策略版本</div>
          </div>
        </div>
      </div>

      <!-- Portfolio View -->
      <div id="view-portfolio" class="view-section" style="display: none;">
        <div class="content-header">
          <div>
            <div class="page-title">投资组合</div>
            <div class="page-sub">查看和管理当前所有处于持仓状态的代币，点击行查看 K 线</div>
          </div>
        </div>
        <div class="data-table-wrapper" style="margin-top: 24px;">
          <div class="data-table-container">
            <table class="data-table" id="portfolio-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Entry Price</th>
                  <th>Highest</th>
                  <th>Amount Held</th>
                  <th>PnL %</th>
                  <th>Moonbag</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
        <div
          id="chart-container"
          style="width: 100%; height: 400px; margin-top: 24px; display: none;"
        ></div>
      </div>

      <!-- Market Scanner View -->
      <div id="view-market" class="view-section" style="display: none;">
        <div class="content-header">
          <div>
            <div class="page-title">市场扫描</div>
            <div class="page-sub">当前数据库中抓取到的最高分标的，点击行查看 K 线</div>
          </div>
        </div>
        <div class="data-table-wrapper" style="margin-top: 24px;">
          <div class="data-table-container">
            <table class="data-table" id="market-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Address</th>
                  <th>Close</th>
                  <th>Volume</th>
                  <th>Liquidity</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Logs View -->
      <div id="view-logs" class="view-section" style="display: none;">
        <div class="content-header">
          <div>
            <div class="page-title">系统日志</div>
            <div class="page-sub">查看最近的后台执行日志与报错</div>
          </div>
        </div>
        <div style="margin-top: 24px;">
          <pre id="logs-container" class="code-block" style="max-height: 420px;"></pre>
        </div>
      </div>

      <!-- Settings View (常规页面) -->
      <div id="view-settings" class="view-section" style="display: none;">
        <div class="content-header">
          <div>
            <div class="page-title">常规设置</div>
            <div class="page-sub">系统运行参数及常规选项配置</div>
          </div>
        </div>
        <div class="grid" style="margin-top: 24px; max-width: 600px;">
          <div class="card">
            <div class="card-title">API 配置</div>
            <div class="card-sub">RPC、行情等后端服务的访问参数。</div>
            <div class="form-grid" style="margin-top: 16px;">
              <label class="field full">
                <span>RPC 节点地址</span>
                <input type="text" value="https://api.mainnet-beta.solana.com" />
              </label>
              <label class="field full">
                <span>Birdeye API Key</span>
                <input type="password" value="********" />
              </label>
              <label class="field full">
                <span>单次最大持仓数</span>
                <input type="number" value="5" />
              </label>
            </div>
            <div style="margin-top: 16px;">
              <button class="btn primary" type="button">保存设置 (Save)</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
`;

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
