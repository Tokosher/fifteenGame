const COUNT_BLOCKS_IN_GAME = 16;
class PuzzleGame {
    constructor(cellSize, appWidth, appHeight, target, idRestartButton) {
        this.cellSize = cellSize;
        this.appWidth = appWidth;
        this.appHeight = appHeight;
        this.target = target;
        this.mixCount = 20; // default

        this.state = {
            process: 'game' // необходимо для понимания: создавать карту или нет
        };

        this._activateButtons(idRestartButton);
    }

    createArea() {
        this.state.process = 'game';

        this.app = new PIXI.Application(
            {
                width: this.appWidth,
                height: this.appHeight,
                backgroundColor: 0xAAAAAA
            }
        );

        $(this.target).append(this.app.view);
    }

    createBlocks() {
        this.arr = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 0] // 0 - позиция пустого блока
        ];

        this.emptyCell = { // нумерация с 0
            left: 3,
            top: 3
        };

        this.cells = [];
        this.cells.push(this.emptyCell);
    }

    mix() {
        let x, y;
        console.log(this.mixCount);
        for (let i = 0; i < this.mixCount; i++) {
            const { left: nullX, top: nullY } = this.emptyCell;

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

    gameRestart() {
        this._removeBlocks();

        this.createBlocks();
        this.mix(20);
        this.placeBlocks();
    }

    placeBlocks() {
        let numbers = this.arr.flat();

        numbers.map((num, index) => {
            const left = index % 4;
            const top = (index - left) / 4;

            this._createCells(num, left, top);
        });
    }

    _removeBlocks(delay, step) {
        for (let cell of this.cells) {
            setTimeout(() => {
                console.log(4);
                this.app.stage.removeChild(cell);
            }, delay);
            delay += step;
        }
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

    _removeArea() {
        this.app.destroy({ texture:true, baseTexture:true });
    }

    _win() {
        const isFinished = this.cells.every(cell => {
            if (!cell.index) return true;
            return cell.index === cell.top * 4 + cell.left + 1; // добавляем 1, так как вычисляем индексы, которые начинаются с 0
        });

        if (isFinished) {
            this.state.process = 'win';
            console.log(this.state.process);

            let delay = 50;
            let step = 30;
            this._removeBlocks(delay, step);

            setTimeout(() => {
                this._removeArea();
                $(this.target).html("This game is yours");
            }, delay + step * COUNT_BLOCKS_IN_GAME);
        }
    }

    _shuffle(x, y) { // используется для начального расставления блоков через двумерный массив arr

        const { left: nullX, top: nullY } = this.emptyCell;

        this.arr[nullY][nullX] = this.arr[y][x];
        this.arr[y][x] = 0;

        this.emptyCell.left = x;
        this.emptyCell.top = y;
    }

    _getRandomBool() { // _
        if (Math.floor(Math.random() * 2) === 0) {
            return true; // функция возращает true, в обратном случае возвращает undefined, что является ложным значением
        }
    }

    _addLevelOfDifficult(className) {
        switch (className) {
            case 'beginnerButton':
                this.mixCount = 25;
                break;
            case 'easyButton':
                this.mixCount = 50;
                break;
            case 'mediumButton':
                this.mixCount = 100;
                break;
            case 'hardButton':
                this.mixCount = 300;
                break;
        }

        this.gameRestart();
    }

    _activateButtons(id) {
        $(id).click(() => {
            if (this.state.process === 'win') {
                console.log('WIN');
                $(this.target).html('');
                this.createArea();

                this.state.process = 'game';
            }

            this.gameRestart();
        });

        const levelButtons = $('.levels button');

        for (let button of levelButtons) {
            button.addEventListener('click', () => {
                if (this.state.process === 'win') {
                    console.log('WIN');
                    $(this.target).html('');
                    this.createArea();

                    this.state.process = 'game';
                }

                for (let button of levelButtons) {
                    button.classList.remove('active', 'border-dark', 'disabled'); // убираем active class с текущей кнопки
                }

                this._addLevelOfDifficult(button.classList[0]);
                button.classList.add('active', 'border-dark', 'disabled'); // добавляем к нажатой кнопке active class

                console.log(this);
                console.log(this.state.process);
            })
        }
    }
}

const puzzleGame15 = new PuzzleGame(200, 800, 800, '.field', '#restartButton');

puzzleGame15.createArea();
puzzleGame15.createBlocks();
puzzleGame15.mix();
puzzleGame15.placeBlocks();

// добавить к гейм рестарт массив из имя и микс