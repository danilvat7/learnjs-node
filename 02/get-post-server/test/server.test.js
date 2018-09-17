const assert = require('assert');
const server = require('../server');
const config = require('config');
const request = require('request');
const fs = require('fs-extra');

const host = 'http://127.0.0.1:3000';
const fixturesRoot = __dirname + '/fixtures';

describe('app tests', () => {
  let app;

  before(done => {
    app = server.listen(3000, done);
  });

  beforeEach(() => {
    fs.emptyDirSync(config.get('filesRoot'));
  });

  after(done => {
    app.close(done);
  });

  describe('GET method tests', () => {
    describe('test /', () => {
      it('should return index.html', done => {
        request(`${host}`, (err, res, body) => {
          if (err) return done(err);
          const file = fs.readFileSync(
            `${config.get('publicRoot')}/index.html`,
            {
              encoding: 'utf-8'
            }
          );
          assert.equal(body, file);
          done();
        });
      });
    });

    describe('test /file', () => {
      context('when exist', () => {
        beforeEach(() => {
          fs.copySync(
            `${fixturesRoot}/small.png`,
            `${config.get('filesRoot')}/small.png`
          );
        });
        it('return status 200 and file', done => {
          request.get(`${host}/small.png`, (err, res, body) => {
            if (err) return done(err);
            const file = fs.readFileSync(`${fixturesRoot}/small.png`);
            assert.equal(file, body);
            done();
          });
        });
      });
      context('otherwise', () => {
        it('returm Not found', done => {
          request.get(`${host}/small.png`, (err, res, body) => {
            if (err) return done(err);
            assert.equal(res.statusCode, 404);
            assert.equal(body, 'Not found');
            done();
          });
        });
      });
    });

    describe('nested', () => {
      it('return 400', done => {
        request.get(`${host}/..`, (err, res) => {
          if (err) return done(err);
          assert.equal(res.statusCode, 400);
        });
        request.get(`${host}//`, (err, res) => {
          if (err) return done(err);
          assert.equal(res.statusCode, 400);
        });
        done();
      });
    });
  });

  describe('POST method tests', () => {
    describe('test /file', () => {
      context('when save', () => {
        it('return status 200 and save file', done => {
          const file = fs.readFileSync(`${fixturesRoot}/small.png`);
          request.post({ url: `${host}/small.png`, body: file }, (err, res) => {
            if (err) done(err);
            assert.equal(res.statusCode, 200);
          });
          done();
        });
      });

      context('when not save', () => {
        describe('too big', () => {
          it('return 413', done => {
            const bigFile = fs.readFileSync(`${fixturesRoot}/big.png`);

            request.post(
              { url: `${host}/big.png`, body: bigFile },
              (err, res) => {
                if (err) done(err);
                assert.equal(res.statusCode, 413);
              }
            );

            done();
          });
        });

        describe('exist', () => {
          it('return 409', done => {
            fs.copySync(
              `${fixturesRoot}/small.png`,
              `${config.get('filesRoot')}/small.png`
            );
            const file = fs.readFileSync(`${fixturesRoot}/small.png`);

            request.post(
              { url: `${host}/small.png`, body: file },
              (err, res) => {
                if (err) done(err);
                assert.equal(res.statusCode, 409);
              }
            );
            done();
          });
        });

        describe('not found', () => {
          it('return 404', done => {
            const file = fs.readFileSync(`${fixturesRoot}/small.png`);

            request.post(
              { url: `${host}`, body: file },
              (err, res) => {
                if (err) done(err);
                assert.equal(res.statusCode, 404);
              }
            );
            done();
          });
        });
      });
    });
  });
});
