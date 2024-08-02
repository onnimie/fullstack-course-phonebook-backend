const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI


console.log('connecting to', url)
mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      required: [true, 'entry name is required!'],
    },
    number: {
      type: String,
      minlength: 8,
      validate: {
        validator: function(v) {
          let hasPhoneNumber = /(\d{2}-\d{5})|(\d{3}-\d{4})/.test(v)
          let hasExtraLetters = /([^0-9]+[0-9]*-)|(-[0-9]*[^0-9]+)/.test(v)
          return hasPhoneNumber && !(hasExtraLetters);
        },
        message: props => `${props.value} is not a valid phone number!`
      },
      required: [true, 'entry number is required!'],
    },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)