const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))

let persons = [
    {
      id: 1,
      name: "Jees-mies",
      number: 111222333
    },
    {
      id: 2,
      name: "Joo-nainen",
      number: 333222111
    },
    {
      id: 3,
      name: "Emt",
      number: 123123123
    }
  ]

  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people <br/> ${Date()}`)

  })

  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, res) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
  })

  app.post('/api/persons', (request, res) => {
    const body = request.body
    const temp = persons.filter(person => person.name === body.name)
  
    if (!body.name || !body.number) {
      return res.status(400).json({ 
        error: 'content missing'
      })
    }

    if (temp.length > 0) {
        return res.status(403).json({
            error: 'name already exists'
        })
    }

    const person = {
        id: Math.floor(Math.random () * 1000000000),
        name: body.name,
        number: body.number,
    }
  
    persons = persons.concat(person)
  
    res.json(person)
  })
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })