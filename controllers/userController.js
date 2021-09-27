const bcrypt = require("bcryptjs");
const { v1: uuid } = require('uuid');
const jwt = require("jsonwebtoken");
const _ = require('lodash');

const db = require('../database');
const encryptPassword = require('../helpers');
const sendEmail = require("../helpers/sendEmail");

const signUpHandler = async (req, res) => {
  const id = uuid();
  const { firstname, lastname, email, password  } = req.body;
  const encrypted_password = await encryptPassword(password);
  const { recordset } = await db.query(
    `
    INSERT INTO [dbo].[normal_users]
           ([id]
           ,[firstname]
           ,[lastname]
           ,[email]
           ,[password])
     VALUES
           ('${id}'
           ,'${firstname}'
           ,'${lastname}'
           ,'${email}'
           ,'${encrypted_password}');
    `
  );

  return res.status(200).json( recordset );
  
}

const signInHandler = async (req, res) => {
  
  const { email, password } = req.body;

  const sql = `SELECT * FROM developers WHERE email = '${email}'`;

  const { recordset } =  await db.query(sql);

  const user = recordset[0];

  if(!user) return res.status(401).json({ message: "User does not exist" });

  const validPassword = await bcrypt.compare(password, user.password);

  if(!validPassword) return res.status(400).json({ message: "Invalid Password" });

  const response = _.pick(user, [
      "developerID",
      "name",
      "email",
      "rank"
    ]
  )

  jwt.sign({ response }, 'secretkey', (error, token) => {
    return res
      .status(200)
      .json({token});
  });      
  
}

const getUsersHandler = async (req, res) => {

  const { recordset } = await db.query(`SELECT * FROM dbo.allUsers;`);
  console.log(recordset);
  res.send({ recordset });

}

const putUsersHandler = async (req, res) => {

  const { userID } = req.params;
  const { firstname, lastname, email } = req.body;
  const invitation_email_sent = 0;

  try{

    const { recordset } = await db.query(`UPDATE dbo.allUsers SET firstname = '${firstname}', lastname = '${lastname}', email = '${email}', invitation_email_sent = ${invitation_email_sent} WHERE taskID = ${userID}`);
    res.send({ message: `'${taskName}' task updated successfully` });

  } catch(error) {

    res.status(500).send({ message: "Internal Server Error" });

  }

}

const deleteUsersHandler = async (req, res) => {

}


// Finish up on this....

const forgotPasswordHandler = async (req, res) => {

  const { email } = req.body;

  try {

    const { recordset } = await db.query(`SELECT * FROM dbo.allUsers WHERE email = '${email}'`);
    const user = recordset[0]
    if(!user) return res.status(404).send({message:"Email does not exist in our database.. try registering"})

    //generate token with email and id in it
    const { id, email, firstname, lastname } = user
    const token = await jwt.sign({id, email}, "secretkey")

    const name = firstname+"  "+lastname
    await sendEmail(name, token)

    res.send({ message: "An email has been sent with the instructions..." });

  } catch(error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
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

  const { id } = req.body;

  try{

    const result = await db.execute(`dbo.degradeAdminUserToSupervisor`, { id });
    res.status(200).send({ message: 'User upgrade successful' });

  } catch(error) {
    
    res.status(500).send({ message: "Internal Server Error" });

  }
  
}

const supervisorToNormalHandler = async (req, res) => {

  const { id } = req.body;
  
  try{

    const result = await db.execute(`dbo.degradeSupervisorUserToNormal`, { id });
    res.status(200).send({ message: 'User upgrade successful' });

  } catch(error) {
    
    res.status(500).send({ message: "Internal Server Error" });

  }

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