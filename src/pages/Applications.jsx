import { useMemo } from "react";
import { useApp } from "../state/AppContext.jsx";

const Applications = () => {
  const { state, dispatch } = useApp();
  const applications = useMemo(() => {
    return state.applications.filter((app) => !state.filters.applicationStatus || app.status === state.filters.applicationStatus);
  }, [state.applications, state.filters.applicationStatus]);

  return (
    <section>
      <div className="page-title"><h1>Applications</h1><p>{applications.length} applications</p></div>
      <div className="toolbar">
        <select data-testid="application-status-filter" value={state.filters.applicationStatus} onChange={(e) => dispatch({ type: "SET_FILTER", key: "applicationStatus", payload: e.target.value })}>
          <option value="">All Statuses</option>
          <option value="applied">Applied</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="selected">Selected</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <table data-testid="application-table">
        <thead><tr><th>ID</th><th>Student</th><th>Drive</th><th>Round</th><th>Status</th><th>Applied</th></tr></thead>
        <tbody>
          {applications.map((app) => (
            <tr data-testid="application-row" key={app._id}>
              <td>{app.applicationId}</td><td>{app.student?.name}</td><td>{app.drive?.title}</td><td>{app.currentRound}</td><td>{app.status}</td><td>{new Date(app.appliedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Applications;
