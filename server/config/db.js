const mongoose = require('mongoose');

const connectDB = async () => {
 try {
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
   // These options are no longer needed/supported in modern Mongoose versions
   // useNewUrlParser: true,
   // useUnifiedTopology: true, 
      
      // If you are using Mongoose 6+, you may also need to remove:
      // useCreateIndex: true,
      // useFindAndModify: false
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
 } catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
 }
};

module.exports = connectDB;