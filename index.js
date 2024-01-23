const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(express.static('dist'))
app.use(requestLogger)
app.use(express.json())
app.use(morgan('tiny'))

let persons = require('./persons.json')
const mainPage = '<h1>This is main of my Backend</h1><h2>Routes</h2><ol><li>/info</li><li>/api/persons</li><li>/api/persons/:id</li></ol>'

// get main page
app.get('/', (req, res) => {
  res.send(mainPage)
})
// get info page
app.get('/info', (req, res) => {
  const length = persons.length
  const date = new Date()
  const infoPage = `<p>Phonebook has info for ${length} </br> ${date} </p>`
  res.send(infoPage)
})
// get all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})
// get person from persons of id
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})
// delete person from persons of id
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})
// post a person in persons
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0
  return maxId + 1
}
app.post('/api/persons', (req, res) => {
  const body = req.body
  console.log(body)
  const nameExists = persons.some(e => e.name === body.name)
  if (nameExists) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }
  if (!body.name) {
    return res.status(400).json({
      error: 'name of person missing'
    })
  }
  if (!body.number) {
    return res.status(400).json({
      error: 'number of person missing'
    })
  }
  const uId = generateId()
  const person = {
    name: body.name,
    number: body.number,
    id: uId.toString()
  }
  persons = persons.concat(person)
  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
