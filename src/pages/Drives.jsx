import { useMemo, useState } from "react";
import { useApp } from "../state/AppContext.jsx";

const Drives = () => {
  const { state, request, loadAll, dispatch } = useApp();
  const isOfficer = ["admin", "placement_officer"].includes(state.authUser?.role);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ driveId: "", company: "", title: "", mode: "online", location: "", registrationDeadline: "", rounds: "Aptitude,Technical,HR" });

  const drives = useMemo(() => {
    const search = state.filters.driveSearch.toLowerCase();
    return state.drives.filter((drive) => !search || `${drive.title} ${drive.company?.name}`.toLowerCase().includes(search));
  }, [state.drives, state.filters.driveSearch]);

  const paged = drives.slice((page - 1) * 6, page * 6);

  const createDrive = async (event) => {
    event.preventDefault();
    try {
      await request("/drives", { method: "POST", body: JSON.stringify({ ...form, rounds: form.rounds.split(",").map((v) => v.trim()) }) });
      setForm({ driveId: "", company: "", title: "", mode: "online", location: "", registrationDeadline: "", rounds: "Aptitude,Technical,HR" });
      await loadAll();
    } catch (error) {
      dispatch({ type: "SET_NOTICE", payload: error.message });
    }
  };

  const apply = async (drive) => {
    try {
      const student = state.students.find((item) => item.email === state.authUser.email) || state.students[0];
      await request("/applications", { method: "POST", body: JSON.stringify({ drive: drive.driveId, student: student?.studentId }) });
      await loadAll();
    } catch (error) {
      dispatch({ type: "SET_NOTICE", payload: error.message });
    }
  };

  return (
    <section>
      <div className="page-title"><h1>Drives</h1><p>{drives.length} drives</p></div>
      <div className="toolbar">
        <input data-testid="drive-search" placeholder="Search drives" value={state.filters.driveSearch} onChange={(e) => dispatch({ type: "SET_FILTER", key: "driveSearch", payload: e.target.value })} />
        <button data-testid="pagination-prev" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <button data-testid="pagination-next" disabled={page * 6 >= drives.length} onClick={() => setPage(page + 1)}>Next</button>
      </div>
      {isOfficer && (
        <form className="inline-form" onSubmit={createDrive}>
          <input placeholder="driveId" value={form.driveId} onChange={(e) => setForm({ ...form, driveId: e.target.value })} />
          <select value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}>
            <option value="">Company</option>
            {state.companies.map((company) => <option key={company._id} value={company.companyId}>{company.name}</option>)}
          </select>
          <input placeholder="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input placeholder="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <input type="date" value={form.registrationDeadline} onChange={(e) => setForm({ ...form, registrationDeadline: e.target.value })} />
          <button data-testid="create-drive-btn">Create Drive</button>
        </form>
      )}
      <div className="list" data-testid="drive-list">
        {paged.map((drive) => (
          <article key={drive._id}>
            <h3>{drive.title}</h3>
            <p>{drive.company?.name} | {drive.mode} | {drive.status}</p>
            <small>Deadline: {new Date(drive.registrationDeadline).toLocaleDateString()}</small>
            <button data-testid="apply-btn" disabled={drive.status !== "open"} onClick={() => apply(drive)}>Apply</button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Drives;
