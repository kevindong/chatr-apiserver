const os = require('os');
module.exports = {
	entry: os.tmpdir() + '/index.js',
	output: {path: os.tmpdir(), filename: 'bundle.js'}
};