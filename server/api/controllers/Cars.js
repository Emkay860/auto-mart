import { carsHelper } from '../models';
import { ResponseHandler } from '../utils';
import { query } from '../config/pool';

/**
 * @class Cars
 * @description - Performs every car related tasks
 * @exports Cars
 */
class Cars {
  /**
   * @method createAd
   * @description - Creates advert
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static async createAd(req, res) {
    const bodyType = req.body.body_type;

    const {
      state,
      price,
      manufacturer,
      model,
      imageUrlList,
    } = req.body;
    const name = `${manufacturer} ${model}`;
    const authData = req.authToken.data;

    const queryText = {
      name: 'insert-car',
      text:
        'INSERT INTO cars(owner, manufacturer, state, price, model, name, body_type, image_urls) '
        + 'VALUES($1, $2, $3, $4, $5, $6, $7, $8) '
        + 'RETURNING *',
      values: [
        authData.id,
        manufacturer,
        state,
        parseFloat(price, 10),
        model,
        name,
        bodyType,
        imageUrlList,
      ],
    };

    let queryResult = await query(queryText);
    // eslint-disable-next-line prefer-destructuring
    queryResult = queryResult.rows[0];

    const data = {
      id: queryResult.id,
      created_on: queryResult.created_on,
      name: queryResult.name,
      owner: queryResult.owner,
      manufacturer: queryResult.manufacturer,
      model: queryResult.model,
      price: queryResult.price,
      state: queryResult.state,
      status: queryResult.status,
      body_type: queryResult.body_type,
      image_url: queryResult.image_urls,
    };

    ResponseHandler.success(res, 201, data);
  }

  /**
   * @method markAsSold
   * @description - Marks advert as sold
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static async markAsSold(req, res) {
    let id = req.params.car_id;
    id = parseInt(id, 10);

    const queryResult = await carsHelper.markAsSold(id);

    const data = {
      id: queryResult.id,
      created_on: queryResult.created_on,
      name: queryResult.name,
      owner: queryResult.owner,
      manufacturer: queryResult.manufacturer,
      model: queryResult.model,
      price: queryResult.price,
      state: queryResult.state,
      status: queryResult.status,
      body_type: queryResult.body_type,
      image_url: queryResult.image_urls,
    };

    ResponseHandler.success(res, 201, data);
  }

  /**
   * @method updateCarPrice
   * @description - Updates the price of an advert
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static async updateCarPice(req, res) {
    let id = req.params.car_id;

    let { price } = req.body;

    id = parseInt(id, 10);

    price = parseFloat(price);

    const queryResult = await carsHelper.updateCarPrice(id, price);

    const data = {
      id: queryResult.id,
      created_on: queryResult.created_on,
      name: queryResult.name,
      owner: queryResult.owner,
      manufacturer: queryResult.manufacturer,
      model: queryResult.model,
      price: queryResult.price,
      state: queryResult.state,
      status: queryResult.status,
      body_type: queryResult.body_type,
      image_url: queryResult.image_urls,
    };

    ResponseHandler.success(res, 201, data);
  }

  /**
   * @method getCar
   * @description - Fetches a car
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static async getCar(req, res) {
    let carId = req.params.car_id;

    carId = parseInt(carId, 10);

    const queryResult = await carsHelper.getCar(carId);

    const data = {
      id: queryResult.id,
      created_on: queryResult.created_on,
      name: queryResult.name,
      owner: queryResult.owner,
      manufacturer: queryResult.manufacturer,
      model: queryResult.model,
      price: queryResult.price,
      state: queryResult.state,
      status: queryResult.status,
      body_type: queryResult.body_type,
      image_url: queryResult.image_urls,
    };

    ResponseHandler.success(res, 200, data);
  }

  /**
   * @method deleteCar
   * @description - Deletes an advert
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static async deleteCar(req, res) {
    let carId = req.params.car_id;

    carId = parseInt(carId, 10);

    await carsHelper.deleteCar(carId);

    ResponseHandler.success(res, 200, 'Car Ad successfully deleted');
  }

  static async filterCars(req, res) {
    const { filterParams, filterPriceParams } = req;

    let filteredCars = await carsHelper.filterCars(filterParams);

    if (filterPriceParams !== undefined) {
      filteredCars = await carsHelper.filterPrice(
        filteredCars,
        filterPriceParams,
      );
    }

    const data = [];

    filteredCars.forEach((car) => {
      const returnData = {
        id: car.id,
        created_on: car.created_on,
        name: car.name,
        owner: car.owner,
        manufacturer: car.manufacturer,
        model: car.model,
        price: car.price,
        state: car.state,
        status: car.status,
        body_type: car.body_type,
        image_url: car.image_urls,
      };
      data.push(returnData);
    });

    ResponseHandler.success(res, 200, data);
  }

  /**
   * @method getCarByOwner
   * @description - Fetches an owner's cars
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - JSON Response
   */
  static async getCarsByOwner(req, res) {
    const authData = req.authToken.data;

    const queryResult = await carsHelper.getCarsByOwner(authData.id);

    const data = queryResult;

    ResponseHandler.success(res, 200, data);
  }
}

export default Cars;
