const express = require('express')
const Task = require('../models/tasks')
const auth = require('../middleware/auth')
const User = require('../models/users')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// GET /tasks?completed=true
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.limit) {
        limit = parseInt(req.query.limit)
    } else {
        limit = 10
    }

    if (req.query.skip) {
        skip = parseInt(req.query.skip)
    } else {
        skip = 0
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                perDocumentLimit: limit,
                skip,
                sort
            } 
        })
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })


        if (!task) {
            return res.status(404).send('Tasks not found found.')
        }

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const _id = req.params.id

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'})
    }

    try {
        const task = await Task.findOne({ _id: _id, owner: req.user._id })
        
        if (!task) {
            return res.status(404).send('Task not found.')
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)

    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOneAndDelete({ _id: _id, owner: req.user._id })
        
        if (!task) {
            return res.status(404).send('Task not found.')
        }

        res.send(task)

    } catch (error) {
        res.status(500).send(error)
    }

})

module.exports = router