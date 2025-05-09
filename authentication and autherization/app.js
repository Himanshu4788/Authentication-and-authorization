
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
app.use(cookieParser());

const path = require('path');

const userModel = require('./models/user')


app.set('view engine' , ' ejs')
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname , 'public')))



const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { localsName } = require('ejs');


// const salt = bcrypt(); 


// cookie ko set krne ke liye kisis bhi route mai,
// app.get('/',(req,res)=>
// {
//     res.cookie("name","himudon");
//     res.send('done');
// })

// cookie ko read krne ke liye kissi bhi route se
// app.get('/read',(req,res)=>
// {
//     console.log(req.cookies)
//     res.send("read page")
// })

//encript
//it will genrate my password = "#himubisht2005" to '$2b$10$6D0SMJEMo3RvHMjP36axbegv5G2Okqq3VXQreRCjP.fEBowJe1XOa'
//use for converting your password into hash
// app.get('/',(req,res)=>
// {
//     bcrypt.genSalt(10 , (err,salt)=>{
//         bcrypt.hash("#himubisht2005" , salt , (err,hash)=>{
//             console.log(hash);
//             res.send('hogaya')
//         });
//     });
// })


//decript
//ye compare kre daga 
//isse ye help hogi jb user apna password likhega login krte wqt toh match hojayga
// app.get('/',(req,res)=>
// {
//    bcrypt.compare('#himubisht2005' , '$2b$10$6D0SMJEMo3RvHMjP36axbegv5G2Okqq3VXQreRCjP.fEBowJe1XOa',(err,result)=>{
//         console.log(result);
//         res.send('hogaya')
 
//    })
// })



// app.get('/' , (req, res)=>{

//    let token =   jwt.sign({email : 'himu@gmai.com'}, 'secret')
//    res.cookie('token' , token);
//    res.send('done');
// //    console.log(token);
   
// })



// app.get('/read' , (req,res)=>{
//     jwt.verify(req.cookies.token , 'secret');
//     console.log(data);
    
// })



app.get('/' , (req,res)=>{
    res.render("index.ejs");
})

app.post('/create' ,  (req,res)=>{
   let{username , email,password ,age} = req.body;

   bcrypt.genSalt(10,  (err,salt)=>{
    bcrypt.hash(password,salt, async(err,hash)=>{
        let createuser =  await userModel.create({
            username,
            email,
            password:hash,
            age
        });
        let token  = jwt.sign({email}, 'shhhhhhhhh' );
        res.cookie('token' , token)
        res.send(createuser)
     })
   })

})


app.get('/login' , (req,res)=>{
    res.render('login.ejs');
})

app.post('/login' ,async (req,res)=>{
  let user=   await userModel.findOne({email:req.body.email});
  if(!user ) return res.send("something went wrong")

     bcrypt.compare( req.body.password, user.password ,(err,result)=>{
      console.log(result);
      console.log( user.password);
      console.log( req.body.password);
      
            
     }) 
  })

app.get('/logout' , (req,res)=>{
    res.cookie('token', '');
    res.redirect('/');
})

app.listen('3000',()=>{
    console.log('its running');
    
})