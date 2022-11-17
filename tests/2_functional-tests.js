const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

//import example puzzles
const puzzleStrings = require('../controllers/puzzle-strings.js');

suite('Functional Tests', () => {
  //Solve a puzzle with valid puzzle string: POST request to /api/solve
  test("Solve a puzzle with a valid puzzle string - POST /api/solve", function(done){
    let thisPuzzle = puzzleStrings.puzzlesAndSolutions[0][0];
    let thisSolution = puzzleStrings.puzzlesAndSolutions[0][1];

    chai.request(server)
      .post("/api/solve")
      .send({
        puzzle: thisPuzzle,
      })
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response is not an object");
        assert.deepEqual(res.body, {solution: thisSolution}, "incorrect solution");
        done();
      });
  });

  //Solve a puzzle with missing puzzle string: POST request to /api/solve
  test("Handle missing puzzle string - POST /api/solve", function(done){
    chai.request(server)
      .post("/api/solve")
      .send({})
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response is not an object");
        assert.deepEqual(res.body, {error: 'Required field missing'}, "lack of puzzle should not be tolerated");
        done();
      });
  });

  //Solve a puzzle with invalid characters: POST request to /api/solve
  test("Solve a puzzle with invalid characters - POST /api/solve", function(done){
    chai.request(server)
      .post("/api/solve")
      .send({puzzle:"a.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."})
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response is not an object");
        assert.deepEqual(res.body, {error: 'Invalid characters in puzzle'}, "valid characters accepted");
        done();
      });
  });

  //Solve a puzzle with incorrect length: POST request to /api/solve
  test("Solve a puzzle of incorrect length - POST /api/solve", function(done){
    chai.request(server)
      .post("/api/solve")
      .send({puzzle:"."})
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response is not an object");
        assert.deepEqual(res.body, {error: 'Expected puzzle to be 81 characters long'}, "wrong length puzzle accepted");
        done();
      });
  });
  //Solve a puzzle that cannot be solved: POST request to /api/solve
  test("Solve a puzzle that cannot be soslved - POST /api/solve", function(done){
    chai.request(server)
      .post("/api/solve")
      .send({puzzle:"5.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."})
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response is not an object");
        assert.deepEqual(res.body, {error: 'Puzzle cannot be solved'}, "produced result for unsolveable puzzle");
        done();
      });
  });
  //Check a puzzle placement with all fields: POST request to /api/check
  test("Check placement with all fields and valid placement - POST /api/check", function(done){
    let thisPuzzle = puzzleStrings.puzzlesAndSolutions[2][0];

    chai.request(server)
      .post("/api/check")
      .send({
        puzzle:thisPuzzle,
        coordinate:"I1",
        value:3
      })
      .end( (err, res) => {
        assert.equal(res.status, 200, "bad status");
        assert.isObject(res.body, "expected response to be object");
        assert.deepEqual(res.body, {valid:true}, "incorrect response object");
        done();
      });

  });
  //Check a puzzle placement with single placement conflict: POST request to /api/check
  test("Check placement with a single conflict - POST /api/check", function(done){
    let thisPuzzle = puzzleStrings.puzzlesAndSolutions[2][0];

    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:thisPuzzle,
        coordinate:"A1",
        value:9
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "bad status");
        assert.isObject(res.body, "expected response to be object");
        assert.deepEqual(res.body, {valid:false, conflict:["row"]}, "incorrect response for row conflict");
      });

      chai.request(server)
        .post('/api/check')
        .send({
          puzzle:thisPuzzle,
          coordinate:"A1",
          value:6
        })
        .end((err, res) => {
          assert.equal(res.status, 200, "bad status");
          assert.isObject(res.body, "expected response to be object");
          assert.deepEqual(res.body, {valid:false, conflict:["column"]}, "incorrect response for column conflict");
        });

        chai.request(server)
          .post('/api/check')
          .send({
            puzzle:thisPuzzle,
            coordinate:"B5",
            value:1
          })
          .end((err, res) => {
            assert.equal(res.status, 200, "bad status");
            assert.isObject(res.body, "expected response to be object");
            assert.deepEqual(res.body, {valid:false, conflict:["region"]}, "incorrect response for region conflict");
            done();
          });

  });
  //Check a puzzle placement with multiple placement conflicts: POST request to /api/check
  test("Check placement with 2 conflicts - POST /api/check", function(done){
    let thisPuzzle = puzzleStrings.puzzlesAndSolutions[2][0];

    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:thisPuzzle,
        coordinate:"B3",
        value:5
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "bad status");
        assert.isObject(res.body, "expected response to be object");
        assert.deepEqual(res.body, {valid:false, conflict:["row", "region"]}, "incorrect response for double conflict");
        done();
      });
  });
  //Check a puzzle placement with all placement conflicts: POST request to /api/check
  test("Check placement with all conflicts - POST /api/check", function(done){
    let thisPuzzle = puzzleStrings.puzzlesAndSolutions[2][0];

    chai.request(server)
      .post('/api/check')
      .send({
        puzzle:thisPuzzle,
        coordinate:"A1",
        value:7
      })
      .end((err, res) => {
        assert.equal(res.status, 200, "bad status");
        assert.isObject(res.body, "expected response to be object");
        assert.deepEqual(res.body, {valid:false, conflict:["row", "column", "region"]}, "incorrect response for triple conflict");
        done();
      });
  });
  //Check a puzzle placement with missing required fields: POST request to /api/check
  test("Check placement with missing required fields - POST /api/check", function(done){
    chai.request(server)
    .post('/api/check')
    .send({})
    .end( (err, res) => {
      assert.equal(res.status, 200, "bad status");
      assert.isObject(res.body, "expected response to be object");
      assert.deepEqual(res.body, {error: 'Required field missing'}, 'accepting puzzle without required fields');
      done();
    })
  });
  //Check a puzzle placement with invalid characters: POST request to /api/check
  test("Check a puzzle with invalid characters - POST /api/check", function(done){
    chai.request(server)
      .post("/api/check")
      .send({
        puzzle:"a.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        coordinate:"A1",
        value:1
    })
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response is not an object");
        assert.deepEqual(res.body, {error: 'Invalid characters in puzzle'}, "valid characters accepted");
        done();
      });
  });
  //Check a puzzle placement with incorrect length: POST request to /api/check
  test("Check a puzzle placement with incorrect length -POST /api/check", function(done){
    chai.request(server)
      .post("/api/check")
      .send({
        puzzle:".",
        coordinate:"A1",
        value:1
    })
      .end( (err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response is not an object");
        assert.deepEqual(res.body, {error: 'Expected puzzle to be 81 characters long'}, "wrong length puzzle accepted");
        done();
      });
  });
  //Check a puzzle placement with invalid placement coordinate: POST request to /api/check
  test("Check a puzzle placement with invalid placement coordinate - POST /api/check", function(done){
    let thisPuzzle = puzzleStrings.puzzlesAndSolutions[2][0];

    chai.request(server)
      .post("/api/check")
      .send({
        puzzle:thisPuzzle,
        coordinate:"Z2",
        value:6
      })
      .end( (err, res) => {
        assert.equal(res.status, 200, "bad status");
        assert.isObject(res.body, "expected response to be object");
        assert.deepEqual(res.body, {error:"Invalid coordinate"}, "invalid coordinate accepted");
        done();
      });
  });
  //Check a puzzle placement with invalid placement value: POST request to /api/check
  test("Check a puzzle placement with invalid placement value", function(done){
    let thisPuzzle = puzzleStrings.puzzlesAndSolutions[2][0];

    chai.request(server)
      .post("/api/check")
      .send({
        puzzle:thisPuzzle,
        coordinate:"A1",
        value:"chicken"
      })
      .end( (err, res) => {
        assert.equal(res.status, 200, "bad status");
        assert.isObject(res.body, "expected response to be object");
        assert.deepEqual(res.body, {error:"Invalid value"}, "invalid value accepted");
        done();
      });
  });
});
