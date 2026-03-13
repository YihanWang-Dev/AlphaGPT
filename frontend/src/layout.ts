import { el, txt } from './dom';

function createTopbar(): HTMLElement {
  const menuIcon = el(
    'span',
    { className: 'nav-collapse-toggle__icon', attrs: { 'aria-hidden': 'true' } },
    [
      (() => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        const l1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        l1.setAttribute('x1', '4');
        l1.setAttribute('x2', '20');
        l1.setAttribute('y1', '12');
        l1.setAttribute('y2', '12');
        const l2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        l2.setAttribute('x1', '4');
        l2.setAttribute('x2', '20');
        l2.setAttribute('y1', '6');
        l2.setAttribute('y2', '6');
        const l3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        l3.setAttribute('x1', '4');
        l3.setAttribute('x2', '20');
        l3.setAttribute('y1', '18');
        l3.setAttribute('y2', '18');
        svg.append(l1, l2, l3);
        return svg;
      })() as unknown as HTMLElement,
    ],
  );

  const sidebarToggle = el(
    'button',
    {
      className: 'nav-collapse-toggle',
      attrs: { id: 'sidebar-toggle', 'aria-label': 'Toggle Navigation' },
    },
    [menuIcon],
  );

  const brandTitle = el('span', { className: 'brand-title' }, [txt('🤖 ALPHAGPT COMMANDER')]);
  const brandSub = el('span', { className: 'brand-sub' }, [txt('Autonomous Solana Trading Bot')]);
  const brandText = el('div', { className: 'brand-text' }, [brandTitle, brandSub]);
  const brand = el('div', { className: 'brand' }, [brandText]);

  const topbarLeft = el('div', { className: 'topbar-left' }, [sidebarToggle, brand]);

  const walletBalance = el('span', { className: 'brand-sub', attrs: { id: 'wallet-balance' } }, [
    txt('Balance: ... SOL'),
  ]);

  const lightIcon = (() => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', '12');
    c.setAttribute('cy', '12');
    c.setAttribute('r', '4');
    const paths = [
      ['12', '2', '12', '4'],
      ['12', '20', '12', '22'],
    ];
    const lines: SVGLineElement[] = [];
    for (const [x1, y1, x2, y2] of paths.map(([x1, y1, x2, y2]) =>
      [x1, y1, x2, y2] as [string, string, string, string],
    )) {
      const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('x1', x1);
      l.setAttribute('y1', y1);
      l.setAttribute('x2', x2);
      l.setAttribute('y2', y2);
      lines.push(l);
    }
    const extras = [
      ['4.93', '4.93', '6.34', '6.34'],
      ['17.66', '17.66', '19.07', '19.07'],
      ['2', '12', '4', '12'],
      ['20', '12', '22', '12'],
      ['6.34', '17.66', '4.93', '19.07'],
      ['19.07', '4.93', '17.66', '6.34'],
    ] as [string, string, string, string][];
    const extraLines: SVGLineElement[] = [];
    for (const [x1, y1, x2, y2] of extras) {
      const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('x1', x1);
      l.setAttribute('y1', y1);
      l.setAttribute('x2', x2);
      l.setAttribute('y2', y2);
      extraLines.push(l);
    }
    svg.append(c, ...lines, ...extraLines);
    return svg;
  })();

  const darkIcon = (() => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12 3a6.5 6.5 0 0 0 9 9 9 9 0 1 1-9-9Z');
    svg.append(path);
    return svg;
  })();

  const themeLightBtn = el(
    'button',
    {
      className: 'topbar-theme-mode__btn',
      attrs: { id: 'theme-light', 'aria-label': 'Light mode', type: 'button' },
    },
    [lightIcon as unknown as HTMLElement],
  );

  const themeDarkBtn = el(
    'button',
    {
      className: 'topbar-theme-mode__btn',
      attrs: { id: 'theme-dark', 'aria-label': 'Dark mode', type: 'button' },
    },
    [darkIcon as unknown as HTMLElement],
  );

  const themeModeGroup = el(
    'div',
    { className: 'topbar-theme-mode', attrs: { role: 'group', 'aria-label': 'Color mode' } },
    [themeLightBtn, themeDarkBtn],
  );

  const topbarStatus = el('div', { className: 'topbar-status' }, [walletBalance, themeModeGroup]);

  const header = el('header', { className: 'topbar' }, [topbarLeft, topbarStatus]);
  return header;
}

function createSidebar(): HTMLElement {
  const sidebarTitle = el('span', { className: 'sidebar-brand__title' }, [txt('MENU')]);
  const sidebarBrand = el('div', { className: 'sidebar-brand' }, [sidebarTitle]);

  const collapseIcon = (() => {
    const span = el('span', { className: 'nav-collapse-toggle__icon', attrs: { 'aria-hidden': 'true' } });
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    const mkLine = (x1: string, y1: string, x2: string, y2: string) => {
      const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('x1', x1);
      l.setAttribute('y1', y1);
      l.setAttribute('x2', x2);
      l.setAttribute('y2', y2);
      return l;
    };
    svg.append(
      mkLine('4', '12', '20', '12'),
      mkLine('4', '6', '20', '6'),
      mkLine('4', '18', '20', '18'),
    );
    span.append(svg as unknown as HTMLElement);
    return span;
  })();

  const collapseBtn = el(
    'button',
    {
      className: 'nav-collapse-toggle',
      attrs: { id: 'sidebar-collapse-toggle', type: 'button', 'aria-label': 'Collapse sidebar' },
    },
    [collapseIcon],
  );

  const sidebarHeader = el('div', { className: 'sidebar-header' }, [sidebarBrand, collapseBtn]);

  const makeNavItem = (view: string, label: string, iconBuilder: () => SVGElement, active = false) => {
    const iconSpan = el('span', { className: 'nav-item__icon', attrs: { 'aria-hidden': 'true' } }, [
      iconBuilder() as unknown as HTMLElement,
    ]);
    const textSpan = el('span', { className: 'nav-item__text' }, [txt(label)]);
    const classes = ['nav-item'];
    if (active) classes.push('nav-item--active');
    return el(
      'button',
      { className: classes.join(' '), attrs: { 'data-view': view, type: 'button' } },
      [iconSpan, textSpan],
    );
  };

  const overviewIcon = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    const mkLine = (x1: string, y1: string, x2: string, y2: string) => {
      const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('x1', x1);
      l.setAttribute('x2', x2);
      l.setAttribute('y1', y1);
      l.setAttribute('y2', y2);
      return l;
    };
    svg.append(mkLine('12', '20', '12', '10'), mkLine('18', '20', '18', '4'), mkLine('6', '20', '6', '16'));
    return svg;
  };

  const portfolioIcon = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    );
    svg.append(path);
    return svg;
  };

  const marketIcon = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '12');
    circle.setAttribute('r', '10');
    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('d', 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20');
    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('d', 'M2 12h20');
    svg.append(circle, path1, path2);
    return svg;
  };

  const logsIcon = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    const p1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p1.setAttribute(
      'd',
      'M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4',
    );
    const p2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p2.setAttribute('d', 'M19 17V5a2 2 0 0 0-2-2H4');
    const p3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p3.setAttribute('d', 'M15 8h-5');
    const p4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p4.setAttribute('d', 'M15 12h-5');
    svg.append(p1, p2, p3, p4);
    return svg;
  };

  const settingsIcon = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute(
      'd',
      'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
    );
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', '12');
    c.setAttribute('cy', '12');
    c.setAttribute('r', '3');
    svg.append(p, c);
    return svg;
  };

  const overviewItem = makeNavItem('overview', '概览 (Overview)', overviewIcon, true);
  const portfolioItem = makeNavItem('portfolio', '投资组合 (Portfolio)', portfolioIcon);
  const marketItem = makeNavItem('market', '市场扫描 (Market)', marketIcon);

  const controlLabel = el('div', { className: 'nav-group__label' }, [
    el('span', { className: 'nav-group__label-text' }, [txt('控制 (Control)')]),
  ]);
  const controlItems = el('div', { className: 'nav-group__items' }, [
    overviewItem,
    portfolioItem,
    marketItem,
  ]);
  const controlGroup = el('div', { className: 'nav-group' }, [controlLabel, controlItems]);

  const logsItem = makeNavItem('logs', '系统日志 (Logs)', logsIcon);
  const settingsItem = makeNavItem('settings', '常规配置 (Settings)', settingsIcon);
  const systemLabel = el('div', { className: 'nav-group__label' }, [
    el('span', { className: 'nav-group__label-text' }, [txt('系统 (System)')]),
  ]);
  const systemItems = el('div', { className: 'nav-group__items' }, [logsItem, settingsItem]);
  const systemGroup = el(
    'div',
    { className: 'nav-group', attrs: { style: 'margin-top: 20px;' } },
    [systemLabel, systemItems],
  );

  const sidebarNav = el('div', { className: 'sidebar-nav' }, [controlGroup, systemGroup]);

  const refreshIcon = (() => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    const p1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p1.setAttribute(
      'd',
      'M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8',
    );
    const p2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p2.setAttribute('d', 'M21 3v5h-5');
    svg.append(p1, p2);
    return svg;
  })();

  const refreshBtn = el(
    'button',
    {
      className: 'nav-item',
      attrs: {
        id: 'btn-refresh',
        type: 'button',
        style: 'justify-content: center; background: var(--bg-hover);',
      },
    },
    [
      el('span', { className: 'nav-item__icon', attrs: { 'aria-hidden': 'true' } }, [
        refreshIcon as unknown as HTMLElement,
      ]),
      el('span', { className: 'nav-item__text' }, [txt('刷新 (Refresh)')]),
    ],
  );

  const stopIcon = (() => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    r.setAttribute('width', '14');
    r.setAttribute('height', '14');
    r.setAttribute('x', '5');
    r.setAttribute('y', '5');
    r.setAttribute('rx', '1');
    svg.append(r);
    return svg;
  })();

  const stopBtn = el(
    'button',
    {
      className: 'nav-item',
      attrs: {
        id: 'btn-stop',
        type: 'button',
        style: 'justify-content: center; background: var(--danger-subtle); color: var(--danger);',
      },
    },
    [
      el('span', { className: 'nav-item__icon', attrs: { 'aria-hidden': 'true' } }, [
        stopIcon as unknown as HTMLElement,
      ]),
      el('span', { className: 'nav-item__text' }, [txt('停止 (STOP)')]),
    ],
  );

  const sidebarFooterInner = el('div', { className: 'stack', attrs: { style: 'padding: 10px;' } }, [
    refreshBtn,
    stopBtn,
  ]);
  const sidebarFooter = el('div', { className: 'sidebar-footer' }, [sidebarFooterInner]);

  const aside = el('aside', { className: 'sidebar', attrs: { id: 'sidebar' } }, [
    sidebarHeader,
    sidebarNav,
    sidebarFooter,
  ]);

  const nav = el('nav', { className: 'shell-nav' }, [aside]);
  return nav;
}

function createMainContent(): HTMLElement {
  const main = el('main', { className: 'content' });

  const overviewHeader = el('div', { className: 'content-header' }, [
    el('div', {}, [
      el('div', { className: 'page-title' }, [txt('仪表盘概览')]),
      el('div', { className: 'page-sub' }, [txt('用于快速干预和查看全局系统状态')]),
    ]),
  ]);

  const overviewCards = el('div', { className: 'ov-cards', attrs: { style: 'margin-top: 24px;' } }, [
    (() => {
      const card = el('div', { className: 'ov-card' });
      card.append(
        el('div', { className: 'ov-card__label' }, [txt('开启仓位')]),
        el('div', { className: 'ov-card__value', attrs: { id: 'val-open-pos' } }, [txt('-')]),
        el('div', { className: 'ov-card__hint' }, [txt('当前已占用 / 最大可用仓位')]),
      );
      return card;
    })(),
    (() => {
      const card = el('div', { className: 'ov-card' });
      card.append(
        el('div', { className: 'ov-card__label' }, [txt('总投资额')]),
        el('div', { className: 'ov-card__value', attrs: { id: 'val-total-inv' } }, [txt('- SOL')]),
        el('div', { className: 'ov-card__hint' }, [txt('按初始建仓成本估算')]),
      );
      return card;
    })(),
    (() => {
      const card = el('div', { className: 'ov-card' });
      card.append(
        el('div', { className: 'ov-card__label' }, [txt('未实现盈亏 (估算)')]),
        el('div', { className: 'ov-card__value', attrs: { id: 'val-unrealized-pnl' } }, [txt('- SOL')]),
        el('div', { className: 'ov-card__hint' }, [txt('根据当前价格粗略估算的浮动盈亏')]),
      );
      return card;
    })(),
    (() => {
      const card = el('div', { className: 'ov-card' });
      card.append(
        el('div', { className: 'ov-card__label' }, [txt('活跃策略')]),
        el('div', { className: 'ov-card__value', attrs: { id: 'val-strategy' } }, [txt('AlphaGPT-v1')]),
        el('div', { className: 'ov-card__hint' }, [txt('当前运行中的策略版本')]),
      );
      return card;
    })(),
  ]);

  const overviewView = el('div', { className: 'view-section', attrs: { id: 'view-overview' } }, [
    overviewHeader,
    overviewCards,
  ]);

  const portfolioHeader = el('div', { className: 'content-header' }, [
    el('div', {}, [
      el('div', { className: 'page-title' }, [txt('投资组合')]),
      el('div', { className: 'page-sub' }, [
        txt('查看和管理当前所有处于持仓状态的代币，点击行查看 K 线'),
      ]),
    ]),
  ]);

  const portfolioTable = el('table', { className: 'data-table', attrs: { id: 'portfolio-table' } }, [
    (() => {
      const thead = document.createElement('thead');
      const tr = document.createElement('tr');
      ['Symbol', 'Entry Price', 'Highest', 'Amount Held', 'PnL %', 'Moonbag'].forEach((h) => {
        const th = document.createElement('th');
        th.textContent = h;
        tr.appendChild(th);
      });
      thead.appendChild(tr);
      return thead as unknown as HTMLElement;
    })(),
    (() => {
      const tbody = document.createElement('tbody');
      return tbody as unknown as HTMLElement;
    })(),
  ]);

  const portfolioWrapper = el('div', { className: 'data-table-wrapper', attrs: { style: 'margin-top: 24px;' } }, [
    el('div', { className: 'data-table-container' }, [portfolioTable]),
  ]);

  const chartContainer = el('div', {
    attrs: {
      id: 'chart-container',
      style: 'width: 100%; height: 400px; margin-top: 24px; display: none;',
    },
  });

  const portfolioView = el(
    'div',
    { className: 'view-section', attrs: { id: 'view-portfolio', style: 'display: none;' } },
    [portfolioHeader, portfolioWrapper, chartContainer],
  );

  const marketHeader = el('div', { className: 'content-header' }, [
    el('div', {}, [
      el('div', { className: 'page-title' }, [txt('市场扫描')]),
      el('div', { className: 'page-sub' }, [
        txt('当前数据库中抓取到的最高分标的，点击行查看 K 线'),
      ]),
    ]),
  ]);

  const marketTable = el('table', { className: 'data-table', attrs: { id: 'market-table' } }, [
    (() => {
      const thead = document.createElement('thead');
      const tr = document.createElement('tr');
      ['Symbol', 'Address', 'Close', 'Volume', 'Liquidity'].forEach((h) => {
        const th = document.createElement('th');
        th.textContent = h;
        tr.appendChild(th);
      });
      thead.appendChild(tr);
      return thead as unknown as HTMLElement;
    })(),
    (() => {
      const tbody = document.createElement('tbody');
      return tbody as unknown as HTMLElement;
    })(),
  ]);

  const marketWrapper = el('div', { className: 'data-table-wrapper', attrs: { style: 'margin-top: 24px;' } }, [
    el('div', { className: 'data-table-container' }, [marketTable]),
  ]);

  const marketView = el(
    'div',
    { className: 'view-section', attrs: { id: 'view-market', style: 'display: none;' } },
    [marketHeader, marketWrapper],
  );

  const logsHeader = el('div', { className: 'content-header' }, [
    el('div', {}, [
      el('div', { className: 'page-title' }, [txt('系统日志')]),
      el('div', { className: 'page-sub' }, [txt('查看最近的后台执行日志与报错')]),
    ]),
  ]);

  const logsContainer = el('pre', { className: 'code-block', attrs: { id: 'logs-container', style: 'max-height: 420px;' } });
  const logsView = el(
    'div',
    { className: 'view-section', attrs: { id: 'view-logs', style: 'display: none;' } },
    [
      logsHeader,
      el('div', { attrs: { style: 'margin-top: 24px;' } }, [logsContainer]),
    ],
  );

  const settingsHeader = el('div', { className: 'content-header' }, [
    el('div', {}, [
      el('div', { className: 'page-title' }, [txt('常规设置')]),
      el('div', { className: 'page-sub' }, [txt('系统运行参数、API 与数据库配置')]),
    ]),
  ]);

  const settingsNav = el('div', { className: 'settings-sidebar__nav', attrs: { role: 'tablist' } }, [
    el(
      'button',
      {
        className: 'settings-tab settings-tab--active',
        attrs: {
          type: 'button',
          role: 'tab',
          'aria-selected': 'true',
          'data-settings-tab': 'api',
        },
      },
      [txt('API 配置')],
    ),
    el(
      'button',
      {
        className: 'settings-tab',
        attrs: {
          type: 'button',
          role: 'tab',
          'aria-selected': 'false',
          'data-settings-tab': 'db',
        },
      },
      [txt('数据库配置')],
    ),
  ]);

  const apiForm = el('div', { className: 'card' }, [
    el('div', { className: 'card-title' }, [txt('API 配置')]),
    el('div', { className: 'card-sub' }, [txt('RPC、行情等后端服务的访问参数。')]),
    el('div', { className: 'form-grid', attrs: { style: 'margin-top: 16px;' } }, [
      (() => {
        const label = el('label', { className: 'field full' });
        label.append(
          el('span', {}, [txt('RPC 节点地址')]),
          el('input', {
            attrs: {
              type: 'text',
              value: 'https://api.mainnet-beta.solana.com',
            },
          }),
        );
        return label;
      })(),
      (() => {
        const label = el('label', { className: 'field full' });
        label.append(
          el('span', {}, [txt('Birdeye API Key')]),
          el('input', {
            attrs: {
              type: 'password',
              value: '********',
            },
          }),
        );
        return label;
      })(),
      (() => {
        const label = el('label', { className: 'field full' });
        label.append(
          el('span', {}, [txt('单次最大持仓数')]),
          el('input', {
            attrs: {
              type: 'number',
              value: '5',
            },
          }),
        );
        return label;
      })(),
    ]),
    el('div', { attrs: { style: 'margin-top: 16px;' } }, [
      el('button', { className: 'btn primary', attrs: { type: 'button' } }, [txt('保存设置 (Save)')]),
    ]),
  ]);

  const dbForm = el('div', { className: 'card' }, [
    el('div', { className: 'card-title' }, [txt('数据库配置')]),
    el('div', { className: 'card-sub' }, [txt('连接交易日志与市场数据所使用的数据库。')]),
    el('div', { className: 'form-grid', attrs: { style: 'margin-top: 16px;' } }, [
      (() => {
        const label = el('label', { className: 'field full' });
        label.append(
          el('span', {}, [txt('数据库主机 (Host)')]),
          el('input', {
            attrs: {
              type: 'text',
              placeholder: '127.0.0.1',
            },
          }),
        );
        return label;
      })(),
      (() => {
        const label = el('label', { className: 'field full' });
        label.append(
          el('span', {}, [txt('端口 (Port)')]),
          el('input', {
            attrs: {
              type: 'number',
              placeholder: '5432',
            },
          }),
        );
        return label;
      })(),
      (() => {
        const label = el('label', { className: 'field full' });
        label.append(
          el('span', {}, [txt('数据库名 (Database)')]),
          el('input', {
            attrs: {
              type: 'text',
              placeholder: 'alphagpt',
            },
          }),
        );
        return label;
      })(),
      (() => {
        const label = el('label', { className: 'field full' });
        label.append(
          el('span', {}, [txt('用户名 (User)')]),
          el('input', {
            attrs: {
              type: 'text',
              placeholder: 'postgres',
            },
          }),
        );
        return label;
      })(),
      (() => {
        const label = el('label', { className: 'field full' });
        label.append(
          el('span', {}, [txt('密码 (Password)')]),
          el('input', {
            attrs: {
              type: 'password',
              placeholder: '********',
            },
          }),
        );
        return label;
      })(),
    ]),
    el('div', { attrs: { style: 'margin-top: 16px;' } }, [
      el('button', { className: 'btn primary', attrs: { type: 'button' } }, [txt('保存数据库配置')]),
    ]),
  ]);

  const apiPanel = el(
    'div',
    {
      className: 'settings-panel settings-panel--active',
      attrs: {
        id: 'settings-panel-api',
        'data-settings-panel': 'api',
        role: 'tabpanel',
      },
    },
    [
      el('div', { className: 'grid', attrs: { style: 'margin-top: 24px; max-width: 600px;' } }, [apiForm]),
    ],
  );

  const dbPanel = el(
    'div',
    {
      className: 'settings-panel',
      attrs: {
        id: 'settings-panel-db',
        'data-settings-panel': 'db',
        role: 'tabpanel',
      },
    },
    [
      el('div', { className: 'grid', attrs: { style: 'margin-top: 24px; max-width: 600px;' } }, [dbForm]),
    ],
  );

  const settingsPanels = el('div', { className: 'settings-panels' }, [apiPanel, dbPanel]);
  const settingsSidebar = el('aside', { className: 'settings-sidebar' }, [
    el('div', { className: 'settings-sidebar__title' }, [txt('配置类别')]),
    settingsNav,
  ]);
  const settingsContent = el('div', { className: 'settings-content' }, [settingsPanels]);
  const settingsLayout = el('div', { className: 'settings-layout' }, [settingsSidebar, settingsContent]);

  const settingsView = el(
    'div',
    { className: 'view-section', attrs: { id: 'view-settings', style: 'display: none;' } },
    [settingsHeader, settingsLayout],
  );

  main.append(overviewView, portfolioView, marketView, logsView, settingsView);
  return main;
}

export function createShell(): HTMLElement {
  const shell = el('div', { className: 'shell shell--chat', attrs: { id: 'app-shell' } });
  const topbar = createTopbar();
  const sidebar = createSidebar();
  const content = createMainContent();
  shell.append(topbar, sidebar, content);
  return shell;
}

