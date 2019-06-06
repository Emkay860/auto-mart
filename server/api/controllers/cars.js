import { dummyCars, carsHelper } from '../models';

const cars = {
  createAd(req, res) {
    const {
      state,
      price,
      manufacturer,
      model,
      bodyType,
      name,
      imageUrlList,
    } = req.body;

    const createdOn = Date.now();
    const status = 'available';
    let id;
    if (dummyCars.length === 0) {
      id = 1;
    } else {
      id = carsHelper.getLastCar().id + 1;
    }
    const authData = req.authToken.data;

    carsHelper.addCar({
      id,
      owner: authData.id,
      createdOn,
      manufacturer,
      status,
      state,
      price: parseFloat(price, 10),
      model,
      name,
      bodyType,
      imageUrlList,
    });

    const car = carsHelper.getCar(id);

    res.status(201).json({
      status: 201,
      data: {
        id: car.id,
        created_on: car.createdOn,
        name: car.name,
        owner: car.owner,
        manufacturer: car.manufacturer,
        model: car.model,
        price: car.price,
        state: car.state,
        status: car.status,
        body_type: car.bodyType,
        image_urls: car.imageUrlList,
      },
    });
  },

  markAsSold(req, res) {
    let id = req.params.car_id;
    id = parseInt(id, 10);
    carsHelper.markAsSold(id);

    const car = carsHelper.getCar(id);

    res.status(201).json({
      status: 201,
      data: {
        id: car.id,
        owner: car.owner,
        created_on: car.createdOn,
        manufacturer: car.manufacturer,
        model: car.model,
        price: car.price,
        state: car.state,
        status: car.status,
        image_urls: car.imageUrlList,
      },
    });
  },
  updateCarPice(req, res) {
    let id = req.params.car_id;
    let { newPrice } = req.body;
    id = parseInt(id, 10);
    newPrice = parseFloat(newPrice);
    carsHelper.updateCarPrice(id, newPrice);
    const car = carsHelper.getCar(id);
    res.status(201).json({
      status: 201,
      data: {
        id: car.id,
        created_on: car.createdOn,
        name: car.name,
        owner: car.owner,
        manufacturer: car.manufacturer,
        model: car.model,
        price: car.price,
        state: car.state,
        status: car.status,
        body_type: car.bodyType,
        image_urls: car.imageUrlList,
      },
    });
  },
  getAvailableCar(req, res) {
    let carId = req.params.car_id;
    carId = parseInt(carId, 10);
    const car = carsHelper.getAvailableCar(carId);
    res.status(200).json({
      status: 200,
      data: {
        id: car.id,
        created_on: car.createdOn,
        name: car.name,
        owner: car.owner,
        manufacturer: car.manufacturer,
        model: car.model,
        price: car.price,
        state: car.state,
        status: car.status,
        body_type: car.bodyType,
        image_urls: car.imageUrlList,
      },
    });
  },
  deleteCar(req, res) {
    let carId = req.params.car_id;
    carId = parseInt(carId, 10);
    carsHelper.deleteCar(carId);
    res.status(200).json({
      status: 200,
      data: 'Car Ad successfully deleted',
    });
  },
  filterCars(req, res) {
    const { filterParams, filterPriceParams } = req;
    let filteredCars = carsHelper.filterCars(filterParams);
    if (filterPriceParams !== undefined) {
      filteredCars = carsHelper.filterPrice(filteredCars, filterPriceParams);
    }
    const data = [];
    filteredCars.forEach((car) => {
      const returnData = {
        id: car.id,
        owner: car.owner,
        created_on: car.createdOn,
        manufacturer: car.manufacturer,
        status: car.status,
        state: car.state,
        price: car.price,
        model: car.model,
        name: car.name,
        body_type: car.bodyType,
        image_urls: car.imageUrlList,
      };
      data.push(returnData);
    });
    res.status(200).json({
      status: 200,
      data,
    });
  },
};

export default cars;
