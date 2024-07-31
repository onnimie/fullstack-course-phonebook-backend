require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
    if (tokens.method(req, res) === 'POST') {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            JSON.stringify(req.body)
          ].join(' ')
    } else {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
          ].join(' ')
    }
    
  }))

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

/* USELESS NOW THAT WE SERVE index.html from dist when GETting /
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
*/

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
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
    //console.log(id)
    /*const p = persons.find(per => per.id === id)
    //console.log(persons)
    //console.log(p)
    if (!p) {
        response.status(404).end()
    } else {
        persons = persons.filter(per => per.id !== id)
        response.status(204).end()
    }*/

    Person.findByIdAndDelete(id).then(result => {
      response.status(204).end()

    }).catch(err => {
      console.log(err)
    })
})

app.post('/api/persons', (request, response) => {
    const p = request.body
    console.log(p)

    if (!p.name || !p.number) {
        response.status(400).json({
            error: 'name or number is missing'
        })
    } else {

        /*const already_in_list = persons.find(per => per.name === p.name)

        if (already_in_list) {

            response.status(400).json({
                error: 'name must be unique'
            })

        } else {

            const gen_id = Math.floor(Math.random()*100000)
            const new_p = {...p, id: gen_id.toString()}
            persons = persons.concat(new_p)
            response.json(new_p)
        }*/
      const person = new Person({
        name: p.name,
        number: p.number,
      })

      person.save().then(result => {
          response.json(result)
      })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})