const http = require('http');
const { gotScraping } = require('got-scraping');

const PORT = 3000;
const TARGET_HOST = 'agentrouter.org';

const server = http.createServer((clientReq, clientRes) => {
  console.log(
    `\n🚀 Spoofing ${clientReq.method} to: https://${TARGET_HOST}${clientReq.url}`,
  );

  // gotScraping handles the exact TLS cipher impersonation automatically
  const options = {
    url: `https://${TARGET_HOST}${clientReq.url}`,
    method: clientReq.method,
    headers: {
      authorization: clientReq.headers['authorization'],
      'content-type': clientReq.headers['content-type'],
      'user-agent': 'Claude-Code',
      'anthropic-version': '2023-06-01',
      'x-stainless-os': 'windows',
      'x-stainless-arch': 'x64',
    },
    // Don't crash on 4xx/5xx errors, pass them to OpenClaw so we can see them
    throwHttpErrors: false,
  };

  // Create the stream tunnel
  const proxyReq = gotScraping.stream(options);

  proxyReq.on('response', (response) => {
    console.log(
      `📥 AgentRouter Firewall Bypassed | Status: ${response.statusCode}`,
    );
    clientRes.writeHead(response.statusCode, response.headers);
  });

  proxyReq.on('error', (err) => {
    console.error(`❌ Stream Error:`, err.message);
    if (!clientRes.headersSent) {
      clientRes.writeHead(500);
    }
    clientRes.end('Proxy Tunnel Error');
  });

  // Pipe OpenClaw -> Proxy -> AgentRouter -> Proxy -> OpenClaw
  clientReq.pipe(proxyReq).pipe(clientRes);
});

server.listen(PORT, () => {
  console.log(
    `🛡️ Advanced TLS Spoof Interceptor running on http://localhost:${PORT}`,
  );
});
