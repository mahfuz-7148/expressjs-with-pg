import express, {type Application, type Request, type Response} from 'express'
import {config} from "./config";
import {Pool} from "pg";

const app: Application = express()
app.use(express.json())
const pool = new Pool({
  connectionString: config.connection_string
})
// console.log(pool)
const initDB = async () => {
 try {
   await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

app.post('/api/v1/users', async (req: Request, res: Response) => {
  // console.log(req.body)
  const {name, email, password, age} = req.body
  const result = await pool.query(`
   INSERT INTO users(
    name, email, password, age
    ) VALUES ($1, $2, $3, $4) RETURNING *
  `, [name, email, password, age])
  // console.log(result.rows[0])
  res.status(201).json({
    success: true,
    message: 'user created successfully',
    data: result.rows[0]
  })
})

app.get('/api/v1/users', async (req: Request, res: Response) => {
  const result = await pool.query(`
   SELECT * FROM users
  `)
  // console.log(result.rows[0])
  res.status(200).json({
    success: true,
    message: 'user retrieved successfully',
    data: result.rows
  })
})

app.get('/api/v1/users/:id', async (req: Request, res: Response) => {
  const {id} = req.params
  const result = await pool.query(`
   SELECT * FROM users WHERE id = $1
  `, [id])
  // console.log(result.rows[0])
  if (result.rowCount === 0) {
    res.status(404).json({
      success: false,
      message: "User not found!!",
    });
  }
  res.status(200).json({
    success: true,
    message: 'user retrieved successfully',
    data: result.rows[0]
  })
})

app.listen(config.port, () => {
  console.log(`server connected at port ${config.port}`)
})