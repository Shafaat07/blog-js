require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})
const PORT = 5000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
})

app.use('/articles', articleRouter)

mongoose.connection.once('open',()=>{
  console.log('Successfully connected to mongDB')
  app.listen(PORT,()=> {console.log(`Server running on port ${PORT}`)})
})