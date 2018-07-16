require('dotenv').config();
const mongoose = require('mongoose');

var MONGODB_URI = 'mongodb://'+process.env.USER_DB+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;

var bookSchema = mongoose.Schema({      
    title: {type: String, required: true, unique: false},
    description: {type: String, required: true, unique: false},
    username: {type: String, required: true, unique: false},    
  });

var userSchema = mongoose.Schema({      
    username: {type: String, required: true, unique: true},
    fullname: {type: String, required: true, unique: false},
    city: {type: String, required: true, unique: false},    
    state: {type: String, required: false, unique: false},    
    address: {type: String, required: false, unique: false},    
});
  
const Book = mongoose.model('Book',bookSchema);  
const User = mongoose.model('User',userSchema);  

function connect(){
    return new Promise((resolve,reject) => {
      try{
        mongoose.connect(MONGODB_URI);
      }catch(e){
        reject(new DataStoreUnknowException("connect",null,e))
      }
    })
  }

  function addBook(req,res){        
    return new Promise((resolve,reject) => {
      try{                 
        let book = new Book(
                        {
                            title: req.title,
                            description: req.description,
                            username: req.username                             
                        })
    
        book.save((error, result) => {
            if (error) reject (new DataStoreUnknowException("insert",req.title,error))
            resolve(result);
        })
      }catch(e){
        reject(new DataStoreUnknowException("insert",req.title,e));
      }
    })
  }

  function deleteBook(bookId){
    return new Promise((resolve,reject) => {
      try{        
        Book.deleteOne({_id: bookId})
            .exec((error,result) => {            
               if (error) reject(error);
               resolve({'log' : `Company ${bookId} deleted`});
            }
        )
      }catch(e){
        reject(new DataStoreUnknowException("delete",bookId,e));
      }
    })
  }

  // Check if the company code exists on the DB
  function companyExists(companyCode){
    return new Promise((resolve, reject)=>{
      try{      

        Company.find({code: companyCode})
            .exec((error,result) => {            
               if (error) reject(error);
               resolve(result.length > 0 ? true : false);
        })
      }catch(e){
        reject(new DataStoreFieldValidationException("company",companyCode,e));
      }
    })
  }

  function getBooks(){
      return new Promise((resolve,reject) => {
        try{
            Book.find({})
            .exec((error,result) => {
                if (error) reject(error);
                resolve(result);
            })
        }catch(e){
            reject(new DataStoreUnknowException ("GET",args,e));
        }        
      })
  }

  function getUsers(){
    return new Promise((resolve,reject) => {
      try{
          User.find({})
          .exec((error,result) => {
              if (error) reject(error);
              resolve(result);
          })
      }catch(e){
          reject(new DataStoreUnknowException ("GET",args,e));
      }        
    })
}
  

  // Exception objects

  function DataStoreUnknowException (method,args,error) {
    this.type = this.constructor.name;
    this.description = 'Error happening during operation: ' + method;
    this.method = method;
    this.args = args;
    this.error = error;
  }
  function DataStoreFieldValidationException(field, error) {
    this.type = this.constructor.name;
    this.description = 'Error during proccesing field: ' + field;  
    this.error = error;
  }


  module.exports = {
    connect,
    addBook,    
    getBooks,    
    getUsers,
    deleteBook
  }