import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { dbConnect } from "./dbConnect.js";

const db = dbConnect();
function handleError(err, res) {
  console.error(err);
  res.status(500).send(err);
}

export const getProjects = (req, res) => {
  const userId = req.params.userId;

  db.collection("projects")
  .where("userId", "==", `${userId}`)
  .get()
  .then((collection) => {
    const projects = collection.docs.map((doc) => doc.data());
    res.send(projects);
  })
  .catch((err) => handleError(err, res));
};

export const addProject = (req, res) => {
  const newProject = req.body;
  const userId = req.params.userId;
  newProject.userId = userId;
  newProject.creationDate = new Date();
  db.collection("projects")
    .add(newProject)
    .then((doc) => {
      res.status(201).send({
        success: true,
        id: doc.id,
      });
    })
    .catch((err) => handleError(err, res));
};

export const getAllProjectId = (req, res) => {
  const userId = req.params.userId;
  db.collection("projects")
    .where('userId', '==', `${userId}`)
    .get()
    .then((collection) => {
      const idList = collection.docs.map((doc) => doc.id)
      res.send(idList)
    })
};

export const deleteProject = (req, res) => {
  
  const projectId = req.params.projectId
  db.collection('projects').doc(projectId)
  .delete()
  .then(res.status(200).send('Document deleted'))
  .catch((error) => res.status(500).send(error))

}

export const getOneProject = (req, res) => {
  const userId = req.params.userId;
  const projectId = req.params.projectId;

  db.collection("projects")
    .doc(projectId)
    .get()
    .then((doc) => {
      const document = doc.data();
      console.log(userId, document.userId);
      if (userId !== document.userId) {
        res.status(400).send("Incorrect User, Search for a different project.");
      } else if (userId == document.userId) {
        res.send(document);
      }
    });
};

export const updateProject = async (req, res) => {
  const userId = req.params.userId;
  const projectId = req.params.projectId;
  const update = req.body;
  let document = "";

  const docRef = db.collection("projects").doc(projectId);

  await docRef.get().then((doc) => {
    document = doc.data();
  });
  console.log(document);
  if (document.userId !== userId) {
    res.status(400).send("Incorrect User, Search for a different project.");
  } else {
    await docRef
      .set(update, { merge: true })
      .then(res.status(200).send("Project Updated"))
      .catch((err) => {
        console.log(err);
      });
  }
};
