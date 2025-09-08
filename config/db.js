const mongoose=require('mongoose');

const connection=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('mongoDB Connected');
    }catch(err){
        process.exit(1);
    }
};

module.exports = connection;