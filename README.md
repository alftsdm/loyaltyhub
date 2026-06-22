# Loyalty Hub Product Map

Interactive Loyalty Hub product map with server-side query-password protection.

## Run locally

```bash
HOST=127.0.0.1 PORT=8787 LOYALTY_HUB_PASSWORD='Loyaltyhub888' python3 server.py
```

Open:

```text
http://127.0.0.1:8787
```

## Deploy

This repository includes `render.yaml` for Render.

Required environment variables:

- `LOYALTY_HUB_PASSWORD`: query password
- `LOYALTY_HUB_SECRET`: random cookie signing secret

Start command:

```bash
HOST=0.0.0.0 python3 server.py
```

Health check:

```text
/healthz
```
