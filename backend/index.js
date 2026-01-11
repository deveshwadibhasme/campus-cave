import express from 'express'


const app = express()
dotenv.config()

app.use(express.urlencoded())

app.listen(8001, () => {
    console.log('Campus Cave Server');
})
