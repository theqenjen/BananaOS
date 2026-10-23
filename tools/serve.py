#!/usr/bin/env python3
"""Builds BananaOS, boots it in headless QEMU, and streams the kernel's
serial output to the browser (port 3000) so the preview can 'see it working'."""
import http.server
import os
import socketserver
import subprocess
import threading
import time

APP_DIR     = "/app"
SERIAL_LOG  = "/tmp/serial.log"
BUILD_LOG   = "/tmp/build.log"
PORT        = 3000

INDEX_FILE = os.path.join(APP_DIR, "web", "index.html")


def run(cmd, cwd=APP_DIR):
    return subprocess.run(cmd, cwd=cwd, shell=True, executable="/bin/bash",
                          capture_output=True, text=True)


def build():
    print("[serve] building BananaOS ISO...", flush=True)
    r = run("make -C kernel clean && make -C kernel")
    if r.returncode != 0:
        print("[serve] BUILD FAILED", flush=True)
        with open(BUILD_LOG, "w") as f:
            f.write(r.stdout + "\n" + r.stderr)
        return False
    return True


def start_qemu():
    if os.path.exists(SERIAL_LOG):
        os.remove(SERIAL_LOG)
    print("[serve] starting QEMU...", flush=True)
    subprocess.Popen(
        ["qemu-system-i386", "-cdrom", f"{APP_DIR}/kernel/bananaos.iso",
         "-m", "64M", "-serial", f"file:{SERIAL_LOG}", "-display", "none"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    # give QEMU a moment to write the first bytes
    time.sleep(1)


class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/stream":
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "keep-alive")
            self.end_headers()
            log = SERIAL_LOG if os.path.exists(SERIAL_LOG) else BUILD_LOG
            offset = 0
            while True:
                try:
                    with open(log, "r") as f:
                        f.seek(offset)
                        data = f.read()
                        if data:
                            for line in data.splitlines():
                                self.wfile.write(f"data: {line}\n\n".encode())
                            self.wfile.flush()
                            offset += len(data.encode())
                except FileNotFoundError:
                    pass
                time.sleep(0.3)
        else:
            try:
                with open(INDEX_FILE, "r") as f:
                    html = f.read()
            except FileNotFoundError:
                html = "<h1>BananaOS</h1><p>web/index.html not found</p>"
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            self.wfile.write(html.encode())

    def log_message(self, *a):
        pass


def main():
    ok = build()
    if ok:
        start_qemu()
    with socketserver.ThreadingTCPServer(("0.0.0.0", PORT), Handler) as httpd:
        print(f"[serve] listening on :{PORT}", flush=True)
        httpd.serve_forever()


if __name__ == "__main__":
    main()
