import PuzzleKeeper from "./puzzle_keeper";
import Goal from "./goal/goal";
import BoardOn from "./board/board_on";

import CoordinateValue from "../concept/coordinate/coordinate_value";
import Coordinate from "../concept/coordinate/coordinate";
import Locus from "../concept/coordinate/locus";
import Font from "../concept/style/font";
import Color from "../concept/style/color";
import Once from "../concept/once/once";
import OnceLast from "../concept/once/once_last";
import EventLocationSetter from "../concept/coordinate/event/event_location_setter";
import EventMove from "../concept/coordinate/event/event_move";
import ListenerDiffusion from "../concept/listener/listener_diffusion";
import Listener from "../concept/listener/listener";

import AtomString from "../render/atom/atom_string";
import Puzzle from "../render/puzzle";
import Render from "../render/render";

export default class Score implements PuzzleKeeper {
	private static readonly SIZE = new CoordinateValue(5, 1.5);
	private static readonly STEP_ADD_TIME_COST_PER_STEP: number = 200;
	private static readonly LEVEL_Z_INDEX: number = 1;
	private static readonly GOAL_Z_INDEX: number = 2;
	private static readonly STEP_Z_INDEX: number = 1;
	private static readonly LEVEL_LOCATION: Coordinate = new CoordinateValue(0.75, 0.75);
	private static readonly GOAL_LOCATION: Coordinate = new CoordinateValue(1, 0.25);
	private static readonly GOAL_LOCATION_END: Coordinate = new CoordinateValue(4, 0.25);
	private static readonly STEP_LOCATION: Coordinate = new CoordinateValue(4.25, 0.75);

	private color: Color = new Color(0, 0, 0);
	private font: Font = new Font().setSize(0.5).setAlign(Font.ALIGN_CENTER);

	private step: number = 1;
	private stepRender: Locus<number> = new Locus<number>(this.step);

	private level: string = "unknown";
	private levelRender: Locus<string> = new Locus<string>(this.level.toString());

	private puzzle: Puzzle = new Puzzle();

	constructor() {
		this.puzzle.setSize(Score.SIZE);
		this.puzzle.addAtom(
			new AtomString(this.stepRender, new Locus<Color>(this.color), new Locus<Font>(this.font)),
			new Locus<Coordinate>(Score.STEP_LOCATION),
			Score.STEP_Z_INDEX
		);
		this.puzzle.addAtom(
			new AtomString(this.levelRender, new Locus<Color>(this.color), new Locus<Font>(this.font)),
			new Locus<Coordinate>(Score.LEVEL_LOCATION),
			Score.LEVEL_Z_INDEX
		);
	}

	private goals: Goal[] = [];

	addGoal(goals: Goal[]) {
		this.goals = goals;
		const successEnd: Once = new OnceLast().setCallback(() => {
			this.end(true);
		});
		this.goals.map((goal: Goal, index: number) => {
			const puzzle = goal.getPuzzle();

			this.puzzle.addChild(
				puzzle,
				new Locus<Coordinate>(
					new CoordinateValue(
						((Score.GOAL_LOCATION_END.getRow() - Score.GOAL_LOCATION.getRow()) / (this.goals.length + 1)) *
							(index + 1) +
							Score.GOAL_LOCATION.getRow() -
							puzzle.size().getRow() / 2,
						Score.GOAL_LOCATION.getCol()
					)
				),
				Score.GOAL_Z_INDEX
			);

			goal.onSuccess.on(successEnd.getCallback());
		});
	}

	private on: BoardOn;

	setOn(on: BoardOn) {
		this.on = on;
		this.on.onStep.on(() => {
			this.stepMinus();
		});
		this.on.onFallEnd.on(() => {
			if (this.step == 0) {
				this.end(false);
			}
		});
	}

	setLevel(level: string) {
		this.level = level;
		this.levelRender.setEvent(new EventLocationSetter<string>(this.level));
	}

	setStep(step: number) {
		this.step = step;
		this.stepRender.setEvent(new EventLocationSetter<number>(this.step));
	}

	private stepMinus() {
		if (this.step == 0) {
			return;
		}
		this.step--;
		this.stepRender.setEvent(new EventLocationSetter<number>(this.step));
		if (this.step == 0) {
			this.onStepEnd.trigger();
		}
	}

	stepAdd(newStep: number) {
		const finalStep: number = this.step + newStep;
		this.stepRender.setEvent(
			new EventMove<number>(
				finalStep,
				newStep * Score.STEP_ADD_TIME_COST_PER_STEP,
				true,
				(from, to, timecost, relativeTime) => Math.floor(this.step + (newStep * relativeTime) / timecost)
			)
		);
		this.step = finalStep;
	}

	private isEnd: boolean = false;

	private end(success: boolean) {
		if (this.isEnd) {
			return;
		}
		this.isEnd = true;

		this.onEnd.trigger(success);
	}
	readonly onEnd: Listener<void, (success: boolean) => void> = new ListenerDiffusion();

	readonly onStepEnd: Listener<void, () => void> = new ListenerDiffusion();
	resizePuzzle(size: Coordinate): void {}

	getPuzzle(): Puzzle {
		return this.puzzle;
	}

	static LoadStaticResource(render: Render, onSuccess: () => void, onError: (error: Error) => void) {
		onSuccess();
	}
}
