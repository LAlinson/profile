#!/usr/bin/env python3
"""
Servidor local para o Gerenciador de Currículos.
Serve arquivos estáticos e salva edições no users.json.

Uso: python3 server.py
Acesse: http://localhost:8080
"""

import http.server
import json
import os
import sys
from urllib.parse import urlparse

PORT = int(os.environ.get('PORT', 8080))
ROOT = os.path.dirname(os.path.abspath(__file__))

MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js':   'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.ico':  'image/x-icon',
}

class Handler(http.server.BaseHTTPRequestHandler):

    def log_message(self, format, *args):
        # Custom log format
        print(f"[{self.log_date_time_string()}] {format % args}")

    def send_json(self, code, data):
        body = json.dumps(data).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == '/api/save-users':
            try:
                length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(length)
                data = json.loads(body)

                file_path = os.path.join(ROOT, 'data', 'users.json')
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)

                print(f"  ✅ users.json salvo com {len(data.get('users', []))} usuário(s)")
                self.send_json(200, {'ok': True})
            except Exception as e:
                print(f"  ❌ Erro ao salvar: {e}")
                self.send_json(500, {'ok': False, 'error': str(e)})
        else:
            self.send_json(404, {'ok': False, 'error': 'Not found'})

    def do_GET(self):
        parsed = urlparse(self.path)
        url_path = parsed.path

        if url_path == '/':
            url_path = '/users.html'

        file_path = os.path.join(ROOT, url_path.lstrip('/'))

        if not os.path.isfile(file_path):
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not found')
            return

        ext = os.path.splitext(file_path)[1]
        mime = MIME_TYPES.get(ext, 'application/octet-stream')

        with open(file_path, 'rb') as f:
            content = f.read()

        self.send_response(200)
        self.send_header('Content-Type', mime)
        self.send_header('Content-Length', str(len(content)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(content)


if __name__ == '__main__':
    os.chdir(ROOT)
    server = http.server.HTTPServer(('', PORT), Handler)
    print(f"\n🚀 Servidor rodando em http://localhost:{PORT}")
    print(f"📋 Lista de usuários: http://localhost:{PORT}/users.html")
    print(f"✏️  Admin:            http://localhost:{PORT}/admin.html")
    print(f"\nPressione Ctrl+C para parar.\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n⛔ Servidor encerrado.")
        sys.exit(0)
