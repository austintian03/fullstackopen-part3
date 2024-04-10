const mongoose = require('mongoose')

const args = process.argv
if (args.length < 3) {
  console.log('give password as argument')
  process.exit(1)
} else if (args.length === 4) {
  console.log('give the phone number as argument')
  process.exit(1)
}

const password = args[2]

const url =
  `mongodb+srv://adt339:${password}@cluster0.e1j0ymg.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (args.length < 5) {
  Person
    .find({})
    .then(persons => {
      console.log('phonebook:')
      persons.forEach(p => {
        console.log(p.name, p.number)
      })
      mongoose.connection.close()
    })
} else {
  const person = new Person({
    name: args[3],
    number: args[4]
  })

  person
    .save()
    .then(result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      mongoose.connection.close()
    })
}
