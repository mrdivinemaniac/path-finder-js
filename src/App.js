/**
 * Created by Divinemaniac on 3/8/2016.
 */

function makeInvisible(id) {
    document.getElementById(id).classList.add('invisible');
}

function removeInvisible(id) {
    document.getElementById(id).classList.remove('invisible');
}

var App = {
    //The algorithm currently in use
    currentAlgorithm : DFS,

    //The type of cell that a drag/click on the grid will place on the grid
    cursorType: TYPE_OBSTACLE,

    // /Indicates if the application has been run atleast one time
    ranOnce : false,

    //The interval between each frame of the algorithm animation
    animationInterval: 16,

    //Changes the algorithm that is currently in use
    changeAlgorithm : function(change) {
        var msg = "Switched to ";
        if(change==DFS) {
            msg += "DFS";
        } else if (change==BFS) {
            msg += "BFS";
        }
        msg+=" algorithm. ";
        if(App.currentAlgorithm.running) {
            msg+="<br/>The previously running algorithm has been stopped."
        }
        Interface.showMessage(msg);
        App.stop();
        App.ranOnce = false;
        App.currentAlgorithm = change;
    },

    //runs the current algorithm
    run : function () {
        if(Grid.startCell == null || Grid.goalCell == null) {
            Interface.showMessage("Please place the start and goal points on the grid.")
        } else if (!App.currentAlgorithm.running) {
            //Disable the run button
            makeInvisible("run-button");
            //Enable the pause button
            removeInvisible('pause-button');
            //Enable the stop button
            removeInvisible('stop-button');
            //If the algorithm was paused, resume it, else, start it form the beginning
            if(!App.currentAlgorithm.finished && App.ranOnce) {
                App.currentAlgorithm.resume();
            } else {
                Grid.clearTraversalInformation();
                App.currentAlgorithm.begin(Grid.startCell,Grid.goalCell);
            }
            App.ranOnce = true;
        }
    },

    //Resets the application to initial state
    reset : function() {
        App.stop();
        App.currentAlgorithm.reset();
        App.ranOnce = false;
    },

    //Pauses the currently running algorithm
    pause : function () {
        if(App.currentAlgorithm.running) App.currentAlgorithm.pause();
        //disable the pause button
        makeInvisible('pause-button');
        //Enable the run button
        removeInvisible('run-button');
        //Enable the stop button
        removeInvisible('stop-button');
    },

    //Stops execution of the currently running algorithm
    stop : function () {
        App.currentAlgorithm.end();
        //disable the stop button
        makeInvisible('stop-button');
        //Enable the run button
        removeInvisible('run-button');
        //disable the pause button
        makeInvisible('pause-button');
    },

    //This method is run when the search is complete
    onSearchComplete : function(success) {
        if(success) {
            Interface.showMessage("The path has been found, sire!");
            Grid.goalCell.tracePathTo(Grid.startCell);
        } else {
            Interface.showMessage("We could not find the path, sire!")
        }
        //Enable the run button
        removeInvisible('run-button');
        //Disable the pause button
        makeInvisible('pause-button');
        //Disable the stop button
        makeInvisible('stop-button');

    },

    //Sets the type of the cursor which effects what kind of cell is drawn on the grid
    setCursorType: function(type) {
        App.cursorType = type;
    },

    //Starts Drawing the grid according to the input given
    drawGrid : function() {
        App.reset();
        var rows = document.getElementById("input-rows").value;
        var columns = document.getElementById("input-columns").value;

        Grid.gridDiv = document.getElementById('grid-container');

        //Enable the run button
        removeInvisible('run-button');

        //Enable the draw buttons
        var drawButtons = document.getElementsByClassName('drawButton');
        for(var cnt = 0; cnt<drawButtons.length; ++cnt) {
            drawButtons[cnt].classList.remove('invisible');
        }

        Grid.populate(rows,columns);
    },

    //This method is run when a drag event occurs over the grid
    //It allows obstacles to be filled by dragging
    handleCellDragEnter : function (id) {
        if (!App.currentAlgorithm.running && (!App.ranOnce || (App.ranOnce && App.currentAlgorithm.finished))) {
            if(App.cursorType == TYPE_OBSTACLE) {
                Grid.setObstacle(Grid.getCellById(id));
            } else if (App.cursorType == TYPE_FREE) {
                Grid.setFreeCell(Grid.getCellById(id));
            }
        }
    },

    //This method is run when a cell on the grid is clicked
    //It allows filling of cells
    handleCellClick : function (item) {
        if(!App.currentAlgorithm.running && (!App.ranOnce || (App.ranOnce && App.currentAlgorithm.finished))) {
            var cell = (Grid.getCellById(item));

            switch (App.cursorType) {
                case TYPE_START:
                    Grid.toggleStartCell(cell);
                    break;
                case TYPE_GOAL:
                    Grid.toggleGoalCell(cell);
                    break;
                case TYPE_OBSTACLE:
                    Grid.toggleObstacle(cell);
                    break;
                default:
                    Grid.setFreeCell(cell);
                    break;
            }
        }
    },

    //Sets the speed of the animation
    setAnimationFPS : function (fps) {
        var f = parseInt(fps);
        if(f>0) {
            App.animationInterval = 1000/f;
        } else {
            App.animationInterval = 0;
        }
    },

    //Disables the animation
    disableAnimation : function (state) {
        if(state == false) {
            App.animationInterval = 0;
        } else {
            App.setAnimationFPS(document.getElementById('animation-speed-input').value);
        }
    }
};