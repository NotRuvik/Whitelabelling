// import React, { useState } from 'react'; // Import useState
// import {
//   Container,
//   Paper,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   FormHelperText,
//   InputAdornment, // Import InputAdornment
//   IconButton,     // Import IconButton
// } from '@mui/material';
// import Visibility from '@mui/icons-material/Visibility';       // Import Visibility icon
// import VisibilityOff from '@mui/icons-material/VisibilityOff'; // Import VisibilityOff icon
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { useAuth } from '../contexts/AuthContext';

// const LoginPage = () => {
//   const { login } = useAuth();
//   const [showPassword, setShowPassword] = useState(false); // State for password visibility

//   const handleClickShowPassword = () => {
//     setShowPassword((prev) => !prev);
//   };

//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };

//   const formik = useFormik({
//     initialValues: { email: '', password: '', submit: null },
//     validationSchema: Yup.object({
//       email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
//       password: Yup.string().max(255).required('Password is required'),
//     }),
//     onSubmit: async (values, { setErrors, setSubmitting }) => {
//       try {
//         await login(values.email, values.password);
//       } catch (error) {
//         setErrors({ submit: error.message || 'Login failed. Please check your credentials.' });
//         setSubmitting(false);
//       }
//     },
//   });

//   return (
//     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'background.default' }}>
//       <Container component="main" maxWidth="xs">
//         <Paper elevation={0} variant="outlined" sx={{ p: 4 }}>
//           <Typography component="h1" variant="h5" align="center" gutterBottom>
//             Sign In
//           </Typography>
//           <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="Email Address"
//               name="email"
//               autoComplete="email"
//               value={formik.values.email}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.email && Boolean(formik.errors.email)}
//               helperText={formik.touched.email && formik.errors.email}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="Password"
//               // Dynamically set type based on showPassword state
//               type={showPassword ? 'text' : 'password'}
//               id="password"
//               autoComplete="current-password"
//               value={formik.values.password}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.password && Boolean(formik.errors.password)}
//               helperText={formik.touched.password && formik.errors.password}
//               InputProps={{ // Add InputProps to include the adornment
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="toggle password visibility"
//                       onClick={handleClickShowPassword}
//                       onMouseDown={handleMouseDownPassword}
//                       edge="end"
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//             {formik.errors.submit && (
//               <FormHelperText error sx={{ mt: 2 }}>
//                 {formik.errors.submit}
//               </FormHelperText>
//             )}
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               disabled={formik.isSubmitting}
//               sx={{ mt: 3, mb: 2, py: 1.5 }}
//             >
//               Sign In
//             </Button>
//           </Box>
//         </Paper>
//       </Container>
//     </Box>
//   );
// };
// export default LoginPage;
import React, { useState } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  FormHelperText,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const formik = useFormik({
    initialValues: { email: "", password: "", submit: null },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        await login(values.email, values.password);
      } catch (error) {
        setErrors({
          submit: error.message || "Login failed. Please try again.",
        });
        setSubmitting(false);
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: 3,
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Welcome Back 👋
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ mb: 3, color: "text.secondary" }}
          >
            Sign in to access your dashboard
          </Typography>

          <Box component="form" noValidate onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              autoComplete="email"
              margin="normal"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              margin="normal"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {formik.errors.submit && (
              <FormHelperText error sx={{ mt: 2 }}>
                {formik.errors.submit}
              </FormHelperText>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={formik.isSubmitting}
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: "bold",
                backgroundColor: "primary.dark",
                "&:hover": {
                  backgroundColor: "primary.main",
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
