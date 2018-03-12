/**
 * Created by Divinemaniac on 3/8/2016.
 */

var Grid = {
    gridDiv : null,
    allRows : [],
    startCell : null,
    goalCell : null,
    toggleGridLines : function() {
        Grid.gridDiv.classList.toggle('grid-lines');
    },
    setFreeCell : function(cell) {
        if(cell.type==TYPE_START) Grid.startCell = null;
        else if(cell.type==TYPE_GOAL) Grid.goalCell = null;
        cell.makeFree();
    },
    toggleStartCell : function(cell) {
        if(Grid.startCell != null)
            Grid.startCell.makeFree();
        if(Grid.startCell != cell) {
            Grid.startCell = cell;
            cell.makeStart();
        } else {
            Grid.startCell = null;
        }
    },
    toggleGoalCell : function(cell) {
        if(Grid.goalCell != null)
            Grid.goalCell.makeFree();
        if(Grid.goalCell != cell) {
            Grid.goalCell = cell;
            cell.makeGoal();
        } else {
            Grid.goalCell = null;
        }
    },
    toggleObstacle : function(cell) {
        if(cell.type==TYPE_OBSTACLE) {
            cell.makeFree();
        } else {
            if(cell.type==TYPE_START) Grid.startCell = null;
            else if(cell.type==TYPE_GOAL) Grid.goalCell = null;
            cell.makeObstacle();
        }
    },
    setObstacle : function(cell) {
        cell.makeObstacle();
    },
    getCellById : function(id) {
        var parts = id.id.split("-");
        var row = parseInt(parts[1]);
        var column = parseInt(parts[2]);
        //Get the cell object belonging to the current cell
        return (Grid.allRows[row])[column];
    },
    reset : function() {
        Grid.gridDiv.innerHTML='';
        Grid.allRows = [];
    },
    createRow : function(rowCount) {
        var elem = document.createElement('div');
        elem.setAttribute('id','row-'+rowCount);
        elem.setAttribute('class','grid-row');
        Grid.gridDiv.appendChild(elem);
        return elem;
    },
    populate : function(rows,columns) {
        Grid.reset();
        //Populate the grid with cells
        for(var row = 0; row < rows; ++row) {
            //Create a new row div
            var rowDiv = Grid.createRow(Grid.gridDiv,row);
            //Create an array to hold the cells of the current row
            var rowCells = [];
            for(var column = 0; column < columns; ++column) {
                //Create a new cell
                var cell = new Cell();
                //Put the cell inside the current row div
                cell.putDivInElement(rowDiv,row,column);
                //Add the cell to the current row array
                rowCells[column] = cell;

                /*
                 ** Set the left and top cells of the current cell
                 ** Also, set the right of the left adjacent cell to this cell
                 ** and set the bottom of the top adjacent cell to this cell
                 ** This way, the top, bottom, left and right of all cells will be set
                 */
                var leftColumn = column - 1;
                var topRow = row - 1;

                //See if a cell exists to the left
                if(leftColumn >= 0) {
                    var leftCell = (rowCells[leftColumn]);
                    //Set the left cell of the current cell
                    cell.setLeft(leftCell);
                    //Set the right cell of the left adjacent cell
                    leftCell.setRight(cell);
                }

                //See if a cell exists to the top
                if(topRow >= 0) {
                    var topCell = (Grid.allRows[topRow])[column];
                    //Set the top cell of the current cell
                    cell.setTop(topCell);
                    //Set the bottom cell of the top adjacent cell
                    topCell.setBottom(cell);
                }
            }
            //Add the current row to the array of rows
            Grid.allRows[row] = rowCells;
        }
    },
    clearTraversalInformation : function() {
        Grid.allRows.forEach(function(row) {
            row.forEach(function(cell) {
                cell.visited = false;
                if(cell.type == TYPE_PATH) {
                    cell.makeFree();
                }
            })
        })
    },
    randomizeObstacles : function() {
        Grid.allRows.forEach(function(row) {
            row.forEach(function(cell) {
                var decision = Math.random();
                if(decision>0.7) {
                    cell.makeObstacle();
                } else {
                    cell.makeFree();
                }
            })
        })
    }
};