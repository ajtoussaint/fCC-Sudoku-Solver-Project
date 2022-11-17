'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {

      if(!(req.body.puzzle && req.body.coordinate && req.body.value)){
        console.log("missing field")
        res.json({error: 'Required field missing'});
      }else{
        let puzzle = req.body.puzzle;
        let coordinateArr = req.body.coordinate.split("");
        let row = coordinateArr[0];
        let column = coordinateArr[1];
        let value = req.body.value;

        //validate the puzzle
        let puzzleIsValid = solver.validate(puzzle);
        console.log("VALIDATE: ", puzzleIsValid);
        if(puzzleIsValid.error){
          console.log(puzzleIsValid, "responding in error");
          res.json(puzzleIsValid);
        }else{
          console.log("COORDINATE: ", row, column);
          if(!(/^[A-Ia-i]$/.test(row) && /^[1-9]$/.test(column))){
            console.log("invalid coordinate")
            res.json({error: 'Invalid coordinate'});
          }else{
            if(!(/^[1-9]$/.test(value))){
              res.json({error:"Invalid value"});
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
          }
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
