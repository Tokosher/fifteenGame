class PuzzleGame {
    constructor(cellSize, appWidth, appHeight) {
        this.cellSize = cellSize;
        this.appWidth = appWidth;
        this.appHeight = appHeight;

        this.arr = [
            [1,2,3,4],
            [5,6,7,8],
            [9,10,11,12],
            [13,14,15,0] // 0 - позиция пустого блока
        ];

        this.emptyCell = {
            left: 3,
            top: 3
        };

        this.cells = [];
        this.cells.push(this.emptyCell);
    }

    createApp() {
        this.app = new PIXI.Application(
            {
                width: this.appWidth,
                height: this.appHeight,
                backgroundColor: 0xAAAAAA
            }
        );

        document.querySelector('.field').appendChild(this.app.view);
    }

    mix(stepCount) {
        let x,y;

        for (let i = 0; i < stepCount; i++) { // 5 итераций
            let nullX = this._getNullCell().left;
            let nullY = this._getNullCell().top;
            /*console.log(`nullX: ${nullX}`);
            console.log(`nullY: ${nullY}`);*/
            let hMove = this._getRandomBool();
            let upLeft = this._getRandomBool();
            /*console.log(`hMove: ${hMove}`);
            console.log(`upLeft: ${upLeft}`);*/
            if (!hMove && !upLeft) { y = nullY; x = nullX - 1;}
            if (hMove && !upLeft)  { x = nullX; y = nullY + 1;}
            if (!hMove && upLeft)  { y = nullY; x = nullX + 1;}
            if (hMove && upLeft)   { x = nullX; y = nullY - 1;}
            /*console.log(`x: ${x}`);
            console.log(`y: ${y}`);*/
            if (0 <= x && x <= 3 && 0 <= y && y <= 3) {
                this._shuffle(x, y);
            }
        }
    }

    placeBlocks() {
        let numbers = this.arr.flat();

        numbers.map((num, index) => {
            const left = index % 4;
            const top = (index - left) / 4;

            this._createCells(num, left, top);
        });
    }

    _put(cell, top, left, CELL_SIZE) { // _
        cell.x = left * CELL_SIZE;
        cell.y = top * CELL_SIZE;

        cell.left = left;
        cell.top = top;
    }

    _isWrongBlock(cell) { // _
        const leftSubtraction = Math.abs(this.emptyCell.left - cell.left);
        const topSubtractions = Math.abs(this.emptyCell.top - cell.top);

        return leftSubtraction + topSubtractions > 1
    }

    _move(cell) { // используется для передвижения блоков рукой игрока
        if (this._isWrongBlock(cell)) return;

        Ease.ease.add(cell,{x: this.emptyCell.left * this.cellSize, y: this.emptyCell.top * this.cellSize}, { duration: 1000 } );

        const tempLeft = this.emptyCell.left;
        const tempTop = this.emptyCell.top;

        this.emptyCell.left = cell.left;
        this.emptyCell.top = cell.top;
        cell.left = tempLeft;
        cell.top = tempTop;

        this._win();
    }

    _createCells(i, left, top) { //_
        if (i === 0) return;

        let cell = new PIXI.Sprite.from(`images/${i}.png`);
        this._put(cell, top, left, this.cellSize);
        this.app.stage.addChild(cell);

        cell.interactive = true;
        cell.buttonMode = true;
        cell.index = i;

        cell.on("pointerup", () => {
            this._move(cell);
        });

        this.cells.push(cell);
    }

    _win() { // _
        const isFinished = this.cells.every(cell => {
            if (!cell.index) return true;
            return cell.index === cell.top*4 + cell.left + 1; // cause we have a number
        });

        if (isFinished) alert("You win!")
    }

    _shuffle(x, y) { // используется для начального расставления блоков через двумерный массив arr
        let nullX = this._getNullCell().left;
        let nullY = this._getNullCell().top;
        if (
            ((x - 1 === nullX || x + 1 === nullX) && y === nullY)
            || ((y - 1 === nullY || y + 1 === nullY) && x === nullX)
        ) {
            this.arr[nullY][nullX] = this.arr[y][x];
            this.arr[y][x] = 0;

            this.emptyCell.left = x;
            this.emptyCell.top = y;
        }
    }

    _getNullCell(){ // refactor with emptyCell
        return this.emptyCell;
    }

    _getRandomBool() { // _
        if (Math.floor(Math.random() * 2) === 0) {
            return true; // функция возращает true, в обратном случае возвращает undefined, что является ложным значением
        }
    }

}

const puzzleGame15 = new PuzzleGame(200, 800, 800);
puzzleGame15.createApp();
puzzleGame15.mix(40);
puzzleGame15.placeBlocks();