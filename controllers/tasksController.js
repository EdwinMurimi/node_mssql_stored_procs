const { v1: uuid } = require('uuid');
const jwt = require("jsonwebtoken");

const db = require('../database');

const getTasksHandler = async (req, res) => {

  const { recordset } = await db.query(`SELECT * FROM dbo.tasks`);
  res.send({ recordset });

}

const postTasksHandler = async (req, res) => {

  const { projectID, taskName, duration } = req.body;

  try{

    const { recordset } = await db.query(`INSERT INTO dbo.tasks (projectID, taskName, duration) VALUES ('${projectID}', '${taskName}', '${duration}')`);
    res.send({ message: `'${taskName}' added successfully` });

  } catch(error) {

    res.status(500).send({ message: "Internal Server Error" });

  }

}

const putTasksHandler = async (req, res) => {

  const { taskID } = req.params;
  const { taskName, duration } = req.body;
  const completed = 0;

  try{

    const { recordset } = await db.query(`UPDATE dbo.tasks SET taskName = '${taskName}', duration = '${duration}', completed = ${completed} WHERE taskID = ${taskID}`);
    res.send({ message: `'${taskName}' task updated successfully` });

  } catch(error) {

    res.status(500).send({ message: "Internal Server Error" });

  }
    
}

const deleteTasksHandler = async (req, res) => {

  const { taskID } = req.params;

  try{

    const { recordset } = await db.query(`DELETE FROM dbo.tasks WHERE taskID = ${taskID}`);
    res.send({ message: `Task deleted successfully` });

  } catch(error) {

    res.status(500).send({ message: "Internal Server Error" });

  }

}

module.exports = {
  getTasksHandler,
  postTasksHandler,
  putTasksHandler,
  deleteTasksHandler
}