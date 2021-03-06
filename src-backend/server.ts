import 'reflect-metadata'
import 'express-async-errors'
import path from 'path'
import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import passport from 'passport'
import auth from './routes/auth'
import lists from './routes/lists'
import tasks from './routes/tasks'
import { connectToDatabase } from './database/connection'

connectToDatabase().then(() => {
  const app = express()
  app.use(bodyParser.json())
  app.use(session({
    secret: process.env.SESSION_SECRET || 'A4ObaaNVNCDJRkU9TL3l1x3BtHc81zUfWY8XGYqD',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('build'))

    app.get('/', (req, res) => {
      res.sendFile(path.join('build', 'index.html'))
    })
  }

  app.use(auth)
  app.use(lists)
  app.use(tasks)

  app.listen(process.env.PORT || 8001)
}).catch(error => {
  console.log(error)
  process.exit(1)
})
