var CryptoJS = require("crypto-js");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../env/.env.dev") });

// function decrypt(str) {
//     const enc = Buffer.from(str, 'base64').toString('ascii');
//     let bytes = CryptoJS.AES.decrypt(enc, 'uw0ngs4b4r');
//     let text = bytes.toString(CryptoJS.enc.Utf8);
//     return text;
// }
// module.exports = { decrypt };

exports.decrypt = (str) => {
    const enc = Buffer.from(str, 'base64').toString('ascii');
    let bytes = CryptoJS.AES.decrypt(enc, '$ud$h8i4sa');
    let text = bytes.toString(CryptoJS.enc.Utf8);
    return text;
}