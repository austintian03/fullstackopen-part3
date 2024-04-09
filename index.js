require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('data', (req, res) => {
  const data = JSON.stringify(req.body)
  
  if (data !== '{}') {
    return data
  }
})

const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/info', (req, res) => {
  const timestamp = `<p>${Date()}</p>`
  const info = `<p>Phonebook has info for ${phonebook.length} people</p>`

  res.send(info.concat(" ", timestamp))
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  
  if(!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number is missing, please provide both' })
  }

  /*
  if(phonebook.find(person => person.name === body.name)) {
    return res.status(400).json({ error: 'name must be unique' })
  }
  */

  const person = new Person({
    "name": body.name,
    "number": body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = phonebook.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).send({ error: 'That person is not in the phonebook.'})
  }
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Malformed ID' })
  } 

  next(error)
}

// handler of requests with result to errors
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})