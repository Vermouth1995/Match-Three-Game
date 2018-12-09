import ItemOwner from "./item_owner";
import PuzzleKeeper from "./puzzle_keeper";

export default interface Item extends PuzzleKeeper {
	isEmpty(): boolean;
	equals(item: Item): boolean;
	canPolymerize(): boolean;

	polymerizedAsOwner(size: number, onEnd: () => void): void;
	polymerizedAsGuest(onEnd: () => void): void;
	exploded(onEnd: () => void): void;
	scraped(onEnd: () => void): void;

	clicked(onEnd: () => void): boolean;
	exchanged(onEnd: () => void): boolean;

	cleared(onEnd: () => void): void;
	created(onEnd: () => void): void;

	setOwner(owner: ItemOwner): void;
	getImageId(): number;
}
