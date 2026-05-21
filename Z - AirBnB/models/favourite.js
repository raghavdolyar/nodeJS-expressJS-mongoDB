const fs = require('fs').promises;
const path = require('path');
const rootDir = require('../utils/path-util');

const favouriteDBPath = path.join(rootDir, 'database/favourite.json');

module.exports = class Favourite {
	static async addToFavourite(homeId) {
		const favourites = await this.getFavourites();
		if (!favourites.includes(homeId)) {
			favourites.push(homeId);
			await fs.writeFile(favouriteDBPath, JSON.stringify(favourites));
		}
	}

	static async removeFromFavourite(homeId) {
		const favourites = await this.getFavourites();
		if (favourites.includes(homeId)) {
			const updated = favourites.filter(id => id !== homeId);
			await fs.writeFile(favouriteDBPath, JSON.stringify(updated));
		}
	}

	static async getFavourites() {
		try {
			const data = await fs.readFile(favouriteDBPath, 'utf-8');
			return data.length ? JSON.parse(data) : [];
		} catch (err) {
			if (err.code === 'ENOENT') {
				return [];
			}
			throw err;
		}
	}
};
