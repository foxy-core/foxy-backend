'use strict'

if (import.meta.env.DEV) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config()
}

import { DateTime } from 'luxon'
import { httpServer } from '@/base'
import mainStore from '@/common/stores/main.store'
import { GENERATED_INSTANCE_ID } from '@/config/server'
import {
  registerAllRestControllers,
  registerAllEventControllers,
} from '@/listeners'
import { app } from '@/rest'
import { authenticationExpressMiddleware } from '@/utils/authentication/authenticationMiddleware'
import { callbackCollection } from '@/utils/beforeExitHook'
import { justLog } from '@/utils/justLog'
const PORT = parseInt(process.env.VITE_PORT || '3071')
const HOST = process.env.VITE_HOST || '0.0.0.0'
const SCHEMA = process.env.VITE_SCHEMA || 'http'
const API_BASE_URL = process.env.VITE_API_BASE_URL || '/api'

mainStore.insert(GENERATED_INSTANCE_ID, {
  id: GENERATED_INSTANCE_ID,
  startAt: DateTime.now(),
})

justLog.info('Registering REST endpoints...')
const apiRouter = registerAllRestControllers()
app.use(API_BASE_URL, authenticationExpressMiddleware)
app.use(API_BASE_URL, apiRouter)
justLog.info('Registering WS wrapper listener...')
registerAllEventControllers()

const listener = httpServer.listen(PORT, HOST, () => {
  justLog.success(
    `Setup succeed! Listening on ${SCHEMA}://${HOST}:${PORT}${API_BASE_URL}`,
  )
})

process.on('SIGINT', async () => {
  justLog.warn('Forced stopping. Calling exit hooks...')
  await listener.close()
  await Promise.all(callbackCollection.map(f => f()))
  process.exit()
})
