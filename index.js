import express from "express"

const app = express()
const port = 3000

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).send("OK")
})


app.get("/time", (req, res) => {
  const currentTime = new Date().toISOString()
  res.json({ time: currentTime })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
