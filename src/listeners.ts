import { Router } from 'express'
import { ioServer } from '@/base'
import { subscription } from '@/base/brokerService'
import { createControllerRegistrar } from '@/common/createControllerRegistrators'
import { prisma } from '@/db'
import { registerAuthenticateController } from '@/services/authentication/authentication.controller'
import { registerCardsController } from '@/services/cards/cards.controller'
import { registerFilesController } from '@/services/files/files.controller'
import { registerLikesController } from '@/services/likes/likes.controller'
import { registerMetricsController } from '@/services/metrics/metrics.controller'
import { registerProfileController } from '@/services/profile/profile.controller'
import { registerSchemaController } from '@/services/schema/schema.controller'
import { registerSparkController } from '@/services/spark/spark.controller'
import { justLog } from '@/utils/justLog'

justLog.info('Creating registration handles...')

const router = Router()

export const {
  registerAllEventControllers,
  registerAllRestControllers,
  registerAllBrokerControllers,
} = createControllerRegistrar(
  [
    registerAuthenticateController,
    registerCardsController,
    registerProfileController,
    registerSparkController,
    registerLikesController,
    registerFilesController,
    registerSchemaController,
    registerMetricsController,
  ],
  {
    prisma: prisma,
    ws: { io: ioServer },
    rest: { router },
    broker: { subscription },
  },
)
