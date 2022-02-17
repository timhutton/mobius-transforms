# We need this to debug web workers locally on Firefox that is picky about MIME types for .js files

import http.server
import socketserver

PORT = 8080

class HttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        '': 'application/octet-stream',
        '.manifest': 'text/cache-manifest',
        '.html':     'text/html',
        '.png':      'image/png',
        '.jpg':      'image/jpg',
        '.svg':      'image/svg+xml',
        '.css':      'text/css',
        '.js':       'application/x-javascript',
        '.wasm':     'application/wasm',
        '.json':     'application/json',
        '.xml':      'application/xml',
    }
    def send_response_only(self, code, message=None):
        super().send_response_only(code, message)
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Expires', '0')

httpd = socketserver.TCPServer(("localhost", PORT), HttpRequestHandler)

try:
    print(f"Serving at http://localhost:{PORT}")
    httpd.serve_forever()
except KeyboardInterrupt:
    pass