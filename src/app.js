const express = require('express')
const path = require('path')
const cors = require('cors')
require('../src/db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

const publicDirectoryPath = './public' 

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.get('', (req, res) => {
    res.render('index')
})

module.exports = app
