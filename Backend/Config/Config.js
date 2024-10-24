const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://atticaeye:atticaeye123@cluster0.byw8d.mongodb.net/Attica?retryWrites=true&w=majority&appName=Cluster0');


// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/atticaadminpanel', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.log('Failed to connect to MongoDB', err));
