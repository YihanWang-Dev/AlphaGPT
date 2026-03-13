import os
from typing import Any, Dict, List

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from backend.services.dashboard_service import DashboardService

app = FastAPI(title="AlphaGPT API", description="FastAPI Backend for AlphaGPT Dashboard")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

svc = DashboardService()


@app.get("/api/balance")
def get_balance() -> Dict[str, Any]:
  return {"balance": svc.get_wallet_balance(), "address": svc.wallet_addr}


@app.get("/api/portfolio")
def get_portfolio() -> List[Dict[str, Any]]:
  df = svc.load_portfolio()
  if df.empty:
    return []
  df = df.where(pd.notnull(df), None)
  return df.to_dict(orient="records")


@app.get("/api/strategy")
def get_strategy() -> Dict[str, Any]:
  return svc.load_strategy_info()


@app.get("/api/market")
def get_market() -> List[Dict[str, Any]]:
  df = svc.get_market_overview()
  if df.empty:
    return []
  df = df.where(pd.notnull(df), None)
  return df.to_dict(orient="records")


@app.get("/api/logs")
def get_logs(limit: int = 50) -> Dict[str, List[str]]:
  return {"logs": svc.get_recent_logs(limit)}


@app.get("/api/kline/{address}")
def get_kline(address: str, limit: int = 1000) -> List[Dict[str, Any]]:
  df = svc.get_token_kline(address, limit)
  if df.empty:
    return []

  df = df.where(pd.notnull(df), None)
  result: List[Dict[str, Any]] = []
  for _, row in df.iterrows():
    time_val = row["time"]
    if pd.notnull(time_val):
      if isinstance(time_val, pd.Timestamp):
        time_val = int(time_val.timestamp())
      else:
        try:
          time_val = int(pd.to_datetime(time_val).timestamp())
        except Exception:
          time_val = str(time_val)

    result.append(
      {
        "time": time_val,
        "open": float(row["open"]) if row["open"] is not None else 0,
        "high": float(row["high"]) if row["high"] is not None else 0,
        "low": float(row["low"]) if row["low"] is not None else 0,
        "close": float(row["close"]) if row["close"] is not None else 0,
        "value": float(row["volume"]) if row["volume"] is not None else 0,
      }
    )
  return result


@app.post("/api/stop")
def stop_bot() -> Dict[str, str]:
  try:
    with open("STOP_SIGNAL", "w") as f:
      f.write("STOP")
    return {"status": "success", "message": "STOP signal sent"}
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))


project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
frontend_dist = os.path.join(project_root, "frontend", "dist")

if os.path.exists(frontend_dist):
  app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")
else:

  @app.get("/")
  def root() -> JSONResponse:
    return JSONResponse(
      content={"message": "AlphaGPT API is running. Frontend dist folder not found."}
    )

