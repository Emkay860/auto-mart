/**
 * Unit tests for the GET cars endpoint
 */

import chai, { expect, assert } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import { usersHelper, carsHelper } from '../server/api/models';
import mockUser from './__mock__/mockUser';

chai.use(chaiHttp);

describe('Users GET car endpoint test', () => {
  // create two users
  let user1;
  let user2;
  let car1;
  let car2;


  const fileUrl = `${__dirname}/__mock__/__img__/toyota-avalon.jpg`;
  before((done) => {
    usersHelper.removeAllUsers();
    // create multiple users
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .type('form')
      .send(mockUser.validUser)
      .end((err, res) => {
        user1 = res.body.data;
        done();
      });
  });
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .type('form')
      .send(mockUser.validUser2)
      .end((err, res) => {
        user2 = res.body.data;
        done();
      });
  });
  // Create  adverts from user 1
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/car')
      .set('Authorization', `Bearer ${user1.token}`)
      .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
      .type('form')
      .field('state', 'new')
      .field('price', '1500000')
      .field('model', 'lx350')
      .field('manufacturer', 'lexus')
      .field('bodyType', 'jeep')
      .field('name', 'Lexus 350 2014 model')
      .end((err, res) => {
        car1 = res.body.data;
        done();
      });
  });
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/car')
      .set('Authorization', `Bearer ${user1.token}`)
      .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
      .type('form')
      .field('state', 'used')
      .field('price', '1000000')
      .field('model', 'LE2015')
      .field('manufacturer', 'toyota')
      .field('bodyType', 'car')
      .field('name', 'Toyota baseus LE2015 with AC')
      .end((err, res) => {
        car2 = res.body.data;
        done();
      });
  });

  // Mark car2 as sold
  before((done) => {
    chai
      .request(app)
      .patch(`/api/v1/car/${car2.id}/status`)
      .set('Authorization', `Bearer ${user1.token}`)
      .type('form')
      .send()
      .end(() => {
        done();
      });
  });
  after((done) => {
    usersHelper.removeAllUsers();
    carsHelper.clearCars();
    done();
  });

  describe('Flag POST api/v1/flag', () => {
    it('should raise 401 if user token is not provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/flag')
        .type('form')
        .send({
          carId: car1.id,
          reason: 'Fraudulent seller',
          description: 'The seller once duped me',
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');

          const { error, status } = res.body;
          assert.strictEqual(status, 401, 'Status should be 401');
          assert.strictEqual(
            error,
            'authorization token not provided',
            'authorization token not provided',
          );
          done();
        });
    });
    it('should raise 401 if invalid token is provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/flag')
        .set('Authorization', 'Bearer adsflsa')
        .type('form')
        .send({
          carId: car1.id,
          reason: 'Fraudulent seller',
          description: 'The seller once duped me',
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');

          const { error, status } = res.body;
          assert.strictEqual(status, 401, 'Status should be 401');
          assert.strictEqual(
            error,
            'user not authenticated, invalid authorization token provided',
            'user not authenticated, invalid authorization token provided',
          );
          done();
        });
    });
    it('should raise 400 if car id is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/flag')
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({
          carId: '',
          reason: 'Fraudulent seller',
          description: 'The seller once duped me',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');

          const { error, status } = res.body;
          assert.strictEqual(status, 400, 'Status should be 400');
          assert.strictEqual(
            error,
            'car id is undefined or invalid',
            'car id is undefined or invalid',
          );
          done();
        });
    });
    it('should raise 400 if reason is undefined', (done) => {
      chai
        .request(app)
        .post('/api/v1/flag')
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({
          carId: car1.id,
          reason: '',
          description: 'The seller once duped me',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');

          const { error, status } = res.body;
          assert.strictEqual(status, 400, 'Status should be 400');
          assert.strictEqual(
            error,
            'reason is undefined',
            'reason is undefined',
          );
          done();
        });
    });

    it('should raise 400 if description is undefined', (done) => {
      chai
        .request(app)
        .post('/api/v1/flag')
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({
          carId: car1.id,
          reason: 'Fraudulent seller',
          description: '',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');

          const { error, status } = res.body;
          assert.strictEqual(status, 400, 'Status should be 400');
          assert.strictEqual(
            error,
            'description is undefined',
            'description is undefined',
          );
          done();
        });
    });
    it('should raise 404 if car was not found', (done) => {
      chai
        .request(app)
        .post('/api/v1/flag')
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({
          carId: 6,
          reason: 'Fraudulent seller',
          description: 'The seller once duped me',
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');

          const { error, status } = res.body;
          assert.strictEqual(status, 404, 'Status should be 404');
          assert.strictEqual(
            error,
            'car to flag was not found',
            'car to flag was not found',
          );
          done();
        });
    });
    it('should raise 403 if user tries to flag their own advert', (done) => {
      chai
        .request(app)
        .post('/api/v1/flag')
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send({
          carId: car1.id,
          reason: 'Fraudulent seller',
          description: 'The seller once duped me',
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');

          const { error, status } = res.body;
          assert.strictEqual(status, 403, 'Status should be 403');
          assert.strictEqual(
            error,
            'you cannot flag your own advert',
            'you cannot flag your own advert',
          );
          done();
        });
    });
    it('should raise 403 if user tries to flag sold advert', (done) => {
      chai
        .request(app)
        .post('/api/v1/flag')
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({
          carId: car2.id,
          reason: 'Fraudulent seller',
          description: 'The seller once duped me',
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');

          const { error, status } = res.body;
          assert.strictEqual(status, 403, 'Status should be 403');
          assert.strictEqual(
            error,
            'you cannot flag a sold advert',
            'you cannot flag a sold advert',
          );
          done();
        });
    });
    it('should raise 201 when flag is successfully created', (done) => {
      chai
        .request(app)
        .post('/api/v1/flag')
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({
          carId: car1.id,
          reason: 'Fraudulent seller',
          description: 'The seller once duped me',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('data');

          const { data, status } = res.body;
          expect(data).to.be.an('object');
          expect(data).to.have.property('id');
          expect(data).to.have.property('car_id');
          expect(data).to.have.property('user_id');
          expect(data).to.have.property('reason');
          expect(data).to.have.property('description');

          assert.strictEqual(status, 201, 'Status should be 201');

          assert.strictEqual(
            data.id,
            1,
            'flag id should be 1',
          );
          assert.strictEqual(data.car_id, car1.id, `car_id should be ${car1.id}`);
          assert.strictEqual(
            data.user_id,
            user2.id,
            `user_id should be ${user2.id}`,
          );
          assert.strictEqual(
            data.reason,
            'Fraudulent seller',
            'Reason should be should be Fraudulent seller',
          );
          assert.strictEqual(
            data.description,
            'The seller once duped me',
            'Description should be should be The seller once duped me',
          );
          done();
        });
    });
  });
});