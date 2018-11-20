import Item from "../item";
import ItemOwner from "../item_owner";
import Puzzle from "../../render/puzzle";
import Atom from "../../render/atom";
import AtomImage from "../../render/atom/atom_image";
import Coordinate from "../../concept/coordinate";
import EventMove from "../../render/event/event_move";
import EventFromSetter from "../../render/event/event_from_setter";

export default abstract class ItemAdapter implements Item {
	static readonly DrawCoefficient = new Coordinate(0.85, 0.7);
	static readonly DrawStart = Coordinate.UNIT.offset(ItemAdapter.DrawCoefficient.negative()).swell(Coordinate.HALF);
	static readonly DrawImageSize = Coordinate.UNIT.swell(ItemAdapter.DrawCoefficient);

	constructor() {
		this.puzzle = new Puzzle();
		this.puzzle.setSize(Coordinate.UNIT);
		this.atom = new AtomImage(this.getImageId(), ItemAdapter.DrawImageSize, Coordinate.ORIGIN);
		this.puzzle.addAtom(this.atom, ItemAdapter.DrawStart, 0);
	}

	protected owner: ItemOwner;

	private puzzle: Puzzle;

	private atom: Atom;

	setOwner(owner: ItemOwner) {
		this.owner = owner;
	}

	abstract equals(item: Item): boolean;
	abstract canPolymerize(): boolean;

	moved(offset: Coordinate, timeCost: number): void {
		let fromSetter: EventFromSetter = new EventFromSetter(offset.negative());
		this.atom.setEvent(fromSetter);

		let move: EventMove = new EventMove(Coordinate.ORIGIN, timeCost);
		this.atom.setEvent(move);
	}

	abstract polymerizedAsOwner(size: number, onEnd: () => void): void;
	abstract polymerizedAsGuest(onEnd: () => void): void;
	abstract exploded(onEnd: () => void): void;
	abstract scraped(onEnd: () => void): void;
	abstract clicked(onEnd: () => void): void;

	cleared(onEnd: () => void) {
		if (this.owner != null) {
			this.owner.clearMe(onEnd);
		}
	}

	getPuzzle(): Puzzle {
		return this.puzzle;
	}
	abstract getImageId(): number;
}
