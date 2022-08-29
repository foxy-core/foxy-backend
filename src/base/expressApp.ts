import cors from 'cors'
import express from 'express'
import http2Express from 'http2-express-bridge'

const expressApp = http2Express(express)

expressApp.use(
  cors({
    origin: '*',
  }),
)

expressApp.use(express.json())

export default expressApp
