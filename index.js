const express = require('express')
const app = express()

app.use(express.json())

let persons = [
      {
        "name": "Arto Hellas",
        "number": "02020202",
        "id": "1"
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
      }
]


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
    //console.log(response)
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    //console.log(id)
    const p = persons.find(per => per.id === id)
    if (!p) {
        response.status(404).end()
    } else {
        response.json(p)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const p = persons.find(per => per.id === id)
    if (!p) {
        response.status(404).end()
    } else {
        persons = persons.filter(per => per.id !== id)
        response.status(204).end()
    }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})