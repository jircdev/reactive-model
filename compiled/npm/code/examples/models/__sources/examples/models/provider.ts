export class ExternalProvider {
	database = new Map();
	time = 1000; // Time in milliseconds for setTimeout

	constructor() {
		// Add 5 hardcoded users to the database map
		for (let i = 1; i <= 5; i++) {
			this.database.set(i, {
				id: i,
				name: `User ${i}`,
				age: 20 + i,
			});
		}
	}

	load(id) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				const data = this.database.get(id);
				if (data) {
					resolve(data);
				} else {
					reject(new Error("User not found"));
				}
			}, this.time);
		});
	}

	

	publish(id, data) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (this.database.has(id)) {
					this.database.set(id, data);
					resolve(data);
				} else {
					reject(new Error("User not found"));
				}
			}, this.time);
		});
	}
}
