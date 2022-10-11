
 const express = require('express')
 const router = express.Router()
 const mongoose = require('mongoose')
 const User = mongoose.model("User")
 const bycrypt = require('bcrypt')
 const jwt = require('jsonwebtoken');
 const {JWT_SECRET} = require('../secret')
//  const requireLogin = require('../middleware/requireLogin')



// let req = {
//     body:{},
//     headers:{},
//     params:{},
// }

// let res = {

// }


 router.post('/signup', (req, res)=>{
       const {name, email, password} = req.body 
       // check if all values are not empty 
          if(!name || !email || !password){
                  return res.status(400).json({error: "Please add all the fields"})
          }
          // check if password is strong or not
         // check if user already exists
         User.findOne({email:email})
            .then(
                (savedUser)=>{
                    if(savedUser != null){
                        return res.status(400).json({error: "User already exists with that email"})
                    }
                    // if user does not exist, create a new user
                    bycrypt.hash(password,12)
                    .then(
                        (hashedPaswword) => {
                            const user = new User({
                                name,
                                email,
                                password : hashedPaswword
                            })
                            user.save()
                            .then(
                                user=>{
                                    res.json({message: "saved successfully"})
                                }
                            )
                            .catch(
                                err=>{
                                    console.log(err)
                                }
                            )
        
                        }
                    )
                    
                }
            )
            .catch(
                err=>{
                    console.log(err)
                }
            )
 })

 router.post('/login', (req, res)=>{
    //    console.log(req.body)
         const {email, password} = req.body
            if(!email || !password){
                return res.status(400).json({error: "Please add email or password"})
            }
            User.findOne({email:email})
            .then((savedUser)=>{
                 if(!savedUser){
                        return res.status(400).json({error: "Invalid email or password"})
                 }
                //  console.log(savedUser)
                bycrypt.compare(password, savedUser.password)
                .then(
                    (doMatch)=>{
                        if(doMatch== true){
                             const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                            res.json({message: "Successfully signed in", token: token})
                        }
                        else{
                            return res.status(400).json({error: "Invalid email or password"})
                        }
                    }
                )
            })
 })

//  router.get('/topsecret',requireLogin, (req, res)=>{
//         // console.log(req.headers)
//         // console.log(req.user)
//         res.send("Lets talk on call")
//  })

 module.exports = router