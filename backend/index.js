const express = require('express');
const cors = require('cors');
const db = require('./database/db');

const app = express();

app.use(cors());
app.use(express.json());


// połączenie z bazą danych
db.sequelize.authenticate()
.then(() => {
	console.log('Connection with DB has been established successfully.');
})
.catch(err => {
	console.error('Unable to connect to the database:', err);
});


app.get('/', (req, res) => {
	res.send('Backend server working...');
})

app.use('/users', require('./routes/users'));
app.use('/orders', require('./routes/orders'));
app.use('/statuses', require('./routes/statuses'));


app.listen(5000, () => {
	console.log('Backend server listening on port 5000')	
});