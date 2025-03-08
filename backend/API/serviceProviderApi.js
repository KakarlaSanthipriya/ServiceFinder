require('dotenv').config()
const exp = require('express');
const {Db}=require('mongodb')
const serviceproviderApp=exp.Router();
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const expressAsyncHandler=require('express-async-handler')
const tokenVerify=require('../middlewares/tokenVerify.js')
const multer = require('multer');
const path = require('path');
const fs = require('fs');

serviceproviderApp.use(exp.json());

//Get all service providers
serviceproviderApp.get("/serviceproviders", expressAsyncHandler(async(req, res)=>{

    const serviceProviderCollection = req.app.get('serviceProviderCollection')
    let providersList = await serviceProviderCollection.find().toArray()
    res.send({message:"service providers", payload:providersList})
}));

//Get service provider by username (protected)
serviceproviderApp.get("/serviceproviders/:username", tokenVerify, expressAsyncHandler(async(req, res)=>{

    const serviceProviderCollection = req.app.get('serviceProviderCollection')
    const usernameOfUrl = req.params.username
    let provider = await serviceProviderCollection.findOne({username:{$eq:usernameOfUrl}})
    res.send({message:"service provider by url", payload: provider})
}));

// Get service providers by service name
serviceproviderApp.get("/serviceproviders-service/:serviceType", expressAsyncHandler(async (req, res) => {
    const serviceProviderCollection = req.app.get('serviceProviderCollection');
    const serviceTypeOfUrl = req.params.serviceType;
    let providerList = await serviceProviderCollection.find({ serviceType: { $eq: serviceTypeOfUrl } }).toArray();
    
    // Ensure that providerList is an array
    if (!Array.isArray(providerList)) {
      providerList = [];
    }
  
    res.send({ message: "service providers by service type", payload: providerList });
  }));

//Get service providers by category
serviceproviderApp.get("/serviceprovider/:category", expressAsyncHandler(async (req, res) => {
    try {
        const serviceProviderCollection = req.app.get('serviceProviderCollection');
        const categoryOfUrl = req.params.category; // Use `category` as the parameter

        // Case-insensitive search using a regular expression
        const serviceProviders = await serviceProviderCollection.find({ 
            serviceType: { $regex: new RegExp(`^${categoryOfUrl}$`, "i") } // Query the `serviceType` field
        }).toArray();

        console.log('Fetched providers:', serviceProviders); // Log the fetched data

        if (serviceProviders.length === 0) {
            return res.status(404).send({ message: "No service providers found for this category" });
        }

        res.send({ message: "Service providers by category", payload: serviceProviders });
    } catch (error) {
        console.error('Error fetching providers:', error);
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}));

serviceproviderApp.use('/Images/:image',exp.static(path.join(__dirname, 'public/Images')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = '';
        if (file.fieldname === 'governmentID') {
            uploadPath = '../client/public/Images/governmentID'; // Store government ID images
        } else if (file.fieldname === 'profilePicture') {
            uploadPath = '../client/public/Images/ProfilePhotos'; // Store profile photos
        } else {
            return cb(new Error('Invalid fieldname'));
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// Multer Upload Middleware (Handles Multiple Fields)
const upload = multer({ storage: storage });

// Add new user
serviceproviderApp.post("/serviceprovider", upload.fields([{ name: 'governmentID', maxCount: 1 }, { name: 'profilePicture', maxCount: 1 }]), expressAsyncHandler(async (req, res) => {
    const serviceProviderCollection = req.app.get('serviceProviderCollection');
    const newProvider = req.body;
    const files = req.files;

    // Check if username OR email already exists
    let existingProvider = await serviceProviderCollection.findOne({
        $or: [
            { username: newProvider.username },
            { email: newProvider.email }
        ]
    });

    if (existingProvider) {
        return res.status(400).send({ message: "Username or Email already exists" });
    }

    // Hash the password before saving
    let hashedPassword = await bcryptjs.hash(newProvider.password, 7);
    newProvider.password = hashedPassword;

    // Assign file paths to newProvider
    newProvider.governmentID = files['governmentID'] ? `/Images/governmentID/${files['governmentID'][0].filename}` : null;
      newProvider.profilePicture = files['profilePicture'] ? `/Images/ProfilePhotos/${files['profilePicture'][0].filename}` : null;
      console.log('New Provider:', newProvider);
    // Insert new user
    await serviceProviderCollection.insertOne(newProvider);

    res.status(201).send({ message: "User created" });
}));
//service provider login
serviceproviderApp.post('/serviceprovider-login', expressAsyncHandler(async(req, res)=>{

    const serviceProviderCollection = req.app.get('serviceProviderCollection')
    const providerCred = req.body;
    let dbUser = await serviceProviderCollection.findOne({ email: providerCred.email });

    if(dbUser==null){
        res.send({message:"Invalid email"})
    }
    else{
        let result = await bcryptjs.compare(providerCred.password, dbUser.password)
        if(result===false){
            res.send({message:"Invalid password"})
        }
        else{
            let signedToken = jwt.sign({email:providerCred.email}, process.env.SECRET_KEY,{expiresIn:'15m'})
            res.send({message:"login success", token:signedToken, provider: dbUser})
        }
    }
}));





serviceproviderApp.put('/serviceproviders/:username/booking', tokenVerify, expressAsyncHandler(async (req, res) => {
    const serviceProviderCollection = req.app.get('serviceProviderCollection');
    const username = req.params.username;
    const newBookingDetails = req.body; // This should be an object, not an array
  
    let provider = await serviceProviderCollection.findOne({ username: username });
    if (!provider) {
      return res.status(404).send({ message: "User not found" });
    }
  
    if (!provider.bookingDetails) {
      provider.bookingDetails = []; // Initialize as an empty array if it doesn't exist
    }
  
    // Push the new booking details (object) into the array
    provider.bookingDetails.push(newBookingDetails);
  
    await serviceProviderCollection.updateOne(
      { username: username },
      { $set: { bookingDetails: provider.bookingDetails } }
    );
  
    res.send({ message: "Booking details added", payload: provider.bookingDetails });
  }));

//Update user profile (protected)
serviceproviderApp.put("/serviceproviders/:username", tokenVerify, expressAsyncHandler(async(req, res)=>{

    const serviceProviderCollection = req.app.get('serviceProviderCollection')
    const modifiedProvider = req.body;

    const usernameOfUrl = req.params.username;

    const result = await serviceProviderCollection.updateOne(
        {username: usernameOfUrl},
        {$set: modifiedProvider}
    );

    res.send({message:"User modified", payload: modifiedProvider});
}));

const { ObjectId } = require('mongodb'); // Ensure ObjectId is imported

// Update provider's booking details by username (protected)
serviceproviderApp.put("/serviceproviders/:username/booking-update", tokenVerify, expressAsyncHandler(async (req, res) => {
    const serviceProviderCollection = req.app.get('serviceProviderCollection');
    const { bookingDetails } = req.body; // Get the updated booking details from the request body
    const username = req.params.username; // Get the username from the URL
  
    // Validate the input
    if (!Array.isArray(bookingDetails)) {
      return res.status(400).send({ message: "Invalid booking details format" });
    }
  
    // Update the provider's booking details in the database
    const result = await serviceProviderCollection.updateOne(
      { username }, // Find the provider by username
      { $set: { bookingDetails } } // Update the bookingDetails field
    );
  
    // Check if the update was successful
    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Provider not found" });
    }
  
    if (result.modifiedCount === 1) {
      res.send({ message: "Provider booking details updated successfully", payload: bookingDetails });
    } else {
      res.send({ message: "No changes made to booking details" });
    }
  }));




module.exports = serviceproviderApp;