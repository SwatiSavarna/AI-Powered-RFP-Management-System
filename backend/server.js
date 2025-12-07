require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const rfpRoutes = require('./routes/rfpRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const emailWorker = require('./workers/emailWorker');
const dashboardRouter = require('./routes/dashboardRouter');
 const proposalRouter = require('./routes/proposalRoutes');
const app = express();

app.use(cors());

app.use(bodyParser.json({ limit: '10mb', strict: false }))

app.use('/api/rfps', rfpRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/dashboard', dashboardRouter);
 app.use('/api/proposals', proposalRouter);

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI, )
  .then(()=> {
    console.log('Mongo connected');
    app.listen(PORT, ()=> {
      console.log('Server listening on', PORT);
    });
 
    emailWorker.start();
  })
  .catch(err => console.error('Mongo connect error', err));
