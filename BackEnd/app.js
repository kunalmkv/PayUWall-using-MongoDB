const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



// get config vars
dotenv.config();



var cors = require('cors');

const newUserRoutes = require('./routes/newUser');
const existingUserRoutes = require('./routes/existingUser');
const expenseRoutes = require('./routes/expense');
const passwordRoutes = require('./routes/password');
const purchaseRoutes = require('./routes/purchase');
const premiumRoute = require('./routes/premium');


const PORT = process.env.port || 3000;




const app = express();

app.use(cors());
app.use(bodyParser.json());



app.use('/premium', premiumRoute);
app.use('/newUser', newUserRoutes);
app.use('/existingUser', existingUserRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/password', passwordRoutes);
app.use('/user', expenseRoutes);



mongoose.connect(process.env.MONGODB_URI)
    .then(result => {
        app.listen(PORT);
        console.log("APP STARTED")
    })
    .catch(err => {
        console.log(err)
    })

