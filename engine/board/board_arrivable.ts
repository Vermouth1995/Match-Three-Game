import Cell from "../cell";
import CellBirth from "../cell/cell_birth";
import BoardBirths from "../board/board_births";
import Coordinate from "../../concept/coordinate";
import BoardCells from "./board_cells";

export default class BoardArrivable {
	constructor(cells: BoardCells, births: BoardBirths) {
		this.cells = cells;
		this.births = births;
	}

	private cells: BoardCells;

	private births: BoardBirths;

	private arrivable: boolean[][] = [];

	isArrivable(location: Coordinate): boolean {
		return this.arrivable[location.row][location.col];
	}

	update() {
		let self: BoardArrivable = this;
		this.arrivable = [];
		for (let i = 0; i < this.cells.size().row; i++) {
			this.arrivable.push([]);
			for (let j = 0; j < this.cells.size().col; j++) {
				this.arrivable[i].push(false);
			}
		}

		this.births.iterate(function(birth: CellBirth) {
			self.updateLocation(birth.getLocation());
		});
	}

	private updateLocation(location: Coordinate) {
		let cell: Cell = this.cells.getCellByLocation(location);

		if (!cell.canRobbed()) {
			return;
		}

		this.arrivable[location.row][location.col] = true;

		this.updateLocation(location.offset(Coordinate.LEFTDOWN));
		this.updateLocation(location.offset(Coordinate.DOWN));
		this.updateLocation(location.offset(Coordinate.RIGHTDOWN));
	}
}