import Joi from 'joi';
import { REFRESH_SECRET } from '../config/expoter';
import { RefreshToken } from '../models';
import CustomErrorHandler from '../services/CustomErrorHandler';
import JwtService from '../services/JwtService';
import { User } from '../models';

const refreshController = {
    async refresh(req, res, next) {
         //validation
         const refreshSchema = Joi.object({
           refresh_token : Joi.string().required(),
           
          });

          const {error} = refreshSchema.validate(req.body);

          if (error) {
            return next(error);
        }

          //database
          let refreshtoken;
          try{
            refreshtoken = await RefreshToken.findOne({token: req.body.refresh_token})
            if(!refreshtoken){
                return next(CustomErrorHandler.unAuthorized('Invalid Refresh Token'))
            }

            let userId;
            try{
                const {_id} = await JwtService.verify(refreshtoken.token, REFRESH_SECRET)
                userId = _id
                console.log(userId)
            }catch(err){

                return next(CustomErrorHandler.unAuthorized('qqq'))
            }

            const user = await User.findOne({_id: userId});
            if(!user){
                return next(CustomErrorHandler.unAuthorized('No User Found'))
            }

             //token
             const access_token = JwtService.sign({_id: user._id, role: user.role})
             const refresh_token = JwtService.sign({_id: user._id, role: user.role}, '1y', REFRESH_SECRET)
 
             //database whitelist
             await RefreshToken.create({token: refresh_token})
             res.json({access_token, refresh_token})

        }catch(err){
              return next(err)
          }
    }
}

export default refreshController;