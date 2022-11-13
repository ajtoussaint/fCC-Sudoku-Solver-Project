const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

//import example puzzles
const puzzleStrings = require('../controllers/puzzle-strings.js');
const badCharactersString = "a.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

suite('Unit Tests', () => {
  //Logic handles a valid puzzle string of 81 characters
  test("Validate a valid puzzle string of 81 characters - validate()", function() {
    assert.deepEqual(
      solver.validate(puzzleStrings.puzzlesAndSolutions[4][0]),
      {valid:true},
      "Did not validate correct string");
  });

  //Logic handles a puzzle string with invalid characters (not 1-9 or .)
  test("handle a puzzle string with invalid characters", function(){
    assert.deepEqual(
      solver.validate(badCharactersString),
      {error: 'Invalid characters in puzzle'},
      "did not invalidate bad chars"
    );
  });
  //Logic handles a puzzle string that is not 81 characters in length
  test("handles a puzzle string that is not 81 charactres in length", function() {
    assert.deepEqual(
      solver.validate("."),
      {error: 'Expected puzzle to be 81 characters long'},
      "did not invalidate short string"
    );
  });
  //Logic handles a valid row placement
  test("handle valid row placement", function() {
    assert.deepEqual(
      solver.checkRowPlacement(puzzleStrings.puzzlesAndSolutions[4][0], "A", "9", 3),
      {valid:true},
      "did not validate row placement correctly"
     );
  });
  //Logic handles an invalid row placement
  test("handle invalid row placement", function() {
    assert.deepEqual(
      solver.checkRowPlacement(puzzleStrings.puzzlesAndSolutions[4][0], "H", "8", 3),
       {valid:false, conflict: ["row"]},
       "failed to call out invalid row placement"
     );
  });

  //Logic handles a valid column placement
  test("handle valid column placement", function() {
    assert.deepEqual(
      solver.checkColPlacement(puzzleStrings.puzzlesAndSolutions[4][0], "A", "9", 3),
      {valid:true},
      "did not validate column placement correctly"
    );
  });
  //Logic handles an invalid column placement
  test("handle invalid column placement", function() {
    assert.deepEqual(
      solver.checkColPlacement(puzzleStrings.puzzlesAndSolutions[4][0], "E", "9", 7),
      {valid:false, conflict: ["column"]},
      "failed to invalidate column placement"
    );

  });

  //Logic handles a valid region (3x3 grid) placement
  test("handle valid region placement", function() {
    assert.deepEqual(
      solver.checkRegionPlacement(puzzleStrings.puzzlesAndSolutions[4][0], "A", "9", 3),
      {valid:true},
      "did not validate region placement correctly"
    );
  });
  //Logic handles an invalid region (3x3 grid) placement
  test("handle invalid region placement", function() {
    assert.deepEqual(
      solver.checkRegionPlacement(puzzleStrings.puzzlesAndSolutions[4][0], "E", "2", 4),
      {valid:false, conflict: ["region"]},
      "failed to invalidate region placement"
    );
  });

  //Valid puzzle strings pass the solver
  test("valid puzzle strings pass the solver", function() {
    assert.deepEqual(
      solver.solve(puzzleStrings.puzzlesAndSolutions[4][0]),
      {solution: puzzlesAndSolutions[4][1]},
      "valid puzzle string did not pass solver (string 4)"
    );
  });

  //Invalid puzzle strings fail the solver
  test("invalid puzzle strings fail the solver", function() {
    assert.deepEqual(
      solver.solve("."),
      {error: "invalid puzzle string"},
      "solver returns solution for invalid puzzle"
    );
  });

  //Solver returns the expected solution for an incomplete puzzle
  test("solver returns expected solution for an incomplete puzzle", function() {
    assert.deepEqual(
      solver.solve(puzzleStrings.puzzlesAndSolutions[1][0]),
      {solution: puzzlesAndSolutions[1][1]},
      "valid puzzle string did not pass solver (string 1)"
    );

    assert.deepEqual(
      solver.solve(puzzleStrings.puzzlesAndSolutions[2][0]),
      {solution: puzzlesAndSolutions[2][1]},
      "valid puzzle string did not pass solver (string 2)"
    );

    assert.deepEqual(
      solver.solve(puzzleStrings.puzzlesAndSolutions[3][0]),
      {solution: puzzlesAndSolutions[3][1]},
      "valid puzzle string did not pass solver (string 3)"
    );

    assert.deepEqual(
      solver.solve(puzzleStrings.puzzlesAndSolutions[4][0]),
      {solution: puzzlesAndSolutions[4][1]},
      "valid puzzle string did not pass solver (string 3)"
    );

  });

});
