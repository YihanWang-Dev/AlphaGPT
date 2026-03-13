@echo off
@REM echo [1/3] 检查并更新 Conda 环境...
@REM call conda env update -f environment.yml --prune

@REM echo [2/3] 激活虚拟环境...
@REM call conda activate dev

echo [3/3] 启动项目 Dashboard...
python -m streamlit run dashboard/app.py
pause