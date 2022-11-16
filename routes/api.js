'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      let coordinateArr = req.body.coordinate.split("");
      let row = coordinateArr[0];
      let column = coordinateArr[1];
      let value = req.body.value;

      console.log(row, column, value);
      console.log(req.body);

      if(!(puzzle && req.body.coordinate && value)){
        console.log("missing field")
        res.json({error: 'Required field missing'});
      }else if(!(/^[A-Za-z]$/.test(row) && /^[1-9]$/.test(column))){
        console.log("invalid coordinate")
        res.json({error: 'Invalid coordinate'});
      }else{
        let rowIsValid = solver.checkRowPlacement(puzzle, row, column, value).valid;
        let columnIsValid = solver.checkColPlacement(puzzle, row, column, value).valid;
        let regionIsValid = solver.checkRegionPlacement(puzzle, row, column, value).valid;

        if(rowIsValid && columnIsValid && regionIsValid){
          //if there are no conflicts say its valid
          res.json({valid:true});
        }else{
          let conflictArr = [];
          if(!rowIsValid){conflictArr.push("row")}
          if(!columnIsValid){conflictArr.push("column")}
          if(!regionIsValid){conflictArr.push("region")}
          res.json({valid:false, conflict:conflictArr});
        }
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle
      if(!puzzle){
        res.json({error: 'Required field missing'});
      }else if((solver.validate(puzzle).error)){
        res.json(solver.validate(puzzle));
      }else{
        res.json(solver.solve(puzzle));
      }
    });
};
