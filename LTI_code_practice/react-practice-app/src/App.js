import React,{useState,useEffect} from "react";

function App(){
  const [projects,setProjects] = useState([]);
  const [loading,setLoading] = useState(true);
  const[projectName,setProjectName] = useState("");
  const[projectOwner,setProjectOwner] = useState("");
  const[projectStatus,setProjectStatus] = useState("Planned");

  const[searchTerm,setSearchTerm] = useState("");
  const[statusFilter,setStatusFilter] = useState("All");
  const[error,setError] = useState("");

  const API_URL = "http://localhost:5000/api/projects";
  useEffect(() => {
    fetchProjects();
  },[]);

  const fetchProjects = async() => {
    try{
      setLoading(false);
      setError("");

      const response = await fetch(API_URL);
      if(!response.ok){
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      setProjects(data);
    }
    catch(err){
      setError("Unable to connect with backend server");
      console.error("API Error:",err);
    }
    finally{
      setLoading(false);
    }
  };


  const addProject = async(e) => {
    e.preventDefault();

    if(!projectName.trim() || !projectOwner.trim()){
      alert("Please enter project name and owner");
    }

    const newProject = {
      name:projectName,
      owner:projectOwner,
      status:projectStatus
    };

    try{
      const response = await fetch(API_URL,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(newProject),
      });
      if(!response.ok){
        throw new Error("Failed to add project");
      }

      const savedProject = await response.json();
      setProjects([...projects,savedProject]);
      setProjectName("");
      setProjectOwner("");
      setProjectStatus("Planned");
    }
    catch(err){
      console.error("Add Project Error:",err);
      alert("Something went wrong while adding project");
    }
};

const deleteProject = async (id) => {
  try{
    const response = await fetch(`${API_URL}/${id}`,{
      method:"DELETE",
    });

    if(!response.ok) {
      throw new Error("Failed to delete project");
    }

    const updatedProjects = projects.filter((project) => project.id !== id);
    setProjects(updatedProjects);
  }
  catch(err){
    console.log("Delete Error:",err);
    alert("Something went wrong while deleting project");
  }
};

const updateStatus = async(id,newStatus) => {
  try{
    const response = await fetch(`${API_URL}/${id}`, {
      method:"PATCH",
      headers:{
        "Content-Type":"apllication/json",
      },
      body:JSON.stringify({status: newStatus}),
    });

    if(!response.ok) {
      throw new Error("Failed to update project status");
    }

    const updatedProject = await response.json();
    const updatedProjects = projects.map((project) => 
      project.id === id ?  updatedProject : project
    );

    setProjects(updatedProjects);

  }
  catch(err){
    console.error("Update Status Error:",err);
    alert("Something went wrong while updating status");
  }
};

const sortProjectsByName = () => {
  const sortedProjects = [...projects].sort((a,b) => 
  a.name.localeCompare(b.name)
);

setProjects(sortedProjects);
};


const getStatusClass = (status) => {
  if(status === "Completed"){
    return "completed";
  }

  if(status === "In Progress"){
    return "in-progress";
  }

  return "planned";
}

const filteredProjects = projects.filter((project) => {
  const matchesSearch = project.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesStatus = statusFilter === "ALL" || project.status === statusFilter;
  return matchesSearch && matchesStatus;
});

return(
  <div className="app-container">
      <h1>Project Dashboard</h1>
      <p className="subtitle">
        Advances React practice with node.js backend API
      </p>

    <form className="project-form" onSubmit={addProject}>
    <input 
    type="text"
    placeholder = "Enter Project Name"
    value={projectName}
    onChange={(e) => setProjectName(e.target.value)}
    />

    <input 
    type="text"
    placeholder = "Enter Owner Name"
    value={projectOwner}
    onChange={(e) => setProjectOwner(e.target.value)}
    />

    <select
    value={projectStatus}
    onChange={(e) => setProjectStatus(e.target.value)}
    >
      <option value="Planned">Planned</option>
      <option value="In Progress">In Progress</option>
      <option value="Completed">Completed</option>
    </select>

    <button type="submit">Add Project</button>
    </form>

    <div className="controls">
  <input 
  type="text"
  placeholder="Search Project..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  />

  <select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="ALL">All Status</option>
    <option value="Planned">Planned</option>
    <option value="In Progress">In Progress</option>
    <option value="Completed">Completed</option>
  </select>

  <button onClick={sortProjectsByName}>Sort A-Z</button>
  <button onClick={fetchProjects}>Refresh</button>
    </div>
    
    {loading && <p className="loading">Loading...</p>}

    {error && <p className="error">{error}</p>}

    {!loading && !error && (
      <>
      <h3>Total Projects : {filteredProjects.length}</h3>

      {filteredProjects.length === 0 ? (
        <p>No Projects Found</p>
      ) : (
        <div className="project-list">
          {filteredProjects.map((project) => (
            <div className="project-card" key={project.id}>
              <div>
                <h2>{project.name}</h2>
                <p>Owner: {project.owner}</p>
                <span className={`status ${getStatusClass(project.status)}`}>{project.status}</span>
            </div>

            <div className="card-actions">
              <select
              value={project.status}
              onChange={(e) =>
                updateStatus(project.id,e.target.value)
              }
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <button
              className="delete-btn"
              onClick={() =>  deleteProject(project.id)}>
                Delete
              </button>
            </div>
            </div>
          ))}
        </div>
      )}
      </>
    )}
  </div>
);
}

export default App;