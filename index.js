import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

import {MongoClient} from "mongodb";
import mongodb from "mongodb";
//const { MongoClient } = require ("mongodb");

//init app & middleware
const app = express();
const port = 4000;
const dbUrl = "mongodb://localhost:27017/todoDB";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// db connection and if success init API
let db;

connectToDb((error) => {
    if (!error) {
        // connecting to port
        app.listen(port, () => {
            console.log(`API listening on port ${port}`)
        });
        db = getDb();
    }
});



// API routes

app.get("/toDoList", (req, res) => {
    let tasksList = [];

    db.collection("tasks")
    .find()
    .forEach(task => tasksList.push(task))
    .then(() => {
        res.status(200).json(tasksList)
    })
    .catch(() => {
        res.status(500).json({error: "Could not fetch the document"})
    })
    
    //This will return a cursor so we need to add toArray or forEach. .find() returns batches of 20 by defaults.

    //res.json(toDoList);
});

app.post("/post", (req, res) => {

    // create a new document with the new task
    const newTask = {
        task: req.body.newTask
    };

    //console.log(newTask);

    // insert the new document into the data base and getting all back to render it
    db.collection("tasks")
    .insertOne(newTask)
    .then(() => {
        const dbResponse = axios.get("http://localhost:4000/toDoList");
        res.status(200).json(dbResponse);
    })
    .catch(() => {
        res.status(500).json({error: "Could not fetch the document"});
    })
});

app.delete("/delete/:id", (req, res) => {
    // need to create a mongodb Id object first
    const id = new mongodb.ObjectId(req.params.id);
    //console.log(typeof id);

    // delete from de database by id. If successfull sendStatus 200 (OK) if error send back message.
    db.collection("tasks")
    .deleteOne({_id: id})
    .then(() => {
        res.sendStatus(200)
    })
    .catch(() => {
        res.status(500).json({error: "Couldn't delete the task"});
    })
});

// FUNCTIONS

let dbConnection;

function connectToDb (cb) {
    MongoClient.connect(dbUrl)
    .then((client) => {
        dbConnection = client.db();
        return cb()
    })
    .catch((error) => {
        console.log(error);
        return cb(error)
    })
};

function getDb ()  {
    return dbConnection
};

// temporal  "database"

// let idCount = 3;

// let toDoList = [
//     {
//         id: 1,
//         task: "Limpiar ordenador."
//     },
//     {
//         id: 2,
//         task: "Estudiar programación."
//     },
//     {
//         id: 3,
//         task: "Ir al gimnasio."
//     }
// ];