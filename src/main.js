import express from "express"
import dotenv from "dotenv"
import sequelize from './models/database.js'
import { setupAssociations } from './models/Associations.js';
import routes from "./routes/index.js"
import cors from "cors"

dotenv.config({ path: '.env' })
const app = express()
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

setupAssociations()

sequelize.authenticate()
  .then(() => console.log("Postgresql Connected"))
  .catch(err => console.log('Error connecting to PostgreSQL:', err))

sequelize.sync({ alter: true })
  .then(() => console.log("Tables synchronized"))
  .catch(err => console.log("Error synchronizing tables:", err))

app.use('/api', routes)

const PORT = process.env.PORT || 80;
app.listen(PORT, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log(`Server started on port ${PORT}`);
})