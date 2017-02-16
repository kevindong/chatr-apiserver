const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.get('*', (req, res) => {
	res.send('Hello from the dev api server!');
});

app.listen(port, () => {
	console.log(`Api server listening on port ${port}`);
});
