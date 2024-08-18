// Import------
const express = require('express');

const cors =require("cors");

require('dotenv').config();


const app = express();
app.use(express.json());

//Mongodb connection file

const mongoose=require('mongoose');


const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected...')
    } catch (error) {
        console.error(error.message);
    process.exit(1);
    }
}
connectDB();

//Middleware
app.use(cors())
app.use(express.json());



// Schema

const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    city: {
      type: String,
      required: true
    }
  });
  
const mongo = mongoose.model('User', UserSchema);





// Add new user
app.post('/users', async (req, res) => {
  try {
      const { name, age, city } = req.body;
      const newUser = new mongo({ name, age, city });
      const savedUser = await newUser.save();
      res.status(200).send({ message: 'User saved successfully', data: savedUser });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error', error });
  }
});
// Get all users
app.get('/users', async (req, res) => {
  try {
      const users = await mongo.find().sort({ "_id": 1 });
      res.status(200).send({ data: users, message: "Success" });
  } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Server Error', error });
  }
});

// Delete user by ID
  app.delete('/delete/:id', async (req, res) => {
    try {
        let { id } = req.params;
        const deletedUser = await mongo.findByIdAndDelete(id);
        res.status(200).send({ message: 'User deleted successfully', data: deletedUser });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server Error', error });
    }
});

// app.put('/update/:id', async (req, res) => {


//     try {
//         const updatedUser = await mongo.findByIdAndUpdate(
//         req.params.id,
//         req.body
//       );
//       res.status(200).send({ message: 'User updated successfully', response: updatedUser });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({ message: 'Server Error', error });
//     }
//   });

//update 
app.patch('/users/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { name, age, city } = req.body;
      const updatedUser = await mongo.findByIdAndUpdate(id, { name, age, city }, { new: true });
      res.status(200).send({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error', error });
  }
});


//----for listen
const PORT = process.env.PORT||5000;
app.listen(PORT,(err)=>{console.log(`server is running${PORT}`)});