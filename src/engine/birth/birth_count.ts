import BirthEmpty from "./birth_empty";
import Birth from "./birth";
import BirthAdapter from "./birth_adapter";
import Item from "../item/item";

export default class BirthCount extends BirthAdapter {
	constructor(private size: number, private birth: Birth, private defaultBirth: Birth) {
		super();
	}

	getSize(): number {
		return this.size;
	}

	private getBirth(): Birth {
		let birth: Birth = this.birth;
		if (birth == null || this.size < 0) {
			birth = this.defaultBirth;
		}
		if (birth == null) {
			birth = BirthEmpty.getEmpty();
		}
		return birth;
	}

	getItem(): Item {
		return this.getBirth().getItem();
	}

	popItem(): Item {
		this.size--;
		return this.getBirth().popItem();
	}
}
