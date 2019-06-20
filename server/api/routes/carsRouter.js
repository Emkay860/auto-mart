/**
 * Routes every car API endpoint here
 */
import express from 'express';
import { Cars } from '../controllers';
import { Authorization, CarsValidator } from '../middlewares';
import Flags from '../controllers/Flags';

const carsRouter = express.Router();

// Users can create ad
carsRouter.post('/',
  Authorization.verifyToken,
  CarsValidator.createAd,
  Cars.createAd);

// Users can mark their adverts as sold
carsRouter.patch(
  '/:car_id/status',
  Authorization.verifyToken,
  CarsValidator.markAsSold,
  Cars.markAsSold,
);

// Users can update price of their adverts
carsRouter.patch(
  '/:car_id/price',
  Authorization.verifyToken,
  CarsValidator.markAsSold,
  CarsValidator.updateCarPrice,
  Cars.updateCarPice,
);

// Users can get a particular car
carsRouter.get(
  '/:car_id/',
  CarsValidator.getCar,
  Cars.getCar,
);

// Admins can delete cars
carsRouter.delete(
  '/:car_id/',
  Authorization.verifyToken,
  Authorization.isAdmin,
  CarsValidator.getCar,
  Cars.deleteCar,
);

// Admin can get all cars
carsRouter.get('/',
  Authorization.adminSearch,
  CarsValidator.filterCars,
  Cars.filterCars);

// Admins can view all flags for posted AD
carsRouter.get(
  '/:car_id/flags',
  Authorization.verifyToken,
  Authorization.isAdmin,
  CarsValidator.getCar,
  Flags.getCarFlags,
);

// Users can get all their cars
carsRouter.get('/user/my-cars', Authorization.verifyToken, Cars.getCarsByOwner);

export default carsRouter;
