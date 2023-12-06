const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Credit@123',
  database: 'safestart'
});

app.use(bodyParser.json());

app.get('/employee', (req, res) => {
  
      res.status(200);
      res.json({message: 'Employee list'});
});
  

app.get('/employeelist', (req, res) => {
  con.query("SELECT empname, empdesignation, salary, age, empcode FROM employee", function (err, result, fields) {
    if (err) {
      throw err;
    }

    res.status(200);
    res.json(result);

  });
});


app.get('/employeeAgeBasedSalary', (req, res) => {
    con.query("SELECT age, AVG(salary) AS average_salary FROM employee GROUP BY age", function (err, result, fields) {
      if (err) {
        throw err;
      }
  
      res.status(200);
      res.json(result); 
  
    });
});


app.get('/employee/:value/salary', (req, res) => {
    var queryType = req.params.value;
    const sqlQuery = `SELECT ${queryType}(salary) AS result_salary FROM employee`;

    con.query(sqlQuery, function (err, result, fields) {
      if (err) {
        throw err;
      }
  
      res.status(200);
      res.json(result);
  
    });
});
  

app.post('/insertOrUpdateEmployee', (req, res) => {
    const { empname, empdesignation, salary, age, empcode } = req.body;
  
    // Check if empcode already exists
    const selectQuery = "SELECT id FROM employee WHERE empcode = ?";
    con.query(selectQuery, [empcode], function (err, result) {
      if (err) {
        throw err;
      }
  
      if (result.length > 0) {
        // Record with empcode exists, perform update
        const updateQuery = "UPDATE employee SET empname = ?, empdesignation = ?, salary = ?, age = ? WHERE empcode = ?";
        const updateValues = [empname, empdesignation, salary, age, empcode];
  
        con.query(updateQuery, updateValues, function (err, updateResult) {
          if (err) {
            throw err;
          }
  
          console.log(`Employee details updated for empcode: ${empcode}`);
          res.status(200).send(`Employee details updated for empcode: ${empcode}`);
        });
      } else {
        // Record with empcode does not exist, perform insert
        const { empname, empdesignation, salary, age, empcode } = req.body;
  
        const insertQuery = "INSERT INTO employee (empname, empdesignation, salary, age) VALUES (?, ?, ?, ?)";
        const values = [empname, empdesignation, salary, age];
        con.query(insertQuery, values, function (err, result) {
            if (err) {
                throw err;
            }
            const insertedId = result.insertId;
            const updateQuery = "UPDATE employee SET empcode = ? WHERE id = ?";
            const values = [empcode, insertedId];
            con.query(updateQuery, values, function (err, result) {
                if (err) {
                throw err;
                }
            
                res.status(200).send(`Employee details updated`);
            });
        });
      }
    });
 });
  
  
app.listen(8080, () => {
  console.log('Server is running : 8080');
});
