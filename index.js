const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()

const Person = require("./models/person")

app.use(express.static("dist"))
app.use(express.json())
app.use(cors())

app.use(
    morgan((tokens, request, response) => {
        return [
            tokens.method(request, response),
            tokens.url(request, response),
            tokens.status(request, response),
            tokens.res(request, response, "content-length"),
            "-",
            tokens["response-time"](request, response),
            "ms",
            JSON.stringify(request.body),
        ].join(" ")
    })
)

app.get("/", (request, response) => {
    response.send("To get all persons, go to /api/persons")
})

app.get("/info", (request, response) => {
    Person.find({}).then((person) => {
        response.send(
            `<p>Phonebook has info for ${person.length} people</p>
            <p>${new Date()}</p>`
        )
    })
})

app.get("/api/persons", (request, response) => {
    Person.find({}).then((person) => {
        response.json(person)
    })
})

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then((person) => {
        response.json(person)
    })
})

app.delete("/api/persons/:id", (request, response) => {
    Person.findByIdAndRemove(request.params.id)

    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name or number is missing",
        })
    }

    // Should check if the person name exists in the database

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then((person) => {
        response.json(person)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
