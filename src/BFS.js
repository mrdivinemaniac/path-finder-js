/**
 * Created by Divinemaniac on 3/8/2016.
 */

var BFS = {
    nodesInLevel : [],
    start: null,
    goal : null,
    finished : false,
    running : false,
    begin: function(start,goal) {
        BFS.reset();
        BFS.running = true;
        start.visited = true;
        BFS.nodesInLevel.push(start);
        BFS.start = start;
        BFS.goal = goal;
        BFS.process();
    },
    pause : function() {
        BFS.running = false;
    },
    resume : function() {
        BFS.running = true;
        BFS.process();
    },
    end : function () {
        BFS.running = false;
        BFS.finished = true;
    },
    reset: function() {
        BFS.running = false;
        BFS.nodesInLevel = [];
        BFS.start = null;
        BFS.goal = null;
        BFS.finished = false;
    },
    process : function() {
        var thisLevelNodes = [];
        if(!BFS.finished) {
            while(BFS.nodesInLevel.length > 0) {
                var parent = BFS.nodesInLevel.pop();
                var nextCellInfo = null;
                while (1==1) {
                    nextCellInfo = parent.findTraversableNeighbour();
                    var node = nextCellInfo[1];
                    if(node != false) {
                        //If we have found the goal node
                        if(node == BFS.goal) {
                            App.onSearchComplete(true);
                            BFS.end();
                            return;
                        } else {
                            parent.setPathBorder(nextCellInfo[0]);
                            node.makePath();
                            if(nextCellInfo[0] == 'right') {
                                node.setPathBorder('left');
                            } else if (nextCellInfo[0] == 'left') {
                                node.setPathBorder('right');
                            } else if (nextCellInfo[0] == 'up') {
                                node.setPathBorder('down');
                            } else if (nextCellInfo[0] == 'down') {
                                node.setPathBorder('up');
                            }
                            thisLevelNodes.push(node);
                        }
                    } else {
                        break;
                    }
                }
            }

            //Check if we do have some nodes in this level
            if(thisLevelNodes.length > 0) {
                //Set the nodes of this level to be used in next call to this method
                BFS.nodesInLevel = thisLevelNodes;

                //Prepare the next call to this method
                if(BFS.running) {
                    if(App.animationInterval > 0) {
                        setTimeout(function () {
                            BFS.process();
                        }, App.animationInterval);
                    } else {
                        BFS.process();
                    }
                }
            } else {
                //If we do not have any nodes in this level, we cannot find a solution
                App.onSearchComplete(false);
                BFS.end();
            }
        }
    }
}