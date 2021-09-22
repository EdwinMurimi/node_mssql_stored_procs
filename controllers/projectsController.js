const { v1: uuid } = require('uuid');
const jwt = require("jsonwebtoken");

const db = require('../database');

const getProjectsHandler = async (req, res) => {
   
  const { recordset } = await db.query(`SELECT * FROM dbo.projects`);
  res.send({ recordset });

}

const postProjectsHandler = async (req, res) => {

  const projectID = uuid();
  const { projectName, duration, email } = req.body;

  try{

    const { recordset } = await db.query(`INSERT INTO dbo.projects (projectID, projectName, duration, email ) VALUES ('${projectID}', '${projectName}', '${duration}', '${email}')`);
    console.log(recordset);
    res.send({ message: `'${projectName}' project added successfully` });

  } catch(error) {

    res.status(500).send({ message: "Internal Server Error" });

  }

}

const putProjectsHandler = async (req, res) => {

  const { projectID } = req.params;
  const { projectName, duration, email } = req.body;

  try{

    const { recordset } = await db.query(`UPDATE dbo.projects SET projectName = '${projectName}', duration = '${duration}', email = '${email}' WHERE projectID = '${projectID}'`);
    res.send({ message: `'${projectName}' project updated successfully` });

  } catch(error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });

  }

}

const deleteProjectsHandler = async (req, res) => {

  const { projectID } = req.params;

  try{

    const { recordset } = await db.query(`DELETE FROM dbo.projects WHERE projectID = '${projectID}'`);
    res.send({ message: `Project deleted successfully` });

  } catch(error) {

    res.status(500).send({ message: "Internal Server Error" });

  }

}

module.exports = {
  getProjectsHandler,
  postProjectsHandler,
  putProjectsHandler,
  deleteProjectsHandler
}