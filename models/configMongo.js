// const express =  require('express');
// const mongoose = require('mongoose');
// // import { Express } from 'express';
// // import { Mongoose } from 'mongoose';

// const url = "mongodb://localhost:27017";
// const port = 8080;
// const app = express();
// mongoose.connect(url, {}).then(result => console.log("database connected"))
//         .catch(err => console.log(err));

// app.get('/', (req, res)=>{
//         res.send("<h1>Da ma tu esti</h1>"); //proba de get method
// });

// app.listen(port, ()=>{
//         console.log("Server is listening to port: " + port);
// });





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



