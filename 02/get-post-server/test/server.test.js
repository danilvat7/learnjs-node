const assert = require('assert');
const should = require('should');
const server = require('../server');
const config = require('config');
const request = require('request');
const fs = require('fs-extra');

const rp = require('request-promise').defaults({
  encoding: null,
  simple: false,
  resolveWithFullResponse: true
});

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
      it('should return index.html', async () => {
        const file = fs.readFileSync(`${config.get('publicRoot')}/index.html`);
        const res = await rp.get(`${host}`);
        res.body.equals(file).should.be.true();
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
        it('return status 200 and file', async () => {
          const file = fs.readFileSync(`${fixturesRoot}/small.png`);
          const res = await rp.get(`${host}/small.png`);
          res.body.equals(file).should.be.true();
        });
      });
      context('otherwise', () => {
        it('returm Not found', async () => {
          const res = await rp.get(`${host}/small.png`);
          res.statusCode.should.be.equal(404);
        });
      });
    });

    describe('nested', () => {
      it('return 400', async () => {
        const res = await rp.get(`${host}/nested/path`);
        res.statusCode.should.be.equal(400);
      });
    });
  });

  describe('POST method tests', () => {
    describe('test /file', () => {
      context('when save', () => {
        it('return status 200 and save file', async () => {
          const file = fs.readFileSync(`${fixturesRoot}/small.png`);
          const res = await rp.post({
            url: `${host}/small.png`,
            body: file
          });
          res.statusCode.should.be.equal(200);
        });
      });

      context('when not save', () => {
        describe('too big', () => {
          it('return 413', async () => {
            // const bigFile = fs.readFileSync(`${fixturesRoot}/big.png`);
            // const res = await rp.post({
            //   url: `${host}/big.png`,
            //   body: bigFile
            // });
            // res.statusCode.should.be.equal(413);

          });
        });

        describe('exist', () => {
          it('return 409', async () => {
            fs.copySync(
              `${fixturesRoot}/small.png`,
              `${config.get('filesRoot')}/small.png`
            );
            const file = fs.readFileSync(`${fixturesRoot}/small.png`);
            const res = await rp.post({
              url: `${host}/small.png`,
              body: file
            });
            res.statusCode.should.be.equal(409);
          });
        });

        describe('not found', () => {
          it('return 404', async () => {
            const file = fs.readFileSync(`${fixturesRoot}/small.png`);
            const res = await rp.post({
              url: `${host}`,
              body: file
            });
            res.statusCode.should.be.equal(404);
          });
        });
      });
    });
  });
});