import Cell from "../cell";
import Item from "../item";
import CellOwner from "../cell_owner";

export default abstract class CellAdapter implements Cell {
	constructor() {}
	protected owner: CellOwner;
	setOwner(owner: CellOwner) {
		this.owner = owner;
	}
	abstract rob(victims: Cell[], onEnd: () => void): boolean;
	abstract getItem(): Item;
	abstract setItem(item: Item);
	abstract canRobbed(): boolean;
	abstract canExchange(): boolean;

	abstract polymerizedAsOwner(size: number,onEnd: () => void);
	abstract polymerizedAsGuest(onEnd: () => void);
	abstract exploded(onEnd: () => void);
	abstract scraped(onEnd: () => void);
	abstract exchange(to: Cell, onEnd: () => void): boolean;

	explode(size: number,onEnd: () => void) {
		this.owner.explode(this, size,onEnd);
	}
	abstract clearMe(onEnd: () => void);
}
