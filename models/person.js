const mongoose = require("mongoose")

// Retrieve MongoDB password from environment variable
// command: export MONGODB_PASSWORD=<your password>
const password = process.env.MONGODB_PASSWORD
const url = `mongodb+srv://eetuvalkamo:${password}@clusterforosa3.m5wzjkn.mongodb.net/?retryWrites=true&w=majority&appName=ClusterForOsa3`

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
    name: String,
    number: String,
})

// MondoDB generated __id (object) to id (string)
// Remove __v (version key) and _id
personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

module.exports = mongoose.model("Person", personSchema)
