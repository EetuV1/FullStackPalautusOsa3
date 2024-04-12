const mongoose = require("mongoose")

// Retrieve MongoDB url from environment variable
// command: export MONGODB_URL=<your url with password>
const url = process.env.MONGODB_URL

mongoose.set("strictQuery", false)

console.log("connecting to", url)
mongoose
    .connect(url)
    .then((result) => {
        console.log("Connected to MongoDB")
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB:", error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true,
    },
    number: {
        type: String,
        minlength: 8,
        required: true,
        validate: {
            validator: function (v) {
                return /^(\d{2,3}-\d+)$/.test(v)
            },
            message: (props) =>
                `${props.value} is not a valid phone number! Use the format: 123-4567890`,
        },
    },
})

// MondoDB generated _id (object) to id (string)
// Remove __v (version key) and _id
personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

module.exports = mongoose.model("Person", personSchema)
