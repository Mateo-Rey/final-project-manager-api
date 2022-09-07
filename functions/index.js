import express from 'express';
import functions from 'firebase-functions'
import cors from 'cors';
import { addProject, getProjects, updateProject , getOneProject, getAllProjectId } from './functions.js';

const app = express()
app.use(cors())
app.use(express.json())

app.listen(4000, console.log('listening on 4000'))

app.get('/projects/:userId', getProjects)
app.get('/projects/:userId/:projectId', getOneProject)
app.get('/projectIds/:userId', getAllProjectId)
app.post('/add-project/:userId', addProject)
app.put('/update-project/:userId/:projectId', updateProject)
export const api = functions.https.onRequest(app)