import Joi from 'joi';
import CustomErrorHandler from '../services/CustomErrorHandler';
import {RefreshToken, User} from '../models/index';
import bcrypt from 'bcrypt';
import JwtService from '../services/JwtService';
import {REFRESH_SECRET} from '../config/expoter'

const register = {
    async register(req, res, next){
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            confirm_password: Joi.ref('password')
        })

        const {error} = registerSchema.validate(req.body);
        if(error){
            return next(error)
        }


        //check if user is in the database already 
        try{
            const exist = await User.exists({email: req.body.email});
            if(exist){
                return next(CustomErrorHandler.alreadyExist('This email is already taken'))
            }
        }  catch(err){
            return next(err);
        } 

        const {name, email, password} = req.body
        //hash-password
        const hashedPassword =  await bcrypt.hash(password, 10);

        //Prepare the model
        
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        })

        let access_token;
        try{
            const result = await user.save();
            console.log(result)

            //token
            access_token = JwtService.sign({_id: result._id, role: result.role})

            refresh_token = JwtService.sign({_id: result._id, role: result.role}, '1y', REFRESH_SECRET)

            //database whitelist
            await RefreshToken.create({token: refresh_token})

        }catch(err){
            return next(err)
        }

        res.json({access_token, refresh_token})
        res.json({msg: 'Hello from Express'})
    }
}

export default register;