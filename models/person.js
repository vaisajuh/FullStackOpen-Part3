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

function validator (val) {
  const temp = /^(\d{2}|\d{3})[-]\d{7,}$/
  if (val.match(temp)) {
    return true
  }
  return false
}

const personSchema = new mongoose.Schema({
  id: Number,
  name: { type: String, minlength:3 },
  number: { type: String, validate: validator }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject.id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
