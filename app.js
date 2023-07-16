const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const port = 5500;
const app = express();

//connection
mongoose.connect("mongodb+srv://DhruvS2:Rudebhai293@cluster0.bk1ddh4.mongodb.net/Todolist_v2")
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log("Mongo Err", err));

app.set('views', './src/views')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// const day = date.getDate();

const r1 = require('./src/routes/r1');

app.use("/", r1);
app.use("/:customListName", r1);
app.use("/creatCl", r1);
app.use("/delete", r1);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});