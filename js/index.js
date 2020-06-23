class PuzzleGame {
    constructor(cellSize, appWidth, appHeight, target) {
        this.cellSize = cellSize;
        this.appWidth = appWidth;
        this.appHeight = appHeight;
        this.target = target;
    }

    createArea() {
        this.app = new PIXI.Application(
            {
                width: this.appWidth,
                height: this.appHeight,
                backgroundColor: 0xAAAAAA
            }
        );

        document.querySelector(this.target).appendChild(this.app.view);
    }

    createBlocks() {
        this.arr = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 0] // 0 - позиция пустого блока
        ];

        this.emptyCell = {
            left: 3,
            top: 3
        };

        this.cells = [];
        this.cells.push(this.emptyCell);
    }

    mix(stepCount) {
        let x, y;

        for (let i = 0; i < stepCount; i++) {
            let nullX = this._getNullCell().left;
            let nullY = this._getNullCell().top;

            let hMove = this._getRandomBool();
            let upLeft = this._getRandomBool();

            if (!hMove && !upLeft) {
                y = nullY;
                x = nullX - 1;
            }
            if (hMove && !upLeft) {
                x = nullX;
                y = nullY + 1;
            }
            if (!hMove && upLeft) {
                y = nullY;
                x = nullX + 1;
            }
            if (hMove && upLeft) {
                x = nullX;
                y = nullY - 1;
            }

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

    _put(cell, top, left, CELL_SIZE) {
        cell.x = left * CELL_SIZE;
        cell.y = top * CELL_SIZE;

        cell.left = left;
        cell.top = top;
    }

    _isWrongBlock(cell) {
        const leftSubtraction = Math.abs(this.emptyCell.left - cell.left);
        const topSubtractions = Math.abs(this.emptyCell.top - cell.top);

        return leftSubtraction + topSubtractions > 1
    }

    _move(cell) { // используется для передвижения блоков рукой игрока
        if (this._isWrongBlock(cell)) return;

        Ease.ease.add(cell, {
            x: this.emptyCell.left * this.cellSize,
            y: this.emptyCell.top * this.cellSize
        }, {duration: 1000});

        const tempLeft = this.emptyCell.left;
        const tempTop = this.emptyCell.top;

        this.emptyCell.left = cell.left;
        this.emptyCell.top = cell.top;
        cell.left = tempLeft;
        cell.top = tempTop;

        this._win();
    }

    _createCells(i, left, top) {
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

    _win() {
        const isFinished = this.cells.every(cell => {
            if (!cell.index) return true;
            return cell.index === cell.top * 4 + cell.left + 1; // добавляем 1, так как вычисляем индексы, которые начинаются с 0
        });

        if (isFinished) alert("You win!")
    }

    _shuffle(x, y) { // используется для начального расставления блоков через двумерный массив arr
        let nullX = this._getNullCell().left;
        let nullY = this._getNullCell().top;

        this.arr[nullY][nullX] = this.arr[y][x];
        this.arr[y][x] = 0;

        this.emptyCell.left = x;
        this.emptyCell.top = y;
    }

    _getNullCell() {
        return this.emptyCell;
    }

    _getRandomBool() { // _
        if (Math.floor(Math.random() * 2) === 0) {
            return true; // функция возращает true, в обратном случае возвращает undefined, что является ложным значением
        }
    }

    gameRestart(id) {
        const restartButton = document.getElementById(id);
        restartButton.addEventListener('click', () => {
            console.log(this);

            this.cells.map(cell => {
                this.app.stage.removeChild(cell);
            });

            this.createBlocks();
            this.mix(20);
            this.placeBlocks();
        });
    }
}

const puzzleGame15 = new PuzzleGame(200, 800, 800, '.field');
puzzleGame15.createArea();
puzzleGame15.createBlocks();
puzzleGame15.mix(20);
puzzleGame15.placeBlocks();
puzzleGame15.gameRestart('restartButton');