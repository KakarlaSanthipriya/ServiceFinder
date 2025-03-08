require('dotenv').config()
const exp = require('express');
const {Db}=require('mongodb')
const customerApp = exp.Router();
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const expressAsyncHandler=require('express-async-handler')
const tokenVerify=require('../middlewares/tokenVerify.js')

customerApp.use(exp.json());

//Get all customers (protected)
customerApp.get("/customers",  expressAsyncHandler(async (req, res)=>{

    const customerCollection = req.app.get('customerCollection')
    let customersList = await customerCollection.find().toArray()
    console.log(customersList)
    res.send({message:"customers", payload:customersList})

}));

//Get customer by username 
customerApp.get("/customers/:username", tokenVerify, expressAsyncHandler(async (req, res)=>{

    const customerCollection = req.app.get('customerCollection')
    const usernameOfUrl = req.params.username
    let customer = await customerCollection.findOne({username:{$eq:usernameOfUrl}})
    res.send({message:"customer by url", payload:customer})
}));


// Add new user
customerApp.post("/customer", expressAsyncHandler(async (req, res) => {

    const customerCollection = req.app.get('customerCollection');

    const newCustomer = req.body;

    // Check if username OR email already exists
    let existingCustomer = await customerCollection.findOne({
        $or: [
            { username: newCustomer.username },
            { email: newCustomer.email }
        ]
    });

    if (existingCustomer) {
        return res.send({ message: "Username or Email already exists" });
    } 

    // Hash the password before saving
    let hashedPassword = await bcryptjs.hash(newCustomer.password, 7);
    newCustomer.password = hashedPassword;

    // Insert new user
    await customerCollection.insertOne(newCustomer);

    res.send({ message: "User created" });
}));

//customer login
customerApp.post('/customer-login', expressAsyncHandler(async (req, res)=>{

    const customerCollection = req.app.get('customerCollection')
    const customerCred = req.body;
    let dbUser = await customerCollection.findOne({ email: customerCred.email });

    if(dbUser==null){
        res.send({message:"Invalid email"})
    }
    else{
        let result = await bcryptjs.compare(customerCred.password, dbUser.password)
        if(result===false){
            res.send({message:"Invalid password"})
        }
        else{
            let signedToken = jwt.sign({email:customerCred.email}, process.env.SECRET_KEY,{expiresIn:'15m'})
            res.send({message:"login success", token:signedToken, customer:dbUser})
        }
    }
}));

customerApp.put('/customers/:username/booking', tokenVerify, expressAsyncHandler(async (req, res) => {
    const customerCollection = req.app.get('customerCollection');
    const username = req.params.username;
    const newBookingDetails = req.body; // This should be an object, not an array
  
    let customer = await customerCollection.findOne({ username: username });
    if (!customer) {
      return res.status(404).send({ message: "User not found" });
    }
  
    if (!customer.bookingDetails) {
      customer.bookingDetails = []; // Initialize as an empty array if it doesn't exist
    }
  
    // Push the new booking details (object) into the array
    customer.bookingDetails.push(newBookingDetails);
  
    await customerCollection.updateOne(
      { username: username },
      { $set: { bookingDetails: customer.bookingDetails } }
    );
  
    res.send({ message: "Booking details added", payload: customer.bookingDetails });
  }));
//Update user profile (protected)
const { ObjectId } = require('mongodb'); // Ensure ObjectId is imported

customerApp.put("/customers-prof/:_id", tokenVerify, expressAsyncHandler(async (req, res) => {
  const customerCollection = req.app.get('customerCollection');
  const modifiedCustomer = req.body;
  const userId = req.params._id;

  // Ensure _id is not included in the update
  if (modifiedCustomer._id) {
    delete modifiedCustomer._id; // Remove _id from the update object
  }

  const result = await customerCollection.updateOne(
    { _id: new ObjectId(userId) }, // Query by _id
    { $set: modifiedCustomer } // Update the document
  );

  if (result.matchedCount === 0) {
    return res.status(404).send({ message: "User not found" });
  }

  res.send({ message: "User modified", payload: modifiedCustomer });
}));


// Update seeker's booking details by username (protected)
customerApp.put("/customers/:username/booking-update", tokenVerify, expressAsyncHandler(async (req, res) => {
  const customerCollection = req.app.get('customerCollection');
  const { bookingDetails } = req.body; // Get the updated booking details from the request body
  const username = req.params.username; // Get the username from the URL

  // Validate the input
  if (!Array.isArray(bookingDetails)) {
    return res.status(400).send({ message: "Invalid booking details format" });
  }

  // Update the seeker's booking details in the database
  const result = await customerCollection.updateOne(
    { username }, // Find the seeker by username
    { $set: { bookingDetails } } // Update the bookingDetails field
  );

  // Check if the update was successful
  if (result.matchedCount === 0) {
    return res.status(404).send({ message: "Seeker not found" });
  }

  if (result.modifiedCount === 1) {
    res.send({ message: "Seeker booking details updated successfully", payload: bookingDetails });
  } else {
    res.send({ message: "No changes made to booking details" });
  }
}));


module.exports = customerApp;


