const express = require("express");
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 2000;

const connection = mysql.createConnection({
	host : 'localhost',
    user : 'root',
	password: '',
    database : 'college'
});

connection.connect(function(error){
	if(error)
	{
		throw error;
	}
	else
	{
		console.log('MySQL Database is connected Successfully');
	}
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get("/",function(req, resp) {
    resp.sendFile(__dirname + "/index.html");
});

app.post('/verify',(req, res) => {
    const collegeId = req.body.collegeId;

    const sql ='SELECT * FROM colleges WHERE college_id= ?';

    connection.query(sql, [collegeId], (err, result) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }    
        if (result.length == 0) {
          res.status(404).json({ error: 'collegeId not found' });
        } else {
          res.status(200).json(result[0]);
        }
      });
    });

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
