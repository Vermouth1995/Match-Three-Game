import Puzzle from "../render/puzzle";
import Coordinate from "../concept/coordinate/coordinate";

export default interface PuzzleKeeper {
	getPuzzle(): Puzzle;
	resizePuzzle(size: Coordinate): void;
}
