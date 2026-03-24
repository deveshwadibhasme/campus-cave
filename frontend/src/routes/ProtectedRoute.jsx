export const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  const decoded = jwtDecode(token);
  if (decoded.role !== role) return <Navigate to="/unauthorized" />;

  return children;
};
