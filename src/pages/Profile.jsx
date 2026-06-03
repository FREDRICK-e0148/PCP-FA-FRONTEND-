import { useApp } from "../state/AppContext.jsx";

const Profile = () => {
  const { state, request, loadAll, dispatch } = useApp();
  const isOfficer = ["admin", "placement_officer"].includes(state.authUser?.role);

  const sync = async () => {
    try {
      const result = await request("/sync", { method: "POST" });
      dispatch({ type: "SET_NOTICE", payload: `Sync complete: ${result.inserted} inserted, ${result.duplicates} duplicates, ${result.rejected} rejected` });
      await loadAll();
    } catch (error) {
      dispatch({ type: "SET_NOTICE", payload: error.message });
    }
  };

  return (
    <section className="panel">
      <h1>Profile</h1>
      <p>{state.authUser?.name}</p>
      <p>{state.authUser?.email}</p>
      <p>{state.authUser?.role}</p>
      {isOfficer && <button onClick={sync}>Sync Dataset</button>}
    </section>
  );
};

export default Profile;
