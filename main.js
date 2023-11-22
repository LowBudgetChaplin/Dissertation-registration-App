import express from 'express';
import mongoose from 'mongoose';
import {router as indexRouter} from './routes/IndexRoutes.js';
// import { Express } from 'express';
// import { Mongoose } from 'mongoose';

const url = "mongodb://localhost:27017";
const port = 8080;
const app = express();
app.use(express.json());
//mongoose.connect(url, {}).then(result => console.log("database connected"))
//        .catch(err => console.log(err));

// app.get('/', (req, res)=>{
//         res.send("<h1>Da ma tu esti</h1>"); //proba de get method
// });

app.use("/", indexRouter);


mongoose.connect("mongodb+srv://admin:adminul@dbweb.8gdavaz.mongodb.net/Disertatie-API?retryWrites=true&w=majority")
        .then(() => {
                console.log("connected to database")
                app.listen(port, ()=>{
                        console.log("Server is listening to port: " + port);
                });
        }).catch((erorr) => {
                console.log(erorr);
        });




// const { MongoClient } = require('mongodb');

// async function main(){
//         const uri = "mongodb+srv://serbancorodescu14:<password>@cluster0.djinlqa.mongodb.net/?retryWrites=true&w=majority";

//         const client = new MongoClient(uri);

//         try{   
//                 await client.connect();

//                 await listDataBases(client);
//         }catch(err){
//                 console.error(err);
//         }finally{
//                 await client.close();
//         }
// }

// main().catch(console.error);

// async function listDataBases(client){
//       const dataBasesList = await client.db().admin().listDataBases();

//       console.log("Databases: ");
//       dataBasesList.databases.forEach(db =>{
//         console.log(`- ${db.name}`);
//       })
// }



