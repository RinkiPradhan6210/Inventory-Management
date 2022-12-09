const express = require('express');
const bodyParser = require('body-parser');
//const route = require('./routes/route.js');
const mongoose = require('mongoose');
const app = express();



app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));   
//app.use('/', route);



mongoose.connect('mongodb+srv://RinkiPradhan:moShtmwBC2cEopn2@cluster0.xs93j.mongodb.net/InvetoryManagementDataBase', {
  useNewUrlParser: true
})
.then(function(){
  console.log("Mongodb is connected successfully.");
})
.catch(function(err){
  console.log(err)
})


app.listen(process.env.PORT || 3000, function(){return console.log(`Express is running on port ${process.env.PORT || 3000}`)});







//dotenv
 //multer^ :req.files => UD, multer + key^ : req.files => UD; multer+key+filesNotSelected : req.files=> [];