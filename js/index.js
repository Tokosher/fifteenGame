const CELL_SIZE = 200;
const emptyCell = {
    left: 0,
    top: 0
};

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

function move(cell) {
    console.log(cell.x);
    console.log(cell.y);
    console.log(cell.top);
    console.log(cell.left);
    Ease.ease.add(cell,{x: emptyCell.left * CELL_SIZE, y: emptyCell.top * CELL_SIZE}, { duration: 1000 } );

    const tempLeft = emptyCell.left;
    const tempTop = emptyCell.top;
    emptyCell.left = cell.left;
    emptyCell.top = cell.top;
    cell.left = tempLeft;
    cell.top = tempTop;
}

function createCells(i, left, top) {
    let cell = new PIXI.Sprite.from(`images/${i}.png`);
    positioning(cell, top, left, CELL_SIZE);
    app.stage.addChild(cell);

    cell.interactive = true;
    cell.buttonMode = true;

    cell.on("pointerup", () => {
        move(cell);
    });

    cells.push(cell);
}

for (let i = 1; i <= 15; i++) {
    const left = i % 4;
    const top = (i - left) / 4;

    createCells(i, left, top);
}