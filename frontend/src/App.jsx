import { useState, useEffect } from 'react'
import axios from 'axios'
import phonebookService from './services/phonebookService'

const Entry = (props) => {
  //console.log(props)
  return (
    <li>
      {props.name} {props.number}
      <button onClick={() => props.deleteEntry(props.name, props.id)}>delete</button>
    </li>
  )
}

const Filter = (props) => {
  const handleFilterwordInputChange = props.onChange
  const filterword = props.filterword
  return (
    <div>
      filter shown with <input onChange={handleFilterwordInputChange} value={filterword} />
    </div>
  )
}

const EntryForm = (props) => {
  const addEntry = props.addEntry
  const handleNameInputChange = props.onNameChange
  const handleNumberInputChange = props.onNumberChange
  const newName = props.nameValue
  const newNumber = props.numberValue
  return (
    <form onSubmit={addEntry}>
      <div>
        name: <input onChange={handleNameInputChange}
        value={newName} />
      </div>
      <div>
        number: <input onChange={handleNumberInputChange}
        value={newNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Message = ({msg}) => {
  if (!msg) {
    return <></>
  } else {
    return (
      <div className="message">
        {msg}
      </div>
    )
  }
}

const Error = ({msg}) => {
  if (!msg) {
    return <></>
  } else {
    return (
      <div className="error">
        {msg}
      </div>
    )
  }
}


const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterword, setNewFilterword] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const sendMessage = text => {
    setMessage(`${text}`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const sendError = text => {
    setError(`${text}`)
    setTimeout(() => {
      setError(null)
    }, 5000)
  }

  useEffect(() => {
    console.log("effect")
    phonebookService.getPhonebookAll().then(personsRes => {
      console.log('promise fulfilled')
      setPersons(personsRes)
    })
  }, [])

  const handleNameInputChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  
  const handleNumberInputChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterwordInputChange = (event) => {
    console.log(event.target.value)
    setNewFilterword(event.target.value)
  }

  const addEntry = (event) => {
    event.preventDefault()
    if (persons.map(p => p.name).includes(newName)) {
      //alert(`${newName} is already added to the phonebook!`)
      if (window.confirm(`${newName} is already added to the phonebook. Replace the old number with the new one?`)) {
        const p = persons.find(p => p.name === newName)
        phonebookService
          .updatePhonebookEntry({...p, number: newNumber})
          .then(updatedEntry => {
            console.log(`Updated entry for ${newName}!`)
            sendMessage(`Updated entry for ${newName}!`)
            setNewName('')
            setNewNumber('')
            setPersons(persons.map(person => person.id !== p.id ? person : updatedEntry))
          })
          .catch(err => {
            sendError(`Information of ${newName} has already been removed from the server.`)
          })
      }
    } else {
      phonebookService.addPhonebookEntry(newName, newNumber).then(newPerson => {
        sendMessage(`Added entry for ${newName}!`)
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewNumber('')
      })
    }
  }

  const deleteEntry = (name, id) => {
    if (window.confirm(`Delete ${name}?`)) {
      phonebookService.deletePhonebookEntry(id).then(res => {
        console.log(`Deleted person ${name}!`)
        sendMessage(`Deleted entry for ${newName}!`)
        setPersons(persons.filter(p => p.id !== id))
      })
    }
  }

  const filteredPersons = persons.filter(p => p.name.toLowerCase().includes(filterword.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Error msg={error} />
      <Message msg={message} />

      <Filter onChange={handleFilterwordInputChange} filterword={filterword} />

      <h3>Add a new entry:</h3>

      <EntryForm addEntry={addEntry}
        onNameChange={handleNameInputChange}
        onNumberChange={handleNumberInputChange}
        nameValue={newName}
        numberValue={newNumber} />

      <h2>Numbers</h2>
      
      <ul>
        {filteredPersons.map(p => 
          <Entry key={p.name} name={p.name} number={p.number} id={p.id} deleteEntry={deleteEntry} />
        )}
      </ul>
    </div>
  )

}

export default App