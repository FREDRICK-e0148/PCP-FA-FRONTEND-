import { useState } from "react";
import { useApp } from "../state/AppContext.jsx";

const Companies = () => {
  const { state, request, loadAll, dispatch } = useApp();
  const isOfficer = ["admin", "placement_officer"].includes(state.authUser?.role);
  const [form, setForm] = useState({ companyId: "", name: "", role: "", package: "", eligibleDepartments: "CSE,IT", minimumCgpa: "", driveDate: "" });

  const create = async (event) => {
    event.preventDefault();
    try {
      await request("/companies", { method: "POST", body: JSON.stringify({ ...form, package: Number(form.package), minimumCgpa: Number(form.minimumCgpa), eligibleDepartments: form.eligibleDepartments.split(",").map((v) => v.trim()) }) });
      setForm({ companyId: "", name: "", role: "", package: "", eligibleDepartments: "CSE,IT", minimumCgpa: "", driveDate: "" });
      await loadAll();
    } catch (error) {
      dispatch({ type: "SET_NOTICE", payload: error.message });
    }
  };

  return (
    <section>
      <div className="page-title"><h1>Companies</h1><p>{state.companies.length} companies</p></div>
      {isOfficer && (
        <form className="inline-form" onSubmit={create}>
          {Object.keys(form).map((key) => <input key={key} type={key === "driveDate" ? "date" : "text"} placeholder={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />)}
          <button>Create Company</button>
        </form>
      )}
      <div className="list">
        {state.companies.map((company) => (
          <article key={company._id}>
            <h3>{company.name}</h3>
            <p>{company.role} | {company.package} LPA | CGPA {company.minimumCgpa}+</p>
            <small>{company.eligibleDepartments?.join(", ")}</small>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Companies;
