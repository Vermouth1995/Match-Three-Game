import Render from "../render/render";

import Message from "./message";
import Level from "./level";
import LevelCreator from "./level_creator";

import Coordinate from "../concept/coordinate";
import Locus from "../concept/locus";
import Once from "../concept/once/once";
import OnceLast from "../concept/once/once_last";

export default class Game {
	static readonly RENDER_SIZE = new Coordinate(10, 20);

	static readonly PUZZLE_LEVEL_Z_INDEX = 1;
	static readonly PUZZLE_MESSAGE_Z_INDEX = 1000;

	private levelIndex: number = 1;

	private message: Message;

	constructor(private render: Render) {
		this.message = new Message(Game.RENDER_SIZE);
		this.render
			.getRootPuzzle()
			.addChild(this.message.getPuzzle(), new Locus(Coordinate.ORIGIN), Game.PUZZLE_MESSAGE_Z_INDEX);
	}

	private level: Level;

	startLevel(type: string, index: string, onEnd: (success: boolean) => void) {
		this.render.clear();
		this.level = new Level(index, Game.RENDER_SIZE, LevelCreator.getLevel(type, index));
		this.render
			.getRootPuzzle()
			.addChild(this.level.getPuzzle(), new Locus(Coordinate.ORIGIN), Game.PUZZLE_LEVEL_Z_INDEX);
		this.level.onEnd.on(onEnd);
	}

	closeLevel() {
		if (this.level != null) {
			this.render.getRootPuzzle().removeChild(this.level.getPuzzle());
			this.level = null;
		}
	}

	start(onError: (error: Error) => void) {
		Game.LoadStaticResource(
			this.render,
			() => {
				this.message.init();
				this.render.start();
				let levelEnd = (success: boolean) => {
					this.message.setText(success ? "Congratulations!" : "Sorry!");
					this.message.show(() => {
						setTimeout(() => {
							this.message.hide(() => {
								this.closeLevel();
								this.startLevel(LevelCreator.TypeCommon, this.levelIndex.toString(), levelEnd);
							});
						}, 5000);
					});
				};
				this.startLevel(LevelCreator.TypeCommon, this.levelIndex.toString(), levelEnd);
			},
			(error: Error) => {
				onError(error);
			}
		);
	}

	close() {
		this.closeLevel();
		this.render.close();
	}

	static LoadStaticResource(render: Render, onSuccess: () => void, onError: (error: Error) => void) {
		let success: Once = new OnceLast().setCallback(onSuccess);
		LevelCreator.LoadStaticResource(render, success.getCallback(), onError);
		Message.LoadStaticResource(render, success.getCallback(), onError);
	}
}