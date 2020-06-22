const CELL_SIZE = 200;
const emptyCell = {
    left: 0,
    top: 0
};

let arr = [
    [1,2,3,4],
    [5,6,7,8],
    [9,10,11,12],
    [13,14,15,0]
];

const cells = [];
cells.push(emptyCell);

const app = new PIXI.Application(
    {
        width: 800,
        height: 800,
        backgroundColor: 0xAAAAAA
    }
);

document.querySelector('.field').appendChild(app.view);

function positioning(cell, top, left, CELL_SIZE) {
    cell.x = left * CELL_SIZE;
    cell.y = top * CELL_SIZE;
    cell.left = left;
    cell.top = top;
}

function isWrongBlock(cell) {
    const leftSubtraction = Math.abs(emptyCell.left - cell.left);
    const topSubtractions = Math.abs(emptyCell.top - cell.top);

    return leftSubtraction + topSubtractions > 1
}

function moving(cell) {
    if (isWrongBlock(cell)) return;

    Ease.ease.add(cell,{x: emptyCell.left * CELL_SIZE, y: emptyCell.top * CELL_SIZE}, { duration: 1000 } );

    const tempLeft = emptyCell.left;
    const tempTop = emptyCell.top;

    emptyCell.left = cell.left;
    emptyCell.top = cell.top;
    cell.left = tempLeft;
    cell.top = tempTop;

    win();
}

function createCells(i, left, top) {
    if (i === 0) return;

    let cell = new PIXI.Sprite.from(`images/${i}.png`);
    positioning(cell, top, left, CELL_SIZE);
    app.stage.addChild(cell);

    cell.interactive = true;
    cell.buttonMode = true;
    cell.index = i;

    cell.on("pointerup", () => {
        moving(cell);
    });

    cells.push(cell);
}

function win() {
    const isFinished = cells.every(cell => {
            if (!cell.index) return true;
        return cell.index === cell.top*4 + cell.left + 1;
    });
    console.log(isFinished);

    if (isFinished) alert("You win!")
}

function move(x, y) {
    let nullX = this.getNullCell().x; // положение по х пустой ячейки
    let nullY = this.getNullCell().y; // положение по у пустой ячейки
    if (
        ((x - 1 == nullX || x + 1 == nullX) && y == nullY)
        || ((y - 1 == nullY || y + 1 == nullY) && x == nullX)
    ) {
        arr[nullY][nullX] = arr[y][x];
        arr[y][x] = 0;
    }
}

function getNullCell(){
    for (let i = 0; i<4; i++){
        for (let j=0; j<4; j++){
            if(arr[j][i] === 0){
                emptyCell.left = i;
                emptyCell.top = j;

                return {'x': i, 'y': j};
            }
        }
    }
}

function mix(stepCount) {
    console.log(stepCount);
    let x,y;
    for (let i = 0; i < stepCount; i++) {
        let nullX = this.getNullCell().x; // положение пустой клетки по х
        let nullY = this.getNullCell().y; // положение пустой клетки по у
        let hMove = getRandomBool(); // какая то рандомная штука тру или фолс
        let upLeft = getRandomBool(); // какая то рандомная штука тру или фолс
        if (!hMove && !upLeft) { y = nullY; x = nullX - 1;}
        if (hMove && !upLeft)  { x = nullX; y = nullY + 1;}
        if (!hMove && upLeft)  { y = nullY; x = nullX + 1;}
        if (hMove && upLeft)   { x = nullX; y = nullY - 1;}
        if (0 <= x && x <= 3 && 0 <= y && y <= 3) {
            move(x, y);
        }
    }
}

function getRandomBool() {
    if (Math.floor(Math.random() * 2) === 0) {
        return true;
    }
}

mix(20);
getNullCell();

let numbers = arr.flat();

numbers.map((num, index) => {
    const left = index % 4;
    const top = (index - left) / 4;

    createCells(num, left, top);
});

// refactor and features, the first feature is levels