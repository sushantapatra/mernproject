require('dotenv').config()
const express =require("express")
const path=require('path')
const hbs=require("hbs")
const Register=require("./models/register")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const dotenv = require('dotenv')
require('./db/conn')


const app =express()
const port =process.env.PORT ||3000

const static_path=path.join(__dirname, "../public")
const template_path=path.join(__dirname, "../templates/views")
const partials_path=path.join(__dirname, "../templates/partials")

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(static_path))
app.set("view engine", "hbs")
app.set("views", template_path);
hbs.registerPartials(partials_path)

//password hashing
// const securePassword= async (password)=>{
//     const passwordHash= await bcrypt.hash(password, 10);
//     console.log(passwordHash);

//     const passwordMatch= await bcrypt.compare(password, passwordHash);
//     console.log(passwordMatch);
// }
//$2a$10$lrMQK9HPpDcmE2CJ8kcQuuYd/xRmeSaNb3dWNWaUpTR8gPwRrvjC6
//securePassword('12345')

app.get('/', (req, res)=>{
    res.render("index")
})
app.get('/login', (req, res)=>{
    res.render("login")
})
app.post('/login',async(req, res)=>{
    try{
        const password=req.body.password
        const email=req.body.email
        const result=await Register.findOne({email:email})
        const isMatch=await bcrypt.compare(password, result.password)
        //token generate and save in model schema file
        const token= await result.generateAuthToken()
        if(isMatch){
            res.status(200).render("index");
        }else{
            res.status(500).send('Invalid Login Details')
        }
    }catch(error){
        res.status(400).send(error)
    }
})

app.get('/register',async(req, res)=>{
    res.render("register")
})
//create a new user
app.post('/register',async(req, res)=>{
    try{
        const password=req.body.password
        const cpassword=req.body.confirmpassword
        if(password == cpassword){
            const registerEmployee=new Register({
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                gender:req.body.gender,
                phone:req.body.phone,
                age:req.body.age,
                password:password,
                confirmpassword:cpassword
            })
            //token generate and save in model schema file
            const token= await registerEmployee.generateAuthToken()

            const registerData=await registerEmployee.save()
            console.log("Registration Successfull");
            res.status(201).render("index")
        }else{
            req.send('Password Not matched !')
        }
    }catch(error){
        res.status(400).send(error)
    }
})

const createToken= async()=>{
    const token=await jwt.sign({_id:"60a8b329cbed9a239ccb68bc"},"jfkjdoijffoire8enakduenkjfnvknjndeau", { expiresIn: '1h' })
    //console.log(token)
    const userVerify=await jwt.verify(token, "jfkjdoijffoire8enakduenkjfnvknjndeau")
    //console.log(userVerify);
}

createToken()




app.listen(port, ()=>{
    console.log(`Your application run in http://localhost:${port}`);
})