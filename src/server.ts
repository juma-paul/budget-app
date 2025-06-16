import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { signUp, logIn } from './handlers/user.js'

const app = express()

// middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// route to homepage
app.get('/', (req, res) => {
    res.json({message: 'Hello, Express!'})
})

// global error handling
app.use((err, req, res, next) => {
    if (err.type === 'input') {
        return res.status(400).json({error: 'Invalid input. Please check your details.'})
    } else if (err.type === 'auth') {
        return res.status(401).json({error: 'Authentication failed.'})
    } else {
        return res.status(500).json({error: 'Something went wrong, try again later.'})
    }
})

export default app