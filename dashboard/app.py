import streamlit as st
import pandas as pd
import time
from data_service import DashboardService
from visualizer import plot_pnl_distribution, plot_market_scatter

st.set_page_config(
    page_title="AlphaGPT Dashboard",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 注入自定义 CSS 样式，模仿所提供图片的浅色系风格
st.markdown("""
<style>
    /* 全局背景与字体颜色 */
    .stApp {
        background-color: #F8F9FA;
        color: #333333;
    }
    
    /* 侧边栏背景颜色 */
    [data-testid="stSidebar"] {
        background-color: #FFFFFF !important;
        border-right: 1px solid #E5E7EB;
    }
    
    /* 顶部持续显示的标题栏 */
    [data-testid="stHeader"] {
        background-color: #FFFFFF !important;
        border-bottom: 1px solid #E5E7EB;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        height: 3.5rem;
    }
    
    /* 在顶部标题栏注入文字 Logo */
    [data-testid="stHeader"]::after {
        content: "🤖 ALPHAGPT COMMANDER";
        position: absolute;
        left: 4rem; /* 给左侧的汉堡菜单留出空间 */
        top: 0;
        height: 3.5rem;
        display: flex;
        align-items: center;
        font-size: 1.1rem;
        font-weight: 800;
        color: #111827;
        pointer-events: none;
    }

    /* ======= 替换 Streamlit 原生箭头为汉堡包菜单 ======= */
    /* 隐藏自带的 SVG 图标 */
    [data-testid="collapsedControl"] svg,
    [data-testid="stSidebarCollapseButton"] svg,
    button[kind="header"] svg, 
    button[kind="headerNoPadding"] svg {
        display: none !important;
    }

    /* 注入三条横线 (汉堡包) 符号 */
    [data-testid="collapsedControl"]::before,
    [data-testid="stSidebarCollapseButton"]::before,
    button[kind="header"]::before, 
    button[kind="headerNoPadding"]::before {
        content: "\\2261"; /* 汉堡菜单 Unicode ≡ */
        font-size: 1.5rem;
        color: #111827;
        font-weight: normal;
    }
    
    /* ======= 隐藏侧边栏滚动条 (但保留鼠标滚动功能) ======= */
    [data-testid="stSidebar"] *::-webkit-scrollbar {
        width: 0px !important;
        height: 0px !important;
        display: none !important;
        background: transparent !important;
    }
    [data-testid="stSidebar"] * {
        scrollbar-width: none !important; /* Firefox */
        -ms-overflow-style: none !important; /* IE/Edge */
    }

    /* 卡片样式 */
    .metric-card {
        background-color: #FFFFFF;
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #E5E7EB;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    
    /* 数据表格无边框 */
    .stDataFrame { border: none; }
    
    /* ===== 菜单样式 ===== */
    /* 隐藏默认的 radio 按钮小圆圈 */
    div[role="radiogroup"] > label > div:first-child {
        display: none;
    }
    
    /* 菜单项基础样式 */
    div[role="radiogroup"] > label {
        padding: 12px 16px;
        background-color: transparent;
        border-radius: 6px;
        margin-bottom: 4px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        color: #666666;
        font-weight: 500;
        width: 100%;             /* 宽度占满侧边栏 */
        display: block;          /* 设置为块级元素，占满整行 */
        box-sizing: border-box;
    }
    
    /* 悬停效果 */
    div[role="radiogroup"] > label:hover {
        background-color: #F3F4F6;
        color: #111827;
    }
    
    /* 选中状态（参考图片中的淡红色背景和深红色文字） */
    div[role="radiogroup"] > label[data-checked="true"] {
        background-color: #FDE8E8 !important;
        color: #9B1C1C !important;
    }
    
    /* 侧边栏标题（模拟 Logo 区域） */
    .sidebar-logo {
        font-size: 20px;
        font-weight: 800;
        color: #111827;
        margin-bottom: 2px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .sidebar-subtitle {
        font-size: 12px;
        color: #6B7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 20px;
    }
    
    /* 侧边栏分组标题（例如：控制、代理、设置） */
    .menu-group-title {
        font-size: 12px;
        color: #9CA3AF;
        margin-top: 24px;
        margin-bottom: 8px;
        padding-left: 4px;
    }
    
    /* 强制指标字体的颜色（应对浅色主题） */
    [data-testid="stMetricValue"] {
        color: #111827 !important;
    }
    [data-testid="stMetricLabel"] {
        color: #6B7280 !important;
    }
</style>
""", unsafe_allow_html=True)

@st.cache_resource
def get_service():
    return DashboardService()

svc = get_service()

# ======== 侧边栏顶部 Logo 区域 ========
st.sidebar.markdown("""
<div class="sidebar-logo">🤖 ALPHAGPT</div>
<div class="sidebar-subtitle">QUANT DASHBOARD</div>
""", unsafe_allow_html=True)


# ======== 左侧菜单栏 (分组设计) ========

st.sidebar.markdown('<div class="menu-group-title">控制</div>', unsafe_allow_html=True)
menu_control = st.sidebar.radio(
    "控制菜单",
    ["📊 概览", "💼 投资组合", "📈 市场扫描"],
    label_visibility="collapsed",
    key="menu_control"
)

st.sidebar.markdown('<div class="menu-group-title">系统</div>', unsafe_allow_html=True)
menu_system = st.sidebar.radio(
    "系统菜单",
    ["📜 日志", "⚙️ 配置 (开发中)"],
    label_visibility="collapsed",
    key="menu_system",
    index=None # 默认不选中
)

# 确保两个 Radio 组只有一个生效作为主导航
# 在 Streamlit 中完美实现跨 Radio 单选比较复杂，这里用简单的状态判定
active_menu = menu_system if menu_system else menu_control
if menu_control and menu_system:
    # 如果用户点了下面的菜单，我们在逻辑上优先认下面的
    active_menu = menu_system

st.sidebar.markdown("<br><br>", unsafe_allow_html=True)

# ======== 获取全局数据 ========
portfolio_df = svc.load_portfolio()
market_df = svc.get_market_overview()
strategy_data = svc.load_strategy_info()

open_positions = len(portfolio_df)
total_invested = portfolio_df['initial_cost_sol'].sum() if not portfolio_df.empty else 0.0

# ======== 根据菜单选择渲染主界面 ========

if active_menu == "📊 概览":
    st.title("概览")
    st.caption("用于快速干预和查看全局系统状态")
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # 顶部指标卡片
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("开启仓位", f"{open_positions} / 5")
    with col2:
        st.metric("总投资额", f"{total_invested:.2f} SOL")
    with col3:
        if not portfolio_df.empty:
            current_val = (portfolio_df['amount_held'] * portfolio_df['highest_price']).sum()
            pnl_sol = current_val - total_invested
            st.metric("未实现盈亏 (Est)", f"{pnl_sol:+.3f} SOL", delta_color="normal")
        else:
            st.metric("未实现盈亏", "0.00 SOL")
    with col4:
        st.metric("活跃策略", "AlphaGPT-v1")
        
    st.markdown("---")
    
    # ======== 快捷控制面板 ========
    st.subheader("⚡ 快捷控制台")
    control_col1, control_col2, control_col3 = st.columns([1, 1, 2])
    
    with control_col1:
        bal = svc.get_wallet_balance()
        st.metric("钱包余额 (SOL)", f"{bal:.4f}")
        
    with control_col2:
        st.markdown("<br>", unsafe_allow_html=True) # 稍微占位对齐
        if st.button("🔄 刷新数据 (Refresh)", use_container_width=True):
            st.rerun()
            
    with control_col3:
        st.markdown("<br>", unsafe_allow_html=True) # 稍微占位对齐
        if st.button("🛑 紧急停止 (EMERGENCY STOP)", type="primary", use_container_width=True):
            with open("STOP_SIGNAL", "w") as f:
                f.write("STOP")
            st.error("已发送 STOP 信号，正在运行的交易循环将在下一次轮询时终止。")
            
    st.markdown("---")
    st.info("欢迎使用 AlphaGPT Dashboard！所有模块正平稳运行。")

elif active_menu == "💼 投资组合":
    st.title("投资组合")
    st.caption("查看和管理当前所有处于持仓状态的代币")
    
    if not portfolio_df.empty:
        current_val = (portfolio_df['amount_held'] * portfolio_df['highest_price']).sum()
        pnl_sol = current_val - total_invested
        st.metric("当前未实现总盈亏", f"{pnl_sol:+.3f} SOL", delta_color="normal")
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    if not portfolio_df.empty:
        display_cols = ['symbol', 'entry_price', 'highest_price', 'amount_held', 'pnl_pct', 'is_moonbag']
        show_df = portfolio_df[display_cols].copy()
        show_df['pnl_pct'] = show_df['pnl_pct'].apply(lambda x: f"{x:.2%}")
        show_df['entry_price'] = show_df['entry_price'].apply(lambda x: f"{x:.6f}")
        
        st.dataframe(show_df, use_container_width=True, hide_index=True)
        
        st.markdown("### 盈亏分布图")
        st.plotly_chart(plot_pnl_distribution(portfolio_df), use_container_width=True)
    else:
        st.info("目前没有活跃仓位。系统正在扫描机会中...")

elif active_menu == "📈 市场扫描":
    st.title("市场扫描")
    st.caption("当前数据库中抓取到的最高分标的")
    
    if not market_df.empty:
        st.plotly_chart(plot_market_scatter(market_df), use_container_width=True)
        st.dataframe(market_df, use_container_width=True)
    else:
        st.warning("数据库中未找到市场数据，请检查数据管线是否运行。")

elif active_menu == "📜 日志":
    st.title("系统日志")
    st.caption("查看最近的后台执行日志与报错")
    
    logs = svc.get_recent_logs(20)
    if logs:
        st.code("".join(logs), language="text")
    else:
        st.caption("暂无日志记录。")

elif active_menu == "⚙️ 配置 (开发中)":
    st.title("配置")
    st.warning("此功能正在开发中，未来将支持在此直接修改 config 阈值。")

# 自动刷新逻辑
time.sleep(1) 
st.sidebar.markdown("---")
if st.sidebar.checkbox("⏱️ 自动刷新 (30s)", value=True):
    time.sleep(30)
    st.rerun()