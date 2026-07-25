import http.server
import os
import socketserver

port = int(os.environ.get("PORT", 8000))
os.chdir(os.path.dirname(os.path.abspath(__file__)))
handler = http.server.SimpleHTTPRequestHandler

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

with ReusableTCPServer(("", port), handler) as httpd:
    httpd.serve_forever()
