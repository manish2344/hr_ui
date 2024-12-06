// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// const PrivateRoute = ({ component: Component, ...rest }) => {
//   const { token } = useAuth();

//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         token ? (
//           <Component {...props} />
//         ) : (
//           <Redirect to="/login" />
//         )
//       }
//     />
//   );
// };

// export default PrivateRoute;import React from 'react';
import { Route, Navigate } from 'react-router-dom';  // Use Navigate instead of Redirect
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { token } = useAuth();

  return (
    <Route
      {...rest}
      element={token ? <Component /> : <Navigate to="/login" />}  // Use Navigate for redirection
    />
  );
};

export default PrivateRoute;
