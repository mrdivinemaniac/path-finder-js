/**
 * Created by Divinemaniac on 3/8/2016.
 */

const TYPE_FREE = 0;
const TYPE_OBSTACLE = 1;
const TYPE_START = 2;
const TYPE_GOAL = 3;
const TYPE_PATH = 4;

var Cell = function() {
    //The type of this cell
    this.type = TYPE_FREE;

    //Whether this cell has been visited
    this.visited = false;

    //The cells to the left, right, top and bottom of this cell
    this.left = null;
    this.right = null;
    this.top = null;
    this.bottom = null;

    this.findTraversableNeighbour = function() {
        if(this.left!=null && this.left.type!=TYPE_OBSTACLE && this.left.visited==false) {
            this.left.visited = this;
            return ['left',this.left];
        }
        else if (this.top!=null && this.top.type!=TYPE_OBSTACLE && this.top.visited==false) {
            this.top.visited = this;
            return ['up',this.top];
        }
        else if (this.right!=null && this.right.type!=TYPE_OBSTACLE && this.right.visited==false) {
            this.right.visited = this;
            return ['right',this.right];
        }
        else if (this.bottom!=null && this.bottom.type!=TYPE_OBSTACLE && this.bottom.visited==false) {
            this.bottom.visited = this;
            return ['down',this.bottom];
        }
        else return ['none',false];
    }

    this.createDiv = function() {
        var elem = document.createElement("div");
        elem.setAttribute('class','cell free');
        elem.setAttribute('onclick','App.handleCellClick(this)');
        elem.setAttribute('ondragenter','App.handleCellDragEnter(this)');
        elem.setAttribute('draggable','true');
        return elem;
    };

    this.div = this.createDiv();

    this.putDivInElement = function(target,row,column) {
        this.div.setAttribute('id','cell-'+row+'-'+column);
        target.appendChild(this.div);
    };

    this.setLeft = function(cell) {
        this.left = cell;
    };

    this.setRight = function(cell) {
        this.right = cell;
    };

    this.setTop = function(cell) {
        this.top = cell;
    };

    this.setBottom = function(cell) {
        this.bottom = cell;
    };

    this.makeObstacle = function() {
        this.type = TYPE_OBSTACLE;
        this.div.setAttribute('class','cell obstacle');
    };

    this.makeFree = function() {
        this.type = TYPE_FREE;
        this.div.setAttribute('class','cell free');
    };

    this.makeStart = function() {
        this.type = TYPE_START;
        this.div.setAttribute('class','cell start fa fa-child');
    };

    this.makeGoal = function() {
        this.type = TYPE_GOAL;
        this.div.setAttribute('class','cell goal fa fa-trophy');
    };

    this.makePath = function() {
        this.type = TYPE_PATH;
        this.div.setAttribute('class',"cell path");
    };

    this.makeTraced = function() {
        this.div.classList.add('traced');
    }

    this.tracePathTo = function(target) {
        if(target==null) target = false;
        var currentCell = this.visited;
        while(currentCell!=target) {
            currentCell.makeTraced();
            currentCell = currentCell.visited;
        }
    }

    this.setPathBorder = function(direction) {
        if(direction!=null && this.type == TYPE_PATH) {
            this.div.classList.add(direction);
            //this.div.classList.add('fa');
            //this.div.classList.add('fa-angle-double-'+direction);
        }
    };
};
