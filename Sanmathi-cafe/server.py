import asyncio
import websockets
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading

# Store connected clients
connected_clients = set()

async def handle_websocket(websocket):
    # Register client
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            # Broadcast message to all connected clients except sender
            for client in connected_clients:
                if client != websocket:
                    await client.send(message)
    finally:
        # Unregister client
        connected_clients.remove(websocket)

async def websocket_server():
    async with websockets.serve(handle_websocket, "0.0.0.0", 8001):
        await asyncio.Future()  # run forever

def run_http_server():
    # Run the HTTP server on port 8000
    httpd = HTTPServer(('0.0.0.0', 8000), SimpleHTTPRequestHandler)
    print("Serving HTTP on port 8000...")
    httpd.serve_forever()

def main():
    # Start HTTP server in a separate thread
    http_thread = threading.Thread(target=run_http_server)
    http_thread.daemon = True
    http_thread.start()

    # Start WebSocket server
    print("Starting WebSocket server on port 8001...")
    asyncio.run(websocket_server())

if __name__ == "__main__":
    main() 