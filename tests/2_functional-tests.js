const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', done => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { solution: '135762984946381257728459613694517832812936745357824196473298561581673429269145378' });
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', done => {
    chai
      .request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.equal(res.status,  200);
        assert.deepEqual(res.body, { error: 'Required field missing' });
        done();
      });
  });

  test('Solve a puzzle with invalid characters: POST request to /api/solve', done => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle:  'a.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', done => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        done();
      });
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', done => {
   chai
    .request(server)
    .post('/api/solve')
    .send({ puzzle: '..1..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' })
    .end((err, res) => {
      assert.equal(res.status, 200);
      assert.deepEqual(res.body, { "error": "Puzzle cannot be solved" });
      done();
    });
 });

  test('Check a puzzle placement with all fields: POST request to /api/check',  done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'a1',
        value: '7'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: true });
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'a1',
        value: '6'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { "valid": false, "conflict": [ "column" ] });
        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'a1',
        value: '1'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { "valid": false, "conflict": [ "row", "column" ] });
        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'a1',
        value: '5'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { "valid": false, "conflict": [ "row", "column", "region" ] });
        done();
      });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'a1'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { "error": "Required field(s) missing" });
        done();
      });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.a',
        coordinate: 'a1',
        value: '7'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { "error": "Invalid characters in puzzle" });
        done();
      });
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...',
        coordinate: 'a1',
        value: '7'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { "error": "Expected puzzle to be 81 characters long" });
        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'j1',
        value: '7'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { "error": "Invalid coordinate" });
        done();
      });
  });

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'a1',
        value: '77'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { "error": "Invalid value" });
        done();
      });
  });
});

