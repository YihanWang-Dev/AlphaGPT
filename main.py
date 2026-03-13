import sys
import os
import subprocess
import time
import webbrowser

def check_and_install_dependencies():
    """检查并自动安装 requirements.txt 中的依赖"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    req_file = os.path.join(base_dir, "requirements.txt")
    
    if not os.path.exists(req_file):
        return

    print("🔍 正在检查依赖项...")
    try:
        import pkg_resources
        # 读取 requirements.txt 中的依赖
        with open(req_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        # 过滤掉注释和空行，提取包名
        requirements = []
        for line in lines:
            line = line.strip()
            if line and not line.startswith('#'):
                # 移除版本号限制以获取基础包名
                pkg_name = line.split('>=')[0].split('==')[0].split('<=')[0].strip()
                requirements.append(pkg_name)

        # 获取当前已安装的包
        installed_packages = {pkg.key for pkg in pkg_resources.working_set}
        
        # 找出缺失的包
        missing_packages = []
        for req in requirements:
            req_lower = req.lower().replace('_', '-')
            if req_lower not in installed_packages:
                missing_packages.append(req)

        if missing_packages:
            print(f"📦 发现缺失的依赖: {', '.join(missing_packages)}")
            print("⏳ 正在自动为您安装，请稍候...\n")
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", req_file])
            print("\n✅ 依赖安装完成！\n")
        else:
            print("✅ 所有依赖均已就绪。\n")
            
    except Exception as e:
        print(f"⚠️ 检查依赖时出现异常，将直接尝试启动: {e}")

def build_frontend():
    """确保前端已经被编译"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(base_dir, "frontend")
    dist_dir = os.path.join(frontend_dir, "dist")
    
    if not os.path.exists(dist_dir) and os.path.exists(frontend_dir):
        print("🔨 首次运行，正在编译前端资源...")
        try:
            # npm in windows is often npm.cmd
            npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
            subprocess.check_call([npm_cmd, "--version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            subprocess.check_call([npm_cmd, "install"], cwd=frontend_dir)
            subprocess.check_call([npm_cmd, "run", "build"], cwd=frontend_dir)
            print("✅ 前端编译完成！\n")
        except Exception as e:
            print(f"⚠️ 前端编译失败，请确保系统安装了 Node.js: {e}")

def main():
    check_and_install_dependencies()
    build_frontend()
    
    print("🚀 Starting AlphaGPT FastAPI Server...")
    
    try:
        import uvicorn
        
        # Open browser after a short delay
        def open_browser():
            time.sleep(2)
            print("🌐 正在打开浏览器...")
            webbrowser.open('http://127.0.0.1:8000')
            
        import threading
        threading.Thread(target=open_browser, daemon=True).start()
        
        # Start FastAPI server
        uvicorn.run("backend.api.server:app", host="127.0.0.1", port=8000, reload=False)
        
    except ImportError:
        print("❌ 错误: 找不到 uvicorn 或 fastapi 模块，请检查环境。")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n🛑 服务器已停止运行。")
    except Exception as e:
        print(f"\n❌ 启动服务器时发生错误: {e}")

if __name__ == "__main__":
    main()
