import * as admin from 'firebase-admin';

export /*bundle*/ class User {
	#accessToken: string;
	constructor(accessToken: string) {
		this.#accessToken = accessToken;
	}

	#valid: boolean;
	get valid() {
		return this.#valid;
	}

	#uid: string;
	get uid() {
		return this.#uid;
	}

	#name: string;
	get name() {
		return this.#name;
	}

	#email: {
		account?: string;
		verified?: boolean;
	} = {};
	get email() {
		return this.#email;
	}

	async validate() {
		//const decodedToken = { uid: '1', name: '', email: '', email_verified: true };
		const decodedToken = await admin.auth().verifyIdToken(this.#accessToken);

		try {
			// Access token is valid, and 'decodedToken' contains information about the user
			// You can access user information with 'decodedToken.uid' or other claims
			const { uid, name, email, email_verified } = decodedToken;

			this.#uid = uid;
			this.#name = name;
			this.#email.account = email;
			this.#email.verified = email_verified;

			this.#valid = true;
		} catch (error) {
			this.#valid = false;
		}
	}
}
