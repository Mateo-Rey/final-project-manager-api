import express from 'express';
import functions from 'firebase-functions'
import cors from 'cors';
import { addProject, getProjects, updateProject } from './functions.js';

const app = express()
app.use(cors())
app.use(express.json())


app.get('/projects/:userId', getProjects)
app.post('/add-project/:userId/:projectId', addProject)
app.put('/update-project/:userId/:projectId', updateProject)
export const api = functions.https.onRequest(app)