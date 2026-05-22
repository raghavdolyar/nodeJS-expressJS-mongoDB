const fs = require('fs').promises;
const path = require('path');
const rootDir = require('../utils/path-util');

const homeDBPath = path.join(rootDir, 'database/homes.json');

module.exports = class Home {
	constructor(name, location, price, rating, photoUrl) {
		this.name = name;
		this.location = location;
		this.price = price;
		this.rating = rating;
		this.photoUrl = photoUrl;
	}

	async save() {
		const homes = await Home.fetchAll();
		if (this.id) {
			const index = homes.findIndex(home => home.id === this.id);
			if (index !== -1) {
				homes[index] = this;
			}
		} else {
			this.id = (homes.length + 1).toString();
			homes.push(this);
		}
		await fs.writeFile(homeDBPath, JSON.stringify(homes));
	}

	static async fetchAll() {
		try {
			const data = await fs.readFile(homeDBPath, 'utf-8');
			return data.length ? JSON.parse(data) : [];
		} catch (err) {
			if (err.code === 'ENOENT') {
				return [];
			}
			throw err;
		}
	}

	static async findById(homeId) {
		const homes = await this.fetchAll();
		return homes.find(home => home.id === homeId);
	}
};
