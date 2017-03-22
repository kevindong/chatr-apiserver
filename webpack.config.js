module.exports = dir => {
	return {
		entry: dir + '/tmp/index.js',
		output: { filename: 'bundle.js' }
	};
};