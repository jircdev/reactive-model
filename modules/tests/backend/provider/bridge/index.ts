import { UserStore } from "@beyond-js/reactive/tests/backend/database";
import { Server, Socket } from "socket.io";

export /*actions*/ /*bundle*/ class UserProvider {
	socket: Server;
	constructor(socket: Server) {
		this.socket = socket;
	}
	async save(data) {
		try {
			const user = new UserStore();
			await user.storeUser(data);
			return { status: true };
		} catch (e) {
			return { error: true, message: e.message };
		}
	}

	async load({ id }) {
		try {
			const user = new UserStore();
			const data = await user.loadUser(id);
			console.log(20, data);
			return { status: true, data };
		} catch (e) {
			return { error: true, message: e.message };
		}
	}

	async loadAll() {
		try {
			const user = new UserStore();
			const data = await user.loadAll();
			return { status: true, data };
		} catch (e) {
			return { error: true, message: e.message };
		}
	}

	send() {
		this.socket.emit("user", { name: "algo" });
	}
}
