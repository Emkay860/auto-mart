/**
 * Routes every car API endpoint here
 */

import express from 'express';
import { cars } from '../controllers';
import { authorization, carsValidator } from '../middlewares';

const carsRouter = express.Router();


// Protected route
carsRouter.post('/',
  authorization.verifyToken,
  carsValidator.createAd,
  cars.createAd);

carsRouter.patch(
  '/:car_id/status',
  authorization.verifyToken,
  carsValidator.markAsSold,
  cars.markAsSold,
);

carsRouter.patch(
  '/:car_id/price',
  authorization.verifyToken,
  carsValidator.markAsSold,
  carsValidator.updateCarPrice,
  cars.updateCarPice,
);

carsRouter.get(
  '/:car_id/',
  carsValidator.getAvailableCar,
  cars.getAvailableCar,
);


export default carsRouter;
