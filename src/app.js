const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid id format.'});
  }

  next();
}

app.use('/repositories/:id', validateProjectId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(r => r.id === id);

  if(repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found."});
  }

  const repo = repositories[repoIndex];

  const updateRepo = {
    id, 
    title: title ? title : repo.title,
    url: url ? url : repo.url,
    techs: techs ? techs : repo.techs,
    likes: repo.likes
  };

  repositories[repoIndex] = updateRepo;

  return response.json(updateRepo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(r => r.id === id);

  if(repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found."});
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(r => r.id === id);

  if(repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found."});
  }

  const repo = repositories[repoIndex];
  repo.likes++;
  repositories[repoIndex] = repo;

  return response.json(repositories[repoIndex]);
});

module.exports = app;
