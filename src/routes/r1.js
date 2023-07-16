const express = require('express');
const r1 = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");
const axios = require('axios');

let today = new Date();
let options = {
    weekday: "long",
};
let day = today.toLocaleDateString("en-US", options);

//Schemas
const itemsSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, "Why is there no item name?"]
    }
});

const listItemsSchema = new mongoose.Schema({
    name : {
        type: String,
        unique: true,
        required: [true, "There should be a list name."]
    },
    items: [itemsSchema]
});

//Models
const Item = mongoose.model("Item", itemsSchema);
const ListItem = mongoose.model("ListItem", listItemsSchema)

//default items
const item1 = new Item({
    name: "Welcome to your todolist!"
});
const item2 = new Item({
    name: "Hit the + button to add a new item."
});
const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

r1.get("/", (req, res)=>{
    Item.find()
    .then((items)=>{
        if(items.length === 0){
            Item.insertMany(defaultItems)
            .then(()=>console.log("Saved successfully"))
            .catch((err)=>console.log("Mongo Err", err));
            res.redirect("/");
        }
        else{
            res.render('list', {listTitle: day, newListItems: items});
        }
    })
    .catch((err)=>console.log("Mongo Err", err));
    
});

r1.get("/:customListName", (req, res)=>{
    const rawListName = req.params.customListName;
    const customListName = _.toUpper((rawListName).slice(0, 1))+ _.toLower((rawListName).slice(1));

    ListItem.findOne({name: customListName})
    .then((foundList)=>{
        if (foundList === null){
            const list = new ListItem({
                name: customListName,
                items: defaultItems
            }); list.save();
            res.redirect("/"+ customListName);
        }
        else{
            res.render('list', {listTitle: foundList.name, newListItems: foundList.items});
        }
    })
    .catch((err)=>console.log("Mongo Err", err));
})

r1.post("/", (req, res)=>{
    const newItem = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name: newItem
    }); 
    if (listName === day){
        item.save();
        res.redirect("/");
    } else {
        ListItem.findOne({name: listName})
        .then((list)=>{
            list.items.push(item);
            list.save();
            res.redirect("/" + listName);
        });
    }
});

r1.post("/createCl", (req, res)=>{
    const customListName = req.body.customListName;
    res.redirect("/"+ customListName);
})

r1.post("/delete", (req, res)=>{
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === day){
        Item.findByIdAndRemove(checkedItemId)
        .then(()=>{
            console.log("Item deleted successfully");
            res.redirect("/");
        })
        .catch((err)=>console.log("Mongo Err", err));
    }else{
        ListItem.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}})
        .then(()=>{
            res.redirect("/"+ listName);
        })
        .catch((err)=>console.log("Mongo Err", err));
    }
});

module.exports = r1;