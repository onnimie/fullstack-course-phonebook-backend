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

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(result => {
    response.json(result)

  }).catch(err => {
    next(err)
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

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findByIdAndDelete(id).then(result => {
      response.status(204).end()

    }).catch(err => {
      next(err)
    })
})

app.post('/api/persons', (request, response, next) => {
    const p = request.body
    console.log('POST:', p)

    if (!p.name || !p.number) {
        next({name: 'NoNameOrNumber', message: 'POST to /api/persons without name or number'})

    } else {

      const person = new Person({
        name: p.name,
        number: p.number,
      })

      person.save().then(result => {
          response.json(result)

      }).catch(err => {
        next(err)
      })
    }
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const p = request.body
    console.log('PUT:', p)

    Person.findByIdAndUpdate(id, p, {new: true}).then(updatedPerson => {
      response.json(updatedPerson)

    }).catch(err => {
      next(err)
    })
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'NoNameOrNumber') {
    return response.status(400).send({error: 'name or number is missing'})
  }

  next(error)
}

// tämä tulee kaikkien muiden middlewarejen ja routejen rekisteröinnin jälkeen!
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})