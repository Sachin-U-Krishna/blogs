const bcrypt = require('bcrypt');
const crypto = require('crypto')
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

const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
const IV_LENGTH = 16;

const cryptoEncrypt = (text) => {
	text = String(text)
	let iv = crypto.randomBytes(IV_LENGTH);
	let cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
	let encrypted = cipher.update(text);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return iv.toString('hex') + ':' + encrypted.toString('hex');
}

const cryptoDecrypt = (text) => {
	try {

		let textParts = text.split(':');
		let iv = Buffer.from(textParts.shift(), 'hex');
		let encryptedText = Buffer.from(textParts.join(':'), 'hex');
		let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
		let decrypted = decipher.update(encryptedText);
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		return decrypted.toString();
	}
	catch(err){
		return false
	}
}

module.exports = { encode, decode, cryptoEncrypt, cryptoDecrypt };