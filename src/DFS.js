/**
 * Created by Divinemaniac on 3/8/2016.
 */

var DFS = {
    stack : [],
    nextCell : null,
    start:null,
    goal : null,
    finished : false,
    running : false,
    begin: function(start,goal) {
        DFS.reset();
        DFS.running = true;
        start.visited = true;
        DFS.nextCell = start;
        DFS.start = start;
        DFS.goal = goal;
        DFS.process();
    },
    pause : function() {
        DFS.running = false;
    },
    resume : function() {
        DFS.running = true;
        DFS.process();
    },
    end : function () {
        DFS.running = false;
        DFS.finished = true;
    },
    reset: function() {
        DFS.running = false;
        DFS.stack = [];
        DFS.nextCell = null;
        DFS.start = null;
        DFS.goal = null;
        DFS.finished = false;
    },
    process : function() {
        if(!DFS.finished) {
            var currCell = DFS.nextCell;
            var nextCellInfo = DFS.nextCell.findTraversableNeighbour();
            DFS.nextCell = nextCellInfo[1];
            if(DFS.nextCell != false) {
                DFS.stack.push(currCell);
                if(currCell!=null) {
                    currCell.setPathBorder(nextCellInfo[0]);
                    if(DFS.nextCell != DFS.goal) {
                        DFS.nextCell.makePath();
                        if(nextCellInfo[0] == 'right') {
                            DFS.nextCell.setPathBorder('left');
                        } else if (nextCellInfo[0] == 'left') {
                            DFS.nextCell.setPathBorder('right');
                        } else if (nextCellInfo[0] == 'up') {
                            DFS.nextCell.setPathBorder('down');
                        } else if (nextCellInfo[0] == 'down') {
                            DFS.nextCell.setPathBorder('up');
                        }
                    }
                }
            } else if(currCell!=DFS.start) {
                if(currCell!=null) currCell.makeFree();
                DFS.nextCell = DFS.stack.pop();
            }

            if(DFS.nextCell == DFS.goal || (currCell==DFS.start && DFS.nextCell == false)) {
                if(DFS.nextCell == DFS.goal) {
                    App.onSearchComplete(true);
                } else {
                    App.onSearchComplete(false);
                }
                DFS.end();
            } else if (DFS.running) {
                if(App.animationInterval > 0) {
                    setTimeout(function () {
                        DFS.process();
                    }, App.animationInterval);
                } else {
                    DFS.process();
                }
            }
        }
    }
}