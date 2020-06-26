const mongoose = require("mongoose");
async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/todo-tdd", {
      useNewUrlParser: true,
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = { connect };

/*const mongoose = require("mongoose");

async function connect(){
   try{
    await mongoose.connect("mongodb://localhost:27017/todo-tdd",
    { useNewUrlParser:true}
    );
   }
   catch(err){
       console.log(err);
       console.log("Error Connecting to the database")
   }
}

module.exports = {connect};*/
