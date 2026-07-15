import React, { useState } from "react";

export default function JobForm() {
  const [job, setJob] = useState({
    title: "",
    company: "",
    companyDescription: "",
    location: "",
    workMode: "Remote",
    visibility: "draft",
    contractType: "Full Time",
    salary: "",
    experience: "",
    education: "",
    applicationDeadline: "",
    description: "",
    responsibilities: "",
    requirements: "",
    benefits: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Gestionnaire de changement unique pour tous les champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prevJob) => ({
      ...prevJob,
      [name]: value
    }));
  };

  function validate() {
    if (job.title.trim().length < 5)
      return "Le titre doit contenir au moins 5 caractères.";

    if (job.company.trim().length < 2)
      return "Nom de l'entreprise invalide.";

    if (!job.location)
      return "Veuillez saisir la localisation.";

    if (!job.salary)
      return "Le salaire est obligatoire.";

    if (Number(job.salary) <= 0)
      return "Salaire invalide.";

    if (job.description.trim().length < 50)
      return "La description est trop courte (min. 50 caractères).";

    if (!job.applicationDeadline)
      return "Choisissez une date limite.";

    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Si tout est valide
    console.log("Données du job soumises :", job);
    setSuccess(true);
    // Optionnel : réinitialiser le formulaire ici
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Create Job Posting</h1>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      {success && <p style={{ color: "green", fontWeight: "bold" }}>Offre d'emploi créée avec succès !</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        
        {/* Title */}
        <label>
          <strong>Title * :</strong>
          <input 
            type="text" 
            name="title" 
            value={job.title} 
            onChange={handleChange} 
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </label>

        {/* Company */}
        <label>
          <strong>Company * :</strong>
          <input 
            type="text" 
            name="company" 
            value={job.company} 
            onChange={handleChange} 
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </label>

        {/* Company Description */}
        <label>
          <strong>Company Description :</strong>
          <textarea 
            name="companyDescription" 
            value={job.companyDescription} 
            onChange={handleChange} 
            style={{ width: "100%", padding: "8px", marginTop: "5px", height: "60px" }}
          />
        </label>

        {/* Location */}
        <label>
          <strong>Location * :</strong>
          <input 
            type="text" 
            name="location" 
            value={job.location} 
            onChange={handleChange} 
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </label>
        {/* Visibility */}
           <label style={{ flex: 1 }}>
            <strong>Visibility * :</strong>
            <select 
              name="visibility" 
              value={job.visibility} 
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
              <option value="Remote">draft</option>
              <option value="Hybrid">published</option>
            </select>
          </label>
          {/*Work Mode */}

        <div style={{ display: "flex", gap: "20px" }}>
          {/* Work Mode */}
          <label style={{ flex: 1 }}>
            <strong>Work Mode :</strong>
            <select 
              name="workMode" 
              value={job.workMode} 
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </label>

          {/* Contract Type */}
          <label style={{ flex: 1 }}>
            <strong>Contract Type :</strong>
            <select 
              name="contractType" 
              value={job.contractType} 
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </label>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          {/* Salary */}
          <label style={{ flex: 1 }}>
            <strong>Salary * :</strong>
            <input 
              type="number" 
              name="salary" 
              value={job.salary} 
              onChange={handleChange} 
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>

          {/* Application Deadline */}
          <label style={{ flex: 1 }}>
            <strong>Application Deadline * :</strong>
            <input 
              type="date" 
              name="applicationDeadline" 
              value={job.applicationDeadline} 
              onChange={handleChange} 
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          {/* Experience */}
          <label style={{ flex: 1 }}>
            <strong>Experience Required :</strong>
            <input 
              type="text" 
              name="experience" 
              value={job.experience} 
              onChange={handleChange} 
              placeholder="e.g. 2+ years"
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>

          {/* Education */}
          <label style={{ flex: 1 }}>
            <strong>Education :</strong>
            <input 
              type="text" 
              name="education" 
              value={job.education} 
              onChange={handleChange} 
              placeholder="e.g. Bachelor's Degree"
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>
        </div>

        {/* Description */}
        <label>
          <strong>Description * (min. 50 chars) :</strong>
          <textarea 
            name="description" 
            value={job.description} 
            onChange={handleChange} 
            style={{ width: "100%", padding: "8px", marginTop: "5px", height: "100px" }}
          />
        </label>

        {/* Responsibilities */}
        <label>
          <strong>Responsibilities :</strong>
          <textarea 
            name="responsibilities" 
            value={job.responsibilities} 
            onChange={handleChange} 
            style={{ width: "100%", padding: "8px", marginTop: "5px", height: "80px" }}
          />
        </label>

        {/* Requirements */}
        <label>
          <strong>Requirements :</strong>
          <textarea 
            name="requirements" 
            value={job.requirements} 
            onChange={handleChange} 
            style={{ width: "100%", padding: "8px", marginTop: "5px", height: "80px" }}
          />
        </label>

        {/* Benefits */}
        <label>
          <strong>Benefits :</strong>
          <textarea 
            name="benefits" 
            value={job.benefits} 
            onChange={handleChange} 
            style={{ width: "100%", padding: "8px", marginTop: "5px", height: "60px" }}
          />
        </label>

        <button 
          type="submit" 
          style={{ 
            padding: "12px", 
            backgroundColor: "#0070f3", 
            color: "white", 
            border: "none", 
            borderRadius: "5px", 
            cursor: "pointer", 
            fontWeight: "bold",
            marginTop: "10px"
          }}
        >
          Create Job
        </button>
      </form>
    </div>
  );
}