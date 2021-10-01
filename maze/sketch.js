var border = 4;
var fps = 60;
var wCell =30;
var grid;
var currentCell;
var rows,cols;
var stack = [];
// executed one time
function setup() {
	border = (windowHeight/windowHeight)*2;
	wCell = (windowHeight/windowHeight)*28;
	createCanvas(windowWidth, windowHeight);
	frameRate(fps);
	background(0,0,0);
	rows =floor((windowHeight)/wCell)-(border*2 +1);
	cols = floor((windowWidth)/wCell)-(border*2 +1);
	grid = Array(cols);
	for(var i=0;i<cols;i++)
	{
		grid[i] = Array(rows);
	}
	for( i = 0;i<rows;i++)
		for(var j = 0; j<cols; j++)
		{
			
			var cell = new Cell(j,i);
			grid[j][i] = cell;
			cell.show();
		}
	currentCell = grid[floor(random(cols-1))][floor(random(rows-1))];
	currentCell.setVisited();
	stack.push(currentCell);
	
	var a = pickUnvisitedCell();
	//console.log ( "unvisited "+a.x+ " "+a.y);
	for(var i = 0;i<rows;i++)
		for(var j = 0; j<cols; j++)
		{
			
			grid[j][i].show();
		}
	
}
function pickCol()
{
	return max(50,random(255));
}
function pickUnvisitedCell()
{
	for(var i = 0;i<rows;i++)
		for(var j = 0; j<cols; j++)
		{
			
			if(!grid[j][i].isVisited())return grid[j][i];
		}
	return null;
}
// executed loop
function draw() {
	if(stack.length ==0){
		//console.log("stack 0");
		var c =pickUnvisitedCell();
		if(c==null)
		{
			//console.log("no unvisited");
			return;
		}
		else 
		{
			console.log("push");
			stack.push(c);
			c.setVisited();
		}
	}
	background(0,0,0);

	currentCell = stack.pop();
	var neighbour = currentCell.removeWallOfUnvisitedNeighbour();
	if(neighbour!=null)
	{
		stack.push(currentCell);
		// remove the wall between cur and neighbour
		neighbour.setVisited();
		stack.push(neighbour);

		
	}

	// draw cells
	for(var i = 0;i<rows;i++)
		for(var j = 0; j<cols; j++)
		{
			
			grid[j][i].show();
		}
	
	
	updatePixels();
}
class Cell
{
	constructor(x,y)
	{
		this.xIndex = x;
		this.yIndex = y;
		this.x =  (x+border)*wCell;
		this.y =  (y+border)*wCell;
		this.top = true;
		this.bottom = true;
		this.left = true;
		this.right = true;
		this.visited = false;
	}
	setVisited()
	{
		this.visited = true;
	}
	isVisited()
	{
		return this.visited;
	}
	cellLeft()
	{
		if(this.xIndex<=0)return null;
		else return grid[this.xIndex-1][this.yIndex]
	}
	cellUp()
	{
		if(this.yIndex>=rows-1)return null;
		else return grid[this.xIndex][this.yIndex+1]
		
	}
	cellRight()
	{
		if(this.xIndex>=cols-1)return null;
		else return grid[this.xIndex+1][this.yIndex]
	}
	cellDown()
	{
		if(this.yIndex<=0)return null;
		else return grid[this.xIndex][this.yIndex-1]
	}
	// remove top wall
	removeTop()
	{
		if(this.top==false)return;
		this.top = false;
		var c = this.cellUp();
		if(c!=null)c.removeBottom();
	}
	removeBottom()
	{
		if(this.bottom==false)return;
		this.bottom =false;
		var c = this.cellDown();
		if(c!=null)c.removeTop();
	}
	removeRight()
	{
		if(this.right==false)return;
		this.right =false;
		var c = this.cellRight();
		if(c!=null)c.removeLeft();
	}
	removeLeft()
	{
		if(this.left==false)return;
		this.left =false;
		var c = this.cellLeft();
		if(c!=null)c.removeRight();
	}
	show()
	{
		var x = this.x;
		var y = this.y;
		stroke(255, 255, 255);
		if(this.top)line(x,y+wCell, x+wCell,y+wCell);
		//stroke(0,0,255);
		if(this.left)line(x,y, x,y+wCell);
		//stroke(255,0,0);
		if(this.right)line(x+wCell,y, x+wCell,y+wCell);
		//stroke(255,255,0);
		if(this.bottom)line(x,y, x+wCell,y);
		if(this.visited)
		{
			//var dim = wCell/1.5;
			//fill(color(0,255,0));
			//rect(x+dim,y+dim, wCell-dim*2, wCell-dim*2);
		}
	}
	// rimuove il muro di un neighbour non visitato e ritorna il neighbour
	removeWallOfUnvisitedNeighbour()
	{
		var l = [0,1,2,3];
		shuffle(l,true);
		for(var i = 0;i<4;i++)
		{
			
			if(l[i]==0)
			{
				var c = this.cellLeft();
				if(c!=null && !c.isVisited() && this.left)
				{
					
					this.removeLeft();
					return c;
				}
				continue;
			}
			
			if(l[i]==1)
			{
				c = this.cellRight();
				if(c!=null && !c.isVisited() && this.right)
				{
					
					this.removeRight();
					return c;
				}
				continue;
			}
			
			if(l[i]==2)
			{
				c = this.cellUp();
				if(c!=null && !c.isVisited() && this.top)
				{
					this.removeTop();
					return c;
				}
				continue;
			}
			
			if(l[i]==3)
			{
				c = this.cellDown();
				if(c!=null  && !c.isVisited() && this.bottom)
				{
					this.removeBottom();
					return c;
				}
				continue;
			}
			return null;
			
		}
		
		
	}
}
