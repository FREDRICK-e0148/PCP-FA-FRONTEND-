import { useApp } from "../state/AppContext.jsx";

const Dashboard = () => {
  const { state } = useApp();
  const analytics = state.analytics || {};
  const placement = analytics.placement || {};

  return (
    <section>
      <div className="page-title">
        <h1>Dashboard</h1>
        <p>{state.authUser?.role?.replace("_", " ")}</p>
      </div>
      <div className="cards" data-testid="analytics-container">
        <article data-testid="total-students-card"><span>Total Students</span><strong>{analytics.totalStudents || state.students.length}</strong></article>
        <article data-testid="total-companies-card"><span>Total Companies</span><strong>{analytics.totalCompanies || state.companies.length}</strong></article>
        <article data-testid="total-drives-card"><span>Total Drives</span><strong>{analytics.totalDrives || state.drives.length}</strong></article>
        <article data-testid="total-applications-card"><span>Total Applications</span><strong>{analytics.totalApplications || state.applications.length}</strong></article>
      </div>
      <div className="dashboard-grid">
        <section className="panel" data-testid="placement-chart">
          <h2>Placement Analytics</h2>
          {["shortlistedCount", "selectedCount", "rejectedCount"].map((key) => (
            <div className="bar-row" key={key}>
              <span>{key.replace("Count", "")}</span>
              <div><i style={{ width: `${Math.min((placement[key] || 0) * 20, 100)}%` }} /></div>
              <b>{placement[key] || 0}</b>
            </div>
          ))}
        </section>
        <section className="panel">
          <h2>Upcoming Drives</h2>
          {(analytics.upcomingDrives || state.drives).slice(0, 5).map((drive) => (
            <p key={drive._id}>{drive.title} - {drive.company?.name}</p>
          ))}
        </section>
        <section className="panel">
          <h2>Shortlisted Students</h2>
          {(analytics.shortlistedStudents || []).map((app) => (
            <p key={app._id}>{app.student?.name} - {app.drive?.company?.name}</p>
          ))}
        </section>
        <section className="panel" data-testid="recent-interviews">
          <h2>Recent Interviews</h2>
          {(analytics.recentInterviews || state.interviews).slice(0, 5).map((interview) => (
            <p key={interview._id}>{interview.application?.student?.name} - {interview.round}</p>
          ))}
        </section>
      </div>
    </section>
  );
};

export default Dashboard;
