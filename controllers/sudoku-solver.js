class SudokuSolver {

  validate(puzzleString) {
    console.log("validating...");
    console.log(puzzleString);
    if(puzzleString.length != 81){
      return {error: "Expected puzzle to be 81 characters long"}
    }else if(/[^\d\.]/.test(puzzleString)){
      return {error: 'Invalid characters in puzzle'}
    }else{
      return {valid: true}
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    //row is letter column is number
    //translate the string so it is easier to work with
    let workArr = []
    for(let i = 0; i<9; i++ ){
      //i represents the "number of the row" of the puzzle string
      let rowArr = [];
      for(let j = 0; j<9; j++ ){
        //j represents the place in that row
        let currentLocation = (i*9)+j
        rowArr.push(puzzleString[currentLocation]);
      }
      workArr.push(rowArr);
    };
    //workArr now has row 1 array as its first entry etc.
    column = column*1 - 1;
    row = row.toUpperCase().charCodeAt(0) - 65;
    //insert the value into its location
    workArr[row][column] = value;
    //check for duplicates in workArr row
    if(workArr[row].filter(i => i==value).length != 1){
      return {valid:false, conflict: ["row"]}
    }else{
      return {valid:true}
    }
  }

  checkColPlacement(puzzleString, row, column, value) {
    let workArr = []
    for(let i = 0; i<9; i++ ){
      //i represents the "number of the row" of the puzzle string
      let colArr = [];
      for(let j = 0; j<9; j++ ){
        //j represents the place in that row
        let currentLocation = (j*9)+i
        colArr.push(puzzleString[currentLocation]);
      }
      workArr.push(colArr);
    };

    column = column*1 - 1;
    row = row.toUpperCase().charCodeAt(0) - 65;

    console.log("WORK 1:", workArr[column]);

    console.log(row, column);
    //insert the value into its location
    workArr[column][row] = value;
    //check for duplicates in workArr row

    console.log("Work 2:", workArr[column]);

    if(workArr[column].filter(i => i==value).length != 1){
      console.log("INVALID:", workArr[column].filter(i => i==value))
      return {valid:false, conflict: ["column"]}
    }else{
      return {valid:true}
    }
  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {

  }
}

module.exports = SudokuSolver;
