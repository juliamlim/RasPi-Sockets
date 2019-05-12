const app = require('express')();
const http = require('http').Server(app);

const io = require('socket.io')(http);

const port = 3000;

const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
const LED = {
	UP: 	new Gpio(26, 'out'),
	DOWN: 	new Gpio(17, 'out'),
	LEFT: 	new Gpio(27, 'out'),
	RIGHT:	new Gpio(22, 'out')
};

http.listen(port);

// Set template engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => { res.render('index'); });

io.on('connection', socket => {

	console.log('it connected');

	socket.on('light', (data = {}) => {
		const light = LED[data.color].readSync();
		
		if (data.on != light) {
			LED[data.color].writeSync(data.on);
		}
	});
});

process.on('SIGINT', function () { //on ctrl+c
	Object.keys(LED).forEach(l => {
		LED[l].writeSync(0);
		LED[l].unexport();
	});

	process.exit();
});
