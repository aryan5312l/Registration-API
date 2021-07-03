import Joi from "joi";

import CustomErrorHandler from "../services/CustomErrorHandler";
import {User} from '../models/index';
import bcrypt from 'bcrypt'; 
import JwtService from '../services/JwtService';

const login = {
    async login(req, res, next) {
          //validation
          const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
          });

          const {error} = loginSchema.validate(req.body);

          if(error){
              return next(error)
          }

          try{
            const user = await User.findOne({email: req.body.email})
            if(!user){
                return next(CustomErrorHandler.wrongCredentials());
            }

            //compare the password
            console.log(user, req.body.password)
            const match = await bcrypt.compare(req.body.password, user.password)

            if(!match){
                return next(CustomErrorHandler.wrongCredentials());
            }

            //token
            const access_token = JwtService.sign({_id: user._id, role: user.role})

            res.json({access_token})

          }catch(err){
            return next(err);
          }

    }
}

export default login;