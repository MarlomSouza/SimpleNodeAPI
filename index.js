import cors from "cors"
import express from "express"
import { fileURLToPath } from "node:url"

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.static(fileURLToPath(new URL("./public", import.meta.url))))

// Middleware to log every API call
app.use((req, res, next) => {
  const now = new Date().toISOString()
  console.log(`[${now}] ${req.method} ${req.originalUrl}`)
  next()
})
app.use(express.json())

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).send("Commit feito")
})

// Time endpoint
app.get("/time", (req, res) => {
  const currentTime = new Date().toISOString()
  res.json({ time: currentTime })
})

// Envs endpoint
app.get("/envs", (req, res) => {
  res.json(process.env)
})

// Envs endpoint
app.get("/failed", (req, res) => {
  res.status(500).json({
    error: "Intentional failure",
    envs: process.env
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
