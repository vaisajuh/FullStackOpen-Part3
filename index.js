require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))


app.get('/api/persons', (req, res) => {
  Person.find({}).then(person => {
    res.json(person)
  })
})

app.get('/info', (req, res, next) => {
  Person.find({}).then(person => {
    res.send(`Phonebook has info for ${person.length} people <br/> ${Date()}`)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findOne({ id:req.params.id })
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, res, next) => {
  Person.deleteOne({ id:request.params.id })
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, res, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const person = new Person ({
    id: body.id,
    name: body.name,
    number: body.number,
  })
  console.log(person)
  person.save().then(savedPerson => {

    res.json(savedPerson)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, res, next) => {

  Person.findOneAndUpdate({ name:request.body.name }, { $set: { number:request.body.number } }, { runValidators: true })
    .then(result => {
      res.json(result)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
