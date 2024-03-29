const express = require('express')
const app = express()

app.use(express.json())

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
    res.status(400).send({ error: 'name or number is missing, please provide both' })
  }

  if(phonebook.find(person => person.name === body.name)) {
    res.status(400).send({ error: 'name must be unique' })
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
  phonebook = phonebook.filter(person => person.id !== id)
  
  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})