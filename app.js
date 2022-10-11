const express = require('express')
const app = express()
const port = 4444 
const mongoose = require('mongoose')
const {MONOURL} = require('./secret.js')
require('./models/user')
require('./models/post')

mongoose.connect(MONOURL)

// for true case
mongoose.connection.on("connected", 
   ()=>{console.log("Connected to MongoDB")}
)

// for false case
mongoose.connection.on("error", 
    (err)=>{console.log("Error connecting to MongoDB", err)}
)
app.use(express.json())
app.use(require("./routes/auth"))
app.use(require("./routes/post"))




app.get('/',
  (req, res)=>{res.send("Home Page")}
)

app.listen(port, ()=>{console.log(`server is running at port ${port}`)})
