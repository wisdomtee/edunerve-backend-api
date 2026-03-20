import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"

import authRouter from "./routes/auth"
import studentsRouter from "./routes/students"
import teachersRouter from "./routes/teachers"
import classesRouter from "./routes/classes"
import schoolsRouter from "./routes/schools"
import attendanceRouter from "./routes/attendance"
import dashboardRouter from "./routes/dashboard"
import resultsRouter from "./routes/results"
import reportRouter from "./routes/report"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ✅ Allow both local + production frontend
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL // <-- add this in Render env
]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
)

app.use(express.json())

// ✅ Static uploads (works locally + production)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

app.get("/", (_req, res) => {
  res.send("EduCore API is running 🚀")
})

// ✅ Routes
app.use("/auth", authRouter)
app.use("/students", studentsRouter)
app.use("/teachers", teachersRouter)
app.use("/classes", classesRouter)
app.use("/schools", schoolsRouter)
app.use("/attendance", attendanceRouter)
app.use("/dashboard", dashboardRouter)
app.use("/results", resultsRouter)
app.use("/report", reportRouter)

// ✅ Use Render port
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})