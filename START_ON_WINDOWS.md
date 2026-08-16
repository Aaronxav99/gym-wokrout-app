# Training Ledger — Local Windows Start Guide

The tracker consists of a React interface and a FastAPI companion service. The browser interface keeps a local fallback record, while the companion service adds SQLite persistence and local-network access for a phone on the same Wi-Fi network.

| Component | Folder | Local address | Role |
|---|---|---|---|
| Frontend | `workout-tracker` | `http://localhost:3000` | Training Ledger user interface |
| Backend | `workout-tracker-backend` | `http://localhost:8000/docs` | FastAPI, SQLite, API documentation |

## First start

Open one PowerShell window in the backend folder and run the script below. It creates a virtual environment when needed, installs the required Python packages, creates the SQLite file on first startup, and listens on every local network interface.

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\start-local.ps1
```

Open a second PowerShell window in the frontend folder and run:

```powershell
pnpm install
pnpm dev -- --host 0.0.0.0
```

Then open `http://localhost:3000` in a browser. The interface will use the companion API at `http://localhost:8000` when available; otherwise it remains usable with browser-local storage.

## Phone access on the same Wi-Fi

Find the IPv4 address of the Windows PC with `ipconfig`. For example, if it is `192.168.1.25`, open `http://192.168.1.25:3000` on the phone. Windows may ask for permission to allow the Python and Node processes through the private-network firewall; allow **Private networks** only. The backend is intentionally bound to the local LAN to support personal devices, not public internet access.

Because a phone cannot resolve `localhost` as the PC, build the frontend with a local API URL before hosting it on the phone-accessible interface:

```powershell
$env:VITE_WORKOUT_API_URL = "http://192.168.1.25:8000/api/v1"
pnpm dev -- --host 0.0.0.0
```

## Data location and safety

The SQLite database is stored in `workout-tracker-backend/data/workout_tracker.db`. Copy that file while the backend is stopped to make a backup. The frontend’s fallback record is stored in the browser’s local storage; use the FastAPI companion service for a durable local database record.

> Do not expose ports 3000 or 8000 to the public internet. This MVP is designed for a single personal user on a trusted local network.
