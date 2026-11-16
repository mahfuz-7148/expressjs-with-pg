import express, {type Application, type Request, type Response} from 'express'
import {config} from "./config";
import {Pool} from "pg";

const app: Application = express()
const pool = new Pool({
  connectionString: config.connection_string
})
// console.log(pool)
const initDB = async () => {
 try {
   await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     age INT,
     isActive BOOLEAN DEFAULT TRUE,
     createdAt TIMESTAMP DEFAULT NOW(),
     updatedAt TIMESTAMP DEFAULT NOW()
    )
 `)
   console.log('database connected')
 } catch (err) {
   console.error(err)
   
 }
}
initDB()

app.get('/', (req: Request, res: Response) => {
  // res.send('this is root route')
  res.json({
    message: 'this is root route with json'
  })
})

app.listen(config.port, () => {
  console.log(`server connected at port ${config.port}`)
})