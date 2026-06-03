import { useMemo } from "react";
import { useApp } from "../state/AppContext.jsx";

const Students = () => {
  const { state, dispatch } = useApp();
  const students = useMemo(() => {
    return state.students.filter((student) => {
      const search = state.filters.studentSearch.toLowerCase();
      const matchesSearch = !search || `${student.name} ${student.email} ${student.studentId}`.toLowerCase().includes(search);
      const matchesDept = !state.filters.studentDepartment || student.department === state.filters.studentDepartment;
      return matchesSearch && matchesDept;
    });
  }, [state.students, state.filters]);

  return (
    <section>
      <div className="page-title"><h1>Students</h1><p>{students.length} records</p></div>
      <div className="toolbar">
        <input data-testid="student-search" placeholder="Search students" value={state.filters.studentSearch} onChange={(e) => dispatch({ type: "SET_FILTER", key: "studentSearch", payload: e.target.value })} />
        <select data-testid="student-filter" value={state.filters.studentDepartment} onChange={(e) => dispatch({ type: "SET_FILTER", key: "studentDepartment", payload: e.target.value })}>
          <option value="">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="ECE">ECE</option>
        </select>
      </div>
      <table data-testid="student-table">
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Department</th><th>CGPA</th><th>Status</th></tr></thead>
        <tbody>
          {students.map((student) => (
            <tr data-testid="student-row" key={student._id}>
              <td>{student.studentId}</td><td>{student.name}</td><td>{student.email}</td><td>{student.department}</td><td>{student.cgpa}</td><td>{student.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Students;
