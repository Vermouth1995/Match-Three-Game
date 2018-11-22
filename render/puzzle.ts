import Locus from "../concept/locus";
import Coordinate from "../concept/coordinate";
import Atom from "./atom";
import LinkedList from "../concept/linked_list/linked_list";
import RenderPosition from "./render_position";
import RenderLocus from "./render_locus";

export default class Puzzle {
	private locationEventListener: { [key: number]: (location: Coordinate) => boolean } = {};

	private triggerLocationEvent(eventName: number, location: Coordinate, timeStamp: number): void {
		let listener: (location: Coordinate) => boolean = this.locationEventListener[eventName];
		let isContinue: boolean = true;
		if (listener != null) {
			isContinue = listener(location);
		}
		if (!isContinue) {
			return;
		}

		let child: RenderPosition<Puzzle> = this.triggerChild(location, timeStamp);
		if (child == null) {
			return;
		}
		child.data.triggerLocationEvent(eventName, location.offset(child.location.negative()), timeStamp);
	}

	private onLocationEvent(eventName: number, clickListener: (location: Coordinate) => boolean) {
		this.locationEventListener[eventName] = clickListener;
	}

	private static readonly MouseDown: number = 1;
	private static readonly MouseUp: number = 2;
	private static readonly MouseMove: number = 3;

	triggerMouseDown(location: Coordinate, timeStamp: number): void {
		this.triggerLocationEvent(Puzzle.MouseDown, location, timeStamp);
	}

	onMouseDown(clickListener: (location: Coordinate) => boolean) {
		this.onLocationEvent(Puzzle.MouseDown, clickListener);
	}

	triggerMouseUp(location: Coordinate, timeStamp: number): void {
		this.triggerLocationEvent(Puzzle.MouseUp, location, timeStamp);
	}

	onMouseUp(clickListener: (location: Coordinate) => boolean) {
		this.onLocationEvent(Puzzle.MouseUp, clickListener);
	}

	triggerMouseMove(location: Coordinate, timeStamp: number): void {
		this.triggerLocationEvent(Puzzle.MouseMove, location, timeStamp);
	}

	onMouseMove(clickListener: (location: Coordinate) => boolean) {
		this.onLocationEvent(Puzzle.MouseMove, clickListener);
	}

	children(): LinkedList<RenderLocus<Puzzle>> {
		return this.puzzles;
	}

	allAtoms(): LinkedList<RenderLocus<Atom>> {
		return this.atoms;
	}

	protected atoms: LinkedList<RenderLocus<Atom>> = new LinkedList<RenderLocus<Atom>>();

	addAtom(atom: Atom, locus: Locus, zIndex: number) {
		if (atom == null) {
			return;
		}
		this.atoms.insertBy(new RenderLocus<Atom>(atom, locus, zIndex), function(now: RenderLocus<Atom>): boolean {
			return zIndex < now.zIndex;
		});
	}
	removeAtom(atom: Atom) {
		if (atom == null) {
			return;
		}
		this.atoms.removeBy(function(now: RenderLocus<Atom>): boolean {
			return atom == now.data;
		});
	}

	private puzzles: LinkedList<RenderLocus<Puzzle>> = new LinkedList<RenderLocus<Puzzle>>();

	private triggerChild(location: Coordinate, timestamp: number): RenderPosition<Puzzle> {
		let active: RenderPosition<Puzzle> = null;
		this.puzzles.iterate(function(index: number, now: RenderLocus<Puzzle>) {
			let postion: RenderPosition<Puzzle> = now.getPostion(timestamp);
			if (location.isIn(postion.location, postion.location.offset(now.data.size()))) {
				active = postion;
			}
		});
		return active;
	}

	addChild(puzzle: Puzzle, locus: Locus, zIndex: number) {
		if (puzzle == null) {
			return;
		}
		this.puzzles.insertBy(new RenderLocus<Puzzle>(puzzle, locus, zIndex), function(
			now: RenderLocus<Puzzle>
		): boolean {
			return zIndex < now.zIndex;
		});
	}

	removeChild(puzzle: Puzzle) {
		if (puzzle == null) {
			return;
		}
		this.puzzles.removeBy(function(now: RenderLocus<Puzzle>): boolean {
			return puzzle == now.data;
		});
	}

	private renderSize: Coordinate = Coordinate.ORIGIN;

	setSize(size: Coordinate) {
		this.renderSize = size;
	}

	size(): Coordinate {
		return this.renderSize;
	}

	payAtoms(timeStamp: number, baseIndex: number, baseLocation: Coordinate, atoms: RenderPosition<Atom>[]) {
		this.atoms.iterate(function(index: number, now: RenderLocus<Atom>) {
			let postion: RenderPosition<Atom> = now
				.getPostion(timeStamp)
				.offsetLocation(baseLocation)
				.offsetZIndex(baseIndex);
			atoms.push(postion);
		});
		this.puzzles.iterate(function(index: number, now: RenderLocus<Puzzle>) {
			let postion: RenderPosition<Puzzle> = now
				.getPostion(timeStamp)
				.offsetLocation(baseLocation)
				.offsetZIndex(baseIndex);
			now.data.payAtoms(timeStamp, postion.zIndex, postion.location, atoms);
		});
	}
}
