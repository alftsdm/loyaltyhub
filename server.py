#!/usr/bin/env python3
import hashlib
import hmac
import http.server
import os
import secrets
import time
from http import cookies
from pathlib import Path
from urllib.parse import parse_qs


ROOT = Path(__file__).resolve().parent
PASSWORD = os.environ.get("LOYALTY_HUB_PASSWORD", "Loyaltyhub888")
SECRET = os.environ.get("LOYALTY_HUB_SECRET", secrets.token_hex(32))
COOKIE_NAME = "loyalty_hub_auth"
SESSION_TTL = 60 * 60 * 12


def sign(value):
  return hmac.new(SECRET.encode("utf-8"), value.encode("utf-8"), hashlib.sha256).hexdigest()


def make_token():
  issued = str(int(time.time()))
  return f"{issued}.{sign(issued)}"


def valid_token(token):
  try:
    issued, signature = token.split(".", 1)
    issued_at = int(issued)
  except (ValueError, AttributeError):
    return False
  if time.time() - issued_at > SESSION_TTL:
    return False
  return hmac.compare_digest(signature, sign(issued))


LOGIN_PAGE = """<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Loyalty Hub Product Map</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #071c2a;
        --panel: #0a2333;
        --red: #fa4a3d;
        --muted: #97999d;
        --line: rgba(222, 224, 227, 0.22);
      }
      * { box-sizing: border-box; }
      body {
        min-height: 100vh;
        margin: 0;
        display: grid;
        place-items: center;
        background:
          radial-gradient(circle at 20% 8%, rgba(250, 74, 61, 0.16), transparent 30%),
          var(--bg);
        color: #fff;
        font-family: Poppins, "Noto Sans SC", "Avenir Next", sans-serif;
      }
      main {
        width: min(440px, calc(100vw - 32px));
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        padding: 28px;
        box-shadow: 0 28px 70px rgba(0, 0, 0, 0.32);
      }
      .mark {
        position: relative;
        display: grid;
        place-items: center;
        width: 48px;
        height: 48px;
        margin-bottom: 20px;
        background: #fff;
        color: var(--panel);
        font-weight: 900;
      }
      .mark::after {
        content: "";
        position: absolute;
        top: 7px;
        right: 7px;
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: var(--red);
      }
      h1 {
        margin: 0 0 8px;
        color: var(--red);
        font-size: 32px;
        line-height: 1.05;
      }
      p {
        margin: 0 0 20px;
        color: var(--muted);
      }
      label {
        display: grid;
        gap: 8px;
        color: var(--muted);
        font-size: 13px;
        font-weight: 800;
      }
      input {
        width: 100%;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.06);
        color: #fff;
        padding: 12px;
        font: inherit;
        outline: none;
      }
      input:focus {
        border-color: var(--red);
        box-shadow: 0 0 0 3px rgba(250, 74, 61, 0.18);
      }
      button {
        width: 100%;
        margin-top: 14px;
        border: 0;
        border-radius: 8px;
        background: var(--red);
        color: #fff;
        padding: 12px;
        font: inherit;
        font-weight: 900;
        cursor: pointer;
      }
      .error {
        margin-top: 12px;
        color: #ffb2ac;
        font-size: 13px;
      }
    </style>
  </head>
  <body>
    <main>
      <div class="mark">LH</div>
      <h1>Loyalty Hub Product Map</h1>
      <p>请输入查询密码访问产品地图。</p>
      <form method="post" action="/login">
        <label>
          查询密码
          <input type="password" name="password" autocomplete="current-password" autofocus />
        </label>
        <button type="submit">进入</button>
        {error}
      </form>
    </main>
  </body>
</html>
"""


class AuthenticatedStaticHandler(http.server.SimpleHTTPRequestHandler):
  def __init__(self, *args, **kwargs):
    super().__init__(*args, directory=str(ROOT), **kwargs)

  def authenticated(self):
    raw = self.headers.get("Cookie", "")
    jar = cookies.SimpleCookie(raw)
    morsel = jar.get(COOKIE_NAME)
    return bool(morsel and valid_token(morsel.value))

  def send_login(self, bad=False):
    error = '<div class="error">密码不正确，请重试。</div>' if bad else ""
    content = LOGIN_PAGE.replace("{error}", error).encode("utf-8")
    self.send_response(200)
    self.send_header("Content-Type", "text/html; charset=utf-8")
    self.send_header("Content-Length", str(len(content)))
    self.send_header("Cache-Control", "no-store")
    self.end_headers()
    self.wfile.write(content)

  def do_GET(self):
    if self.path == "/healthz":
      self.send_response(200)
      self.end_headers()
      self.wfile.write(b"ok")
      return
    if not self.authenticated():
      self.send_login()
      return
    super().do_GET()

  def do_HEAD(self):
    if not self.authenticated():
      self.send_response(401)
      self.end_headers()
      return
    super().do_HEAD()

  def do_POST(self):
    if self.path != "/login":
      self.send_error(404)
      return
    length = int(self.headers.get("Content-Length", "0"))
    body = self.rfile.read(length).decode("utf-8")
    password = parse_qs(body).get("password", [""])[0]
    if not hmac.compare_digest(password, PASSWORD):
      self.send_login(bad=True)
      return
    token = make_token()
    self.send_response(303)
    self.send_header("Location", "/index.html")
    self.send_header("Set-Cookie", f"{COOKIE_NAME}={token}; HttpOnly; SameSite=Lax; Path=/; Max-Age={SESSION_TTL}")
    self.send_header("Cache-Control", "no-store")
    self.end_headers()


if __name__ == "__main__":
  port = int(os.environ.get("PORT", "8787"))
  host = os.environ.get("HOST", "127.0.0.1")
  server = http.server.ThreadingHTTPServer((host, port), AuthenticatedStaticHandler)
  print(f"Loyalty Hub Product Map serving on http://{host}:{port}")
  server.serve_forever()
