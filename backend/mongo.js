const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@fullstack-course.zfaj87q.mongodb.net/phonebook-entries?retryWrites=true&w=majority&appName=fullstack-course`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


const nameArg = process.argv[3]
const numberArg = process.argv[4]

if (nameArg && numberArg) {
  // add a new entry to the database

  const person = new Person({
    name: nameArg,
    number: numberArg,
  })

  person.save().then(__result => {
    console.log(`added ${nameArg} number ${numberArg} to phonebook`)
    mongoose.connection.close()
  })

} else {
  // output the list of entries in the database

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}






