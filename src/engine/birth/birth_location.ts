import BirthAdapter from "./birth_adapter";
import BirthEmpty from "./birth_empty";
import Birth from "../birth/birth";
import Coordinate from "../../concept/coordinate";
import Item from "../item/item";

export default class BirthLocation extends BirthAdapter {
	constructor(private defaultBirth: Birth) {
		super();
	}

	private births: Birth[] = [];

	private locations: Coordinate[] = [];

	addLocation(location: Coordinate, birth: Birth) {
		this.locations.push(location);
		this.births.push(birth);
	}

	private getBirth(location: Coordinate): Birth {
		let birth: Birth = this.defaultBirth;
		for (let i = 0; i < this.locations.length; i++) {
			if (location.equal(this.locations[i])) {
				birth = this.births[i];
				break;
			}
		}
		if (birth == null) {
			birth = BirthEmpty.getEmpty();
		}
		return birth;
	}

	getItem(location: Coordinate): Item {
		return this.getBirth(location).getItem(location);
	}

	popItem(location: Coordinate): Item {
		return this.getBirth(location).popItem(location);
	}
}