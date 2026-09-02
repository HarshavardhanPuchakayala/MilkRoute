import { Link } from "react-router-dom";

const NotAuthorized = () => {
  return (
    <div>
      <h1>Not Authorized</h1>
      <p>You don't have permission to view this page.</p>

      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default NotAuthorized;