const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const router = express.Router()
const port = 5000

// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/js', express.static(__dirname + 'public/js'))

// Templating Engine
app.set('views', './src/views')
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))

// Routes
// const newsRouter = require('./src/routes/news')

// app.use('/', newsRouter)
// app.use('/article', newsRouter)

router.get("/", (req, res)=>{
    res.render("index", {title: "My Website", abstract: "My wife is a demon queen"})
})

// Listen on port 5000
app.listen(process.env.PORT || port, () => console.log(`Listening on port ${port}`))