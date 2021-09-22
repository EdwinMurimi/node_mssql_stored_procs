const bcrypt = require("bcryptjs");
const { v1: uuid } = require('uuid');
const jwt = require("jsonwebtoken");
const _ = require('lodash');

const db = require('../database');
const encryptPassword = require('../helpers');

const signUpHandler = async (req, res) => {
  const developerID = uuid();
  const { name, email, rank } = req.body;
  const password = await encryptPassword(req.body.password);
  let user = {developerID, name, email, rank, password};
  const sql = `INSERT INTO developers SET ?`;
  connection.query(sql, user, (error, result) => {
    if(error) return res.status(400).json({ message: "Email already registered" });
    return res.status(200).json({ message: "User registered successfully" });
  })
}

const signInHandler = async (req, res) => {
  
  const { email, password } = req.body;

  const sql = `SELECT * FROM developers WHERE email = ?`;

  connection.query(sql, [email], async (error, result) => {
    if(error) return res.status(400).json({ message: "Email does not exist" });
    const user = result[0];
    if(user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if(validPassword) {
        const response = _.pick(user, [
            "developerID",
            "name",
            "email",
            "rank"
          ]
        )

        jwt.sign({response}, 'secretkey', (error, token) => {
          return res
            .status(200)
            .json({token});
        });      
      } else {
        return res.status(400).json({ message: "Invalid Password" });
      }
    } else {
      return res.status(401).json({ message: "User does not exist" });
    }
  })
}

const getUsersHandler = async (req, res) => {

  const { recordset } = await db.query(`SELECT * FROM dbo.allUsers;`);
  console.log(recordset);
  res.send({ recordset });

}

const putUsersHandler = async (req, res) => {

}

const deleteUsersHandler = async (req, res) => {

}

const forgotPasswordHandler = async (req, res) => {

}

const normalToSupervisorHandler = async (req, res) => {

  const { id } = req.body;

  try{

    const result = await db.execute(`dbo.upgradeNormalUserToSupervisor`, { id });
    res.status(200).send({ message: 'User upgrade successful' });

  } catch(error) {
    
    res.status(500).send({ message: "Internal Server Error" });

  }

}

const supervisorToAdminHandler = async (req, res) => {

  const { id } = req.body;

  try{

    const result = await db.execute(`dbo.upgradeSupervisorUserToAdmin`, { id });
    res.status(200).send({ message: 'User upgrade successful' });

  } catch(error) {
    
    res.status(500).send({ message: "Internal Server Error" });

  }
  
}

const adminToSupervisorHandler = async (req, res) => {
  
}

const supervisorToNormalHandler = async (req, res) => {
  
}

module.exports = {
  signInHandler,
  signUpHandler,
  getUsersHandler,
  putUsersHandler,
  deleteUsersHandler,
  forgotPasswordHandler,
  normalToSupervisorHandler,
  supervisorToAdminHandler,
  adminToSupervisorHandler,
  supervisorToNormalHandler
}