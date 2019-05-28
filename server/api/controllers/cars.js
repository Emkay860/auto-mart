import dummyCars from '../models/dummyCars';
import dbCarsHelper from '../utils/dbCarsHelper';

const cars = {
  createAd(req, res) {
    const {
      owner,
      state,
      email,
      price,
      manufacturer,
      model,
      bodyType,
      name,
      imageUrlList,
    } = req.body;

    const createdOn = Date.now();
    const status = 'available';
    const id = dummyCars.length + 1;

    dbCarsHelper.addCar({
      id,
      createdOn,
      manufacturer,
      status,
      state,
      price: parseFloat(price, 10),
      model,
      name,
      bodyType,
      owner: parseInt(owner, 10),
      email,
      imageUrlList,
    });

    const car = dbCarsHelper.getCar(id);

    res.status(201).send({
      status: 201,
      data: {
        id: car.id,
        email: car.email,
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

  markAsSold(req, res) {
    let id = req.params.car_id;
    id = parseInt(id, 10);
    dbCarsHelper.markAsSold(id);

    const car = dbCarsHelper.getCar(id);

    res.status(201).send({
      status: 201,
      data: {
        id: car.id,
        email: car.email,
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

    dbCarsHelper.updateCarPrice(id, newPrice);

    const car = dbCarsHelper.getCar(id);

    res.status(201).send({
      status: 201,
      data: {
        id: car.id,
        email: car.email,
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
  getUserCar(req, res) {
    let carId = req.params.car_id;
    carId = parseInt(carId, 10);

    const car = dbCarsHelper.getUserCar(carId);

    res.status(200).send({
      status: 200,
      data: {
        id: car.id,
        created_on: car.createdOn,
        status: car.status,
        state: car.state,
        price: car.price,
        model: car.model,
        body_type: car.bodyType,
        email: car.email,
        image_url_list: car.imageUrlList,
        owner: car.owner,
        name: car.name,

      },
    });
  },
};

export default cars;
