class SudokuSolver {

  validate(puzzleString) {
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

    //insert the value into its location
    workArr[column][row] = value;
    //check for duplicates in workArr col
    if(workArr[column].filter(i => i==value).length != 1){
      return {valid:false, conflict: ["column"]}
    }else{
      return {valid:true}
    }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    //organize regions into arrays
    let workArr = [];
    for(let k=0; k<3; k++){
      for(let i=0; i<3; i++){
        //i represents the "region number" 0-8
        let regionArr = []
        for(let j=0; j<3; j++){
        //j represents the cells in the region going top to bottom left to right
        regionArr.push(puzzleString[j+i*3+k*27]);
        regionArr.push(puzzleString[j+9+i*3+k*27]);
        regionArr.push(puzzleString[j+18+i*3+k*27]);
        }
        workArr.push(regionArr);
      }
    }
    //translate the coordinates into region locations
    column = column*1-1;
    row = row.toUpperCase().charCodeAt(0) - 65;
    let region = 3*Math.trunc(row/3) + Math.trunc(column/3);
    let valueLocation = row%3 + 3*(column%3);
    //insert the value
    workArr[region][valueLocation] = value;
    //check for duplicates in workArr region
    if(workArr[region].filter(i => i==value).length != 1){
      return {valid:false, conflict: ["region"]}
    }else{
      return {valid:true}
    }

  }











  solve(puzzleString) {
    let solver = new SudokuSolver;

    //validate string and return the correct error
    if(!(solver.validate(puzzleString).valid)){
      return(solver.validate(puzzleString));
    }else{
      //if string is valid check that there is no case of wrongly placed numbers
      let myArr = puzzleString.split("");
      let arrRes = myArr.reduce( (output, value, index) => {
        let row = String.fromCharCode(Math.trunc(index/9) + 65);
        let column = index % 9 + 1;
        if(value != "."){
          if(! (solver.checkRowPlacement(puzzleString, row, column, value).valid && solver.checkColPlacement(puzzleString, row, column, value).valid && solver.checkRegionPlacement(puzzleString, row, column, value).valid) ){
            console.log("Found an overlap concerning: ", value, " at ", row, column);
            return false;
          }else{
            //console.log(value, " at ", row, column, " seems ok");
            return (true);
          }
        }
      }, true);
      if(!arrRes){
        //if there is a row/column/region violation already present return "unsolveable"
        return {error: "unsolveable"}
      }else{
        //if the string has no blanks return it as a solution
        if(puzzleString.indexOf(".")== -1){
          console.log("Solution! : ", puzzleString);
          return {solution: puzzleString}
        }else{
          //if the string has blanks
          //make a new string with 1 in the blank (or next validateable number)
          for(let i = 1; i<=9; i++){
            //check that i is valid placement
            let iIndex = puzzleString.indexOf(".");
            let row = String.fromCharCode(Math.trunc(iIndex/9) + 65);
            let column = iIndex % 9 + 1;
            if ((solver.checkRowPlacement(puzzleString, row, column, i).valid && solver.checkColPlacement(puzzleString, row, column, i).valid && solver.checkRegionPlacement(puzzleString, row, column, i).valid)){
              //if i can be placed there try to solve that string
              let newStr = puzzleString.replace(".",i,1);
              //if that string is solveable return it's solution
              //if it is unsolveable try 2 etc...
              let solverRes = solver.solve(newStr);
              if(!solverRes.error){
                return solverRes;
              }
            }
          }
          //if 1-9 all produce unsolveable strings declare the original string unsolveable
          return {error: "unsolveable"}
        }
      }
    }
  }
}

module.exports = SudokuSolver;
