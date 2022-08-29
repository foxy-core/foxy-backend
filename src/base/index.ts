import http from 'http'
import http2 from 'http2'
import expressApp from './expressApp'
import { patchServerWithIO } from './patchSocket'
import { readFileSync } from 'fs'
import { SERVER_CERT_PATH, SERVER_KEY_PATH } from '@/config/server'

//const httpServer = http.createServer(expressApp)

const httpServer = http2.createSecureServer(
  {
    allowHTTP1: true,
    key: readFileSync(SERVER_KEY_PATH),
    cert: readFileSync(SERVER_CERT_PATH),
  },
  expressApp,
)

const ioServer = patchServerWithIO(httpServer as unknown as http.Server)

export { ioServer, httpServer }
