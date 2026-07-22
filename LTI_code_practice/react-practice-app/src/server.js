const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let projects = [
    {
        id:1,
        name:"E-commerce Platform",
        status:"Completed",
        owner:"Genie Team"
    },
    {
        id:2,
        name:"AI Generative Platform",
        status:"Planned",
        owner:"Utilities Team"
    },
    {
        id:3,
        name:"Chat Application Platform",
        status:"In Progress",
        owner:"Genielift team"
    },
];


app.get("/api/projects",(req,res) => {
    res.json(projects)
});

app.post("/api/projects",(req,res) => {
    const {name,status,owner} = req.body;

    if(!name || !status || !owner){
        return res.status(400).json({
            message:"Project name , status , owner are required",
        });
    }

    const newProject = {
        id:Date.now(),
        name,
        status,
        owner
    };

    projects.push(newProject);
    res.status(201).json(newProject);
});

app.patch("/api/projects/:id",(req,res) => {
    const projectId = Number(req.params.id);
    const {status} = req.body;
    const project = projects.find((item) => item.id === projectId);

    if(!project){
        return res.status(400).json({
            message:"Project not found"
        });
    }
    project.status = status;
    res.json(projects);
});


app.delete("/api/projects/:id",(req,res) => {
    const projectId = Number(req.params,id);
    projects = projects.filter((item) =>  item.id !== projectId);

    res.json({
        message: "Projects Deleted Successfully",
    });
});

app.listen(PORT,() => {
    console.log(`Backend Server is running on http://localhost:${PORT}`);
});


