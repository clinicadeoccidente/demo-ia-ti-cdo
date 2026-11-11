#!/usr/bin/env python3
"""Servidor local de demostración. Sin servicios externos. Python 3 + qrcode (opcional)."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse
from http import cookies
import json, os, secrets, threading, socket, io
ROOT=Path(__file__).resolve().parent
PORT=int(os.environ.get('PORT','8765'))
COUNTS=[0,0,0]
TOKENS=set()
LOCK=threading.Lock()
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
    def send_json(self,status,obj,headers=None):
        data=json.dumps(obj).encode();self.send_response(status);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(data)))
        for k,v in (headers or {}).items():self.send_header(k,v)
        self.end_headers();self.wfile.write(data)
    def do_GET(self):
        path=urlparse(self.path).path
        if path=='/api/results':
            with LOCK: counts=COUNTS[:]
            return self.send_json(200,{'counts':counts,'total':sum(counts)})
        if path=='/qr.png':
            try:
                import qrcode
                host=self.headers.get('Host','localhost:'+str(PORT)).split(':')[0]
                # QR debe utilizar la dirección IP de red del servidor, no localhost
                if host in ('localhost','127.0.0.1'):
                    try:
                        sock=socket.socket(socket.AF_INET,socket.SOCK_DGRAM);sock.connect(('192.0.2.1',80));host=sock.getsockname()[0];sock.close()
                    except OSError:pass
                img=qrcode.make(f'http://{host}:{PORT}/votar.html');b=io.BytesIO();img.save(b,format='PNG');data=b.getvalue()
                self.send_response(200);self.send_header('Content-Type','image/png');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
            except ImportError:self.send_error(503,'Instala qrcode para mostrar QR: pip install qrcode[pil]')
            return
        return super().do_GET()
    def do_POST(self):
        if urlparse(self.path).path!='/api/vote':return self.send_json(404,{'error':'No encontrado'})
        try:
            if int(self.headers.get('Content-Length','0'))>1024:raise ValueError()
            data=json.loads(self.rfile.read(int(self.headers.get('Content-Length','0'))))
            option=data['option']
            if type(option)!=int or option not in (0,1,2):raise ValueError()
        except (ValueError,KeyError,TypeError):return self.send_json(400,{'error':'Opción no válida'})
        c=cookies.SimpleCookie()
        try:c.load(self.headers.get('Cookie',''))
        except cookies.CookieError:pass
        token=c['voto'].value if 'voto' in c else secrets.token_urlsafe(24)
        with LOCK:
            if token in TOKENS:return self.send_json(409,{'error':'Ya votaste desde este navegador'})
            TOKENS.add(token);COUNTS[option]+=1
        return self.send_json(200,{'ok':True},{'Set-Cookie':f'voto={token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400'})
if __name__=='__main__':
    print(f'Presentación: http://localhost:{PORT}/seminario.html')
    try:
        s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM);s.connect(('192.0.2.1',80));ip=s.getsockname()[0];s.close()
        print(f'Celulares (misma Wi-Fi): http://{ip}:{PORT}/votar.html')
    except OSError:pass
    print('Los votos se almacenan en memoria y se reinician al detener el servidor.')
    ThreadingHTTPServer(('0.0.0.0',PORT),Handler).serve_forever()
