import { useState } from "react";
import { useApp } from "../state/AppContext.jsx";

const Interviews = () => {
  const { state, request, loadAll, dispatch } = useApp();
  const [form, setForm] = useState({ application: "", interviewer: "", round: "", scheduledAt: "" });

  const schedule = async (event) => {
    event.preventDefault();
    try {
      await request("/interviews", { method: "POST", body: JSON.stringify(form) });
      setForm({ application: "", interviewer: "", round: "", scheduledAt: "" });
      await loadAll();
    } catch (error) {
      dispatch({ type: "SET_NOTICE", payload: error.message });
    }
  };

  const updateResult = async (interview, result) => {
    try {
      await request(`/interviews/${interview.interviewId}`, { method: "PATCH", body: JSON.stringify({ result }) });
      await loadAll();
    } catch (error) {
      dispatch({ type: "SET_NOTICE", payload: error.message });
    }
  };

  return (
    <section>
      <div className="page-title"><h1>Interviews</h1><p>{state.interviews.length} scheduled</p></div>
      <form className="inline-form" onSubmit={schedule}>
        <select value={form.application} onChange={(e) => setForm({ ...form, application: e.target.value })}>
          <option value="">Application</option>
          {state.applications.map((app) => <option key={app._id} value={app.applicationId}>{app.applicationId} - {app.student?.name}</option>)}
        </select>
        <input placeholder="interviewer" value={form.interviewer} onChange={(e) => setForm({ ...form, interviewer: e.target.value })} />
        <input placeholder="round" value={form.round} onChange={(e) => setForm({ ...form, round: e.target.value })} />
        <input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
        <button data-testid="schedule-interview-btn">Schedule Interview</button>
      </form>
      <table data-testid="interview-table">
        <thead><tr><th>ID</th><th>Student</th><th>Interviewer</th><th>Round</th><th>Scheduled</th><th>Result</th></tr></thead>
        <tbody>
          {state.interviews.map((interview) => (
            <tr key={interview._id}>
              <td>{interview.interviewId}</td><td>{interview.application?.student?.name}</td><td>{interview.interviewer}</td><td>{interview.round}</td><td>{new Date(interview.scheduledAt).toLocaleString()}</td>
              <td>
                <select data-testid="interview-result-dropdown" value={interview.result} onChange={(e) => updateResult(interview, e.target.value)}>
                  <option value="pending">pending</option>
                  <option value="pass">pass</option>
                  <option value="fail">fail</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Interviews;
