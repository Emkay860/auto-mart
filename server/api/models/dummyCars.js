/**
 *  Dummy db for cars
 * @param {number} id id of the car
 * @param {(number|Date)}createdOn the date the car advert was created
 * @param {string} status sold or available
 * @param {string} state new or used
 * @param {number} price the car price
 * @param {string} model the car model
 * @param {string} name the car name
 * @param {string} bodyType the car body type
 * @param {string} owner the owner of the advert
 * @param {string} email email of the owner
 * @param {(string|Array)} imageUrlList the advert images
 *
 */
const dummyCars = [];
export default dummyCars;

export const addCar = (car) => {
  dummyCars.push(car);
};
export const getCar = id => dummyCars.find(car => car.id === id) || -1;

export const getAvailableCar = id => dummyCars.find(car => (car.status === 'available' && car.id === id)) || -1;

export const markAsSold = (id) => {
  const car = getCar(id);
  if (car !== -1) {
    car.status = 'sold';
  }
  return car;
};
export const clearCars = () => {
  dummyCars.splice(0, dummyCars.length);
};

export const updateCarPrice = (id, newPrice) => {
  const car = getCar(id);
  if (car !== -1) {
    car.price = newPrice;
  }
  return car;
};
