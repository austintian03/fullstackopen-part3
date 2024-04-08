const express = require('express')
const morgan = require('morgan')

morgan.token('data', (req, res) => {
  const data = JSON.stringify(req.body)
  
  if (data !== '{}') {
    return data
  }
})

const app = express()

let phonebook = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/info', (req, res) => {
  const timestamp = `<p>${Date()}</p>`
  const info = `<p>Phonebook has info for ${phonebook.length} people</p>`

  res.send(info.concat(" ", timestamp))
})

app.get('/api/persons', (req, res) => {
  res.json(phonebook)
})

const generateId = () => {
  return Math.floor(Math.random() * 10000)
}

app.post('/api/persons', (req, res) => {
  const body = req.body
  
  if(!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number is missing, please provide both' })
  }

  if(phonebook.find(person => person.name === body.name)) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    "name": body.name,
    "number": body.number,
    "id": generateId()
  }

  phonebook = phonebook.concat(person)
  res.json(person)
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

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const deletedPerson = phonebook.find(person => person.id === id)
  phonebook = phonebook.filter(person => person.id !== id)
  
  if (deletedPerson) {
    res.json(deletedPerson)
  } else {
    response.status(204).end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})