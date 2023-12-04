const bcrypt = require('bcrypt');
const saltRounds = 10;

const encode = (pass) => {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(saltRounds, (err, salt) => {
			if (err) {
				reject(err);
			} else {
				bcrypt.hash(pass, salt, (err, hash) => {
					if (err) {
						reject(err);
					} else {
						resolve(hash);
					}
				});
			}
		});
	});
}

const decode = (plainpass, hashpass) => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(plainpass, hashpass, (err, result) => {
			if (err) {
				reject(err);
			}

			if (result) {
				resolve(true)
			} else {
				resolve(false)
			}
		});
	})
}

module.exports = { encode, decode };