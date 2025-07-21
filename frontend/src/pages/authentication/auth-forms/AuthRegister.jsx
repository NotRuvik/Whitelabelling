// // import React, { useState } from "react";
// // import { Link as RouterLink } from "react-router-dom";
// // import {
// //   Box,
// //   Button,
// //   FormHelperText,
// //   Grid,
// //   InputAdornment,
// //   InputLabel,
// //   OutlinedInput,
// //   Stack,
// //   Typography,
// //   Link,
// //   IconButton,
// // } from "@mui/material";
// // import * as Yup from "yup";
// // import { Formik } from "formik";
// // // import { CirclePicker } from 'react-color';
// // import AnimateButton from "../../@extended/AnimateButton";
// // import api from "../api";
// // import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

// // export default function AuthRegister({ onSuccess, onBack, registrationData }) {
// //   const [showPassword, setShowPassword] = useState(false);
// //   const handleClickShowPassword = () => setShowPassword(!showPassword);
// //   const handleMouseDownPassword = (event) => event.preventDefault();

// //   return (
// //     <Formik
// //       initialValues={{
// //         npoName: "",
// //         subdomain: "",
// //         email: "",
// //         phone: "",
// //         firstName: "",
// //         lastName: "",
// //         password: "",
// //          themeColor: '#00A76F',
// //         submit: null,
// //       }}
// //       validationSchema={Yup.object().shape({
// //         npoName: Yup.string().max(255).required("NPO Name is required"),
// //         subdomain: Yup.string()
// //           .matches(/^[a-zA-Z0-9-]+$/, "Only alphanumeric and hyphens allowed")
// //           .max(63)
// //           .required("Subdomain is required"),
// //         email: Yup.string()
// //           .email("Must be a valid email")
// //           .max(255)
// //           .required("Email is required"),
// //         phone: Yup.string()
// //           .matches(/^\d{10,15}$/, "Phone number is invalid")
// //           .required("Phone is required"),
// //         firstName: Yup.string().max(255).required("First Name is required"),
// //         lastName: Yup.string().max(255).required("Last Name is required"),
// //         themeColor: Yup.string().required('A brand color is required.'),
// //         // password: Yup.string()
// //         //   .min(8, "Password must be at least 8 characters")
// //         //   .max(255)
// //         //   .required("Password is required"),
// //       })}
// //       onSubmit={async (values, { setErrors, setSubmitting }) => {
// //         try {
// //           setSubmitting(true);

// //           const fullRegistrationData = {
// //             ...registrationData,
// //             name: values.npoName,
// //             domainSlug: values.subdomain,
// //             email: values.email,
// //             phone: values.phone,
// //             firstName: values.firstName,
// //             lastName: values.lastName,
// //             password: 'devdev',
// //             themeColor: values.themeColor,
// //           };

// //           // The API endpoint for registration
// //           await api.post("/auth/register", fullRegistrationData);
// //           onSuccess(); // Proceed to the "Complete" step
// //         } catch (error) {
// //           const message =
// //             error.response?.data?.message ||
// //             "Registration failed. Please try again.";
// //           setErrors({ submit: message });
// //         } finally {
// //           setSubmitting(false);
// //         }
// //       }}
// //     >
// //       {({
// //         errors,
// //         handleBlur,
// //         handleChange,
// //         handleSubmit,
// //         isSubmitting,
// //         touched,
// //         values,
// //         setFieldValue
// //       }) => (
// //         <form noValidate onSubmit={handleSubmit}>
// //           <Grid container spacing={3}>
// //             <Grid item xs={12} md={6}>
// //               <Stack spacing={1}>
// //                 <InputLabel htmlFor="npo-name">NPO Name*</InputLabel>
// //                 <OutlinedInput
// //                   fullWidth
// //                   id="npo-name"
// //                   name="npoName"
// //                   value={values.npoName}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   placeholder="Christ Charity"
// //                   error={Boolean(touched.npoName && errors.npoName)}
// //                 />
// //                 {touched.npoName && errors.npoName && (
// //                   <FormHelperText error>{errors.npoName}</FormHelperText>
// //                 )}
// //               </Stack>
// //             </Grid>
// //             <Grid item xs={12} md={6}>
// //               <Stack spacing={1}>
// //                 <InputLabel htmlFor="subdomain">
// //                   NPO sub domain name*
// //                 </InputLabel>
// //                 <OutlinedInput
// //                   id="subdomain"
// //                   name="subdomain"
// //                   type="text"
// //                   placeholder="npo1"
// //                   fullWidth
// //                   value={values.subdomain}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   error={Boolean(touched.subdomain && errors.subdomain)}
// //                   endAdornment={
// //                     <InputAdornment position="end">
// //                       <Typography
// //                         sx={{ whiteSpace: "nowrap", fontWeight: 500 }}
// //                       >
// //                         .nightbright.org
// //                       </Typography>
// //                     </InputAdornment>
// //                   }
// //                 />
// //                 {touched.subdomain && errors.subdomain && (
// //                   <FormHelperText error>{errors.subdomain}</FormHelperText>
// //                 )}
// //               </Stack>
// //             </Grid>
// //             <Grid item xs={12} md={6}>
// //               <Stack spacing={1}>
// //                 <InputLabel htmlFor="firstName-register">
// //                   First Name*
// //                 </InputLabel>
// //                 <OutlinedInput
// //                   id="firstName-register"
// //                   name="firstName"
// //                   value={values.firstName}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   placeholder="John"
// //                   fullWidth
// //                   error={Boolean(touched.firstName && errors.firstName)}
// //                 />
// //                 {touched.firstName && errors.firstName && (
// //                   <FormHelperText error>{errors.firstName}</FormHelperText>
// //                 )}
// //               </Stack>
// //             </Grid>
// //             <Grid item xs={12} md={6}>
// //               <Stack spacing={1}>
// //                 <InputLabel htmlFor="lastName-register">Last Name*</InputLabel>
// //                 <OutlinedInput
// //                   id="lastName-register"
// //                   name="lastName"
// //                   value={values.lastName}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   placeholder="Doe"
// //                   fullWidth
// //                   error={Boolean(touched.lastName && errors.lastName)}
// //                 />
// //                 {touched.lastName && errors.lastName && (
// //                   <FormHelperText error>{errors.lastName}</FormHelperText>
// //                 )}
// //               </Stack>
// //             </Grid>
// //             <Grid item xs={12} md={6}>
// //               <Stack spacing={1}>
// //                 <InputLabel htmlFor="email">Admin Email*</InputLabel>
// //                 <OutlinedInput
// //                   id="email"
// //                   name="email"
// //                   type="email"
// //                   placeholder="npo1@gmail.com"
// //                   fullWidth
// //                   value={values.email}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   error={Boolean(touched.email && errors.email)}
// //                 />
// //                 {touched.email && errors.email && (
// //                   <FormHelperText error>{errors.email}</FormHelperText>
// //                 )}
// //               </Stack>
// //             </Grid>
// //             <Grid item xs={12} md={6}>
// //               <Stack spacing={1}>
// //                 <InputLabel htmlFor="phone">Phone*</InputLabel>
// //                 <OutlinedInput
// //                   id="phone"
// //                   name="phone"
// //                   type="tel"
// //                   placeholder="23542352345"
// //                   fullWidth
// //                   value={values.phone}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   error={Boolean(touched.phone && errors.phone)}
// //                 />
// //                 {touched.phone && errors.phone && (
// //                   <FormHelperText error>{errors.phone}</FormHelperText>
// //                 )}
// //               </Stack>
// //             </Grid>
// //             {/* <Grid item xs={12} md={6}>
// //               <Stack spacing={1}>
// //                 <InputLabel htmlFor="password-register">
// //                   Admin Password*
// //                 </InputLabel>
// //                 <OutlinedInput
// //                   fullWidth
// //                   error={Boolean(touched.password && errors.password)}
// //                   id="password-register"
// //                   type={showPassword ? "text" : "password"}
// //                   value={values.password}
// //                   name="password"
// //                   onBlur={handleBlur}
// //                   onChange={handleChange}
// //                   endAdornment={
// //                     <InputAdornment position="end">
// //                       <IconButton
// //                         aria-label="toggle password visibility"
// //                         onClick={handleClickShowPassword}
// //                         onMouseDown={handleMouseDownPassword}
// //                         edge="end"
// //                         color="secondary"
// //                       >
// //                         {showPassword ? (
// //                           <EyeOutlined />
// //                         ) : (
// //                           <EyeInvisibleOutlined />
// //                         )}
// //                       </IconButton>
// //                     </InputAdornment>
// //                   }
// //                   placeholder="********"
// //                 />
// //                 {touched.password && errors.password && (
// //                   <FormHelperText error>{errors.password}</FormHelperText>
// //                 )}
// //               </Stack>
// //             </Grid> */}
// //              {/* <Grid item xs={12}>
// //                 <Stack spacing={1}>
// //                     <InputLabel>Choose your Brand Color*</InputLabel>
// //                     <Box sx={{ pt: 1 }}>
// //                         <CirclePicker
// //                             color={values.themeColor}
// //                             // On change, we use Formik's setFieldValue to update the form state
// //                             onChangeComplete={(color) => setFieldValue('themeColor', color.hex)}
// //                             colors={[
// //                                 '#00A76F', '#007BFF', '#6f42c1', '#D62976',
// //                                 '#fd5c2e', '#ffc107', '#28a745', '#17a2b8',
// //                                 '#343a40', '#6c757d', '#dc3545', '#005249'
// //                             ]} // A nice palette of preset colors
// //                             width="100%"
// //                             circleSpacing={11}
// //                         />
// //                     </Box>
// //                      {touched.themeColor && errors.themeColor && (
// //                         <FormHelperText error>{errors.themeColor}</FormHelperText>
// //                     )}
// //                 </Stack>
// //             </Grid> */}
// //           </Grid>
// //           <Grid item xs={12}>
// //               <Typography variant="body2" align="left" sx={{ mt: 3 }}>
// //                 By signing up, you agree to our{" "}
// //                 <Link variant="subtitle2" component={RouterLink} to="#">
// //                   Terms of Service
// //                 </Link>{" "}
// //                 and{" "}
// //                 <Link variant="subtitle2" component={RouterLink} to="#">
// //                   Privacy Policy
// //                 </Link>
// //                 .
// //               </Typography>
// //             </Grid>
// //             <Grid item xs={12} mt={5}>
// //               <Stack direction="row" spacing={2} justifyContent="flex-end">
// //                 <Button variant="outlined" color="secondary" onClick={onBack}>
// //                   Back
// //                 </Button>
// //                 <AnimateButton>
// //                   <Button
// //                     disableElevation
// //                     disabled={isSubmitting}
// //                     type="submit"
// //                     variant="contained"
// //                     color="primary"
// //                   >
// //                     Create Account
// //                   </Button>
// //                 </AnimateButton>
// //               </Stack>
// //             </Grid>
// //         </form>
// //       )}
// //     </Formik>
// //   );
// // }
// import React, { useState } from "react";
// import { Link as RouterLink } from "react-router-dom";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Grid,
//   Typography,
//   Stack,
//   InputLabel,
//   OutlinedInput,
//   InputAdornment,
//   FormHelperText,
//   Link,
//   IconButton
// } from "@mui/material";
// import * as Yup from "yup";
// import { Formik } from "formik";
// import AnimateButton from "../../@extended/AnimateButton";
// import api from "../api";
// import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

// export default function AuthRegister({ onSuccess, onBack, registrationData }) {
//   const [showPassword, setShowPassword] = useState(false);
//   const handleClickShowPassword = () => setShowPassword(!showPassword);
//   const handleMouseDownPassword = (event) => event.preventDefault();

//   const selectedPlan = registrationData?.plan || {
//     name: "Basic Plan",
//     price: "$49/month",
//     description: "Good for small organizations."
//   };

//   return (
//     <Formik
//       initialValues={{
//         npoName: "",
//         subdomain: "",
//         email: "",
//         phone: "",
//         firstName: "",
//         lastName: "",
//         password: "",
//         themeColor: "#00A76F",
//         submit: null
//       }}
//       validationSchema={Yup.object().shape({
//         npoName: Yup.string().max(255).required("NPO Name is required"),
//         subdomain: Yup.string()
//           .matches(/^[a-zA-Z0-9-]+$/, "Only alphanumeric and hyphens allowed")
//           .max(63)
//           .required("Subdomain is required"),
//         email: Yup.string()
//           .email("Must be a valid email")
//           .max(255)
//           .required("Email is required"),
//         phone: Yup.string()
//           .matches(/^\d{10,15}$/, "Phone number is invalid")
//           .required("Phone is required"),
//         firstName: Yup.string().max(255).required("First Name is required"),
//         lastName: Yup.string().max(255).required("Last Name is required"),
//         themeColor: Yup.string().required("A brand color is required.")
//       })}
//       onSubmit={async (values, { setErrors, setSubmitting }) => {
//         try {
//           setSubmitting(true);
//           const fullRegistrationData = {
//             ...registrationData,
//             name: values.npoName,
//             domainSlug: values.subdomain,
//             email: values.email,
//             phone: values.phone,
//             firstName: values.firstName,
//             lastName: values.lastName,
//             password: "devdev",
//             themeColor: values.themeColor
//           };

//           await api.post("/auth/register", fullRegistrationData);
//           onSuccess();
//         } catch (error) {
//           const message =
//             error.response?.data?.message ||
//             "Registration failed. Please try again.";
//           setErrors({ submit: message });
//         } finally {
//           setSubmitting(false);
//         }
//       }}
//     >
//       {({
//         errors,
//         handleBlur,
//         handleChange,
//         handleSubmit,
//         isSubmitting,
//         touched,
//         values
//       }) => (
//         <form noValidate onSubmit={handleSubmit}>
//           <Grid container spacing={4}>
//             {/* === Left Summary Card === */}
//             <Grid item xs={12} md={4}>
//               <Card sx={{ p: 2 }}>
//                 <CardContent>
//                   <Typography variant="h6">Your Selected Plan</Typography>
//                   <Typography variant="subtitle1" sx={{ mt: 1 }}>
//                     {selectedPlan.name}
//                   </Typography>
//                   <Typography variant="body2" sx={{ mt: 0.5 }}>
//                     {selectedPlan.description}
//                   </Typography>
//                   <Typography variant="h5" sx={{ mt: 2 }}>
//                     {selectedPlan.price}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* === Right Registration Form === */}
//             <Grid item xs={12} md={8}>
//               <Box sx={{ maxWidth: 800 }}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} md={6}>
//                     <Stack spacing={1}>
//                       <InputLabel htmlFor="npo-name">NPO Name*</InputLabel>
//                       <OutlinedInput
//                         fullWidth
//                         id="npo-name"
//                         name="npoName"
//                         value={values.npoName}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         placeholder="Christ Charity"
//                         error={Boolean(touched.npoName && errors.npoName)}
//                       />
//                       {touched.npoName && errors.npoName && (
//                         <FormHelperText error>{errors.npoName}</FormHelperText>
//                       )}
//                     </Stack>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <Stack spacing={1}>
//                       <InputLabel htmlFor="subdomain">NPO Subdomain*</InputLabel>
//                       <OutlinedInput
//                         fullWidth
//                         id="subdomain"
//                         name="subdomain"
//                         placeholder="npo1"
//                         value={values.subdomain}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={Boolean(touched.subdomain && errors.subdomain)}
//                         endAdornment={
//                           <InputAdornment position="end">
//                             <Typography sx={{ whiteSpace: "nowrap" }}>
//                               .nightbright.org
//                             </Typography>
//                           </InputAdornment>
//                         }
//                       />
//                       {touched.subdomain && errors.subdomain && (
//                         <FormHelperText error>{errors.subdomain}</FormHelperText>
//                       )}
//                     </Stack>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <Stack spacing={1}>
//                       <InputLabel htmlFor="firstName">First Name*</InputLabel>
//                       <OutlinedInput
//                         fullWidth
//                         id="firstName"
//                         name="firstName"
//                         placeholder="John"
//                         value={values.firstName}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={Boolean(touched.firstName && errors.firstName)}
//                       />
//                       {touched.firstName && errors.firstName && (
//                         <FormHelperText error>{errors.firstName}</FormHelperText>
//                       )}
//                     </Stack>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <Stack spacing={1}>
//                       <InputLabel htmlFor="lastName">Last Name*</InputLabel>
//                       <OutlinedInput
//                         fullWidth
//                         id="lastName"
//                         name="lastName"
//                         placeholder="Doe"
//                         value={values.lastName}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={Boolean(touched.lastName && errors.lastName)}
//                       />
//                       {touched.lastName && errors.lastName && (
//                         <FormHelperText error>{errors.lastName}</FormHelperText>
//                       )}
//                     </Stack>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <Stack spacing={1}>
//                       <InputLabel htmlFor="email">Admin Email*</InputLabel>
//                       <OutlinedInput
//                         fullWidth
//                         id="email"
//                         name="email"
//                         type="email"
//                         placeholder="npo1@gmail.com"
//                         value={values.email}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={Boolean(touched.email && errors.email)}
//                       />
//                       {touched.email && errors.email && (
//                         <FormHelperText error>{errors.email}</FormHelperText>
//                       )}
//                     </Stack>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <Stack spacing={1}>
//                       <InputLabel htmlFor="phone">Phone*</InputLabel>
//                       <OutlinedInput
//                         fullWidth
//                         id="phone"
//                         name="phone"
//                         type="tel"
//                         placeholder="1234567890"
//                         value={values.phone}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={Boolean(touched.phone && errors.phone)}
//                       />
//                       {touched.phone && errors.phone && (
//                         <FormHelperText error>{errors.phone}</FormHelperText>
//                       )}
//                     </Stack>
//                   </Grid>

//                   <Grid item xs={12}>
//                     <Typography variant="body2" sx={{ mt: 2 }}>
//                       By signing up, you agree to our{" "}
//                       <Link component={RouterLink} to="#">
//                         Terms of Service
//                       </Link>{" "}
//                       and{" "}
//                       <Link component={RouterLink} to="#">
//                         Privacy Policy
//                       </Link>
//                       .
//                     </Typography>
//                   </Grid>

//                   <Grid item xs={12}>
//                     <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
//                       <Button variant="outlined" onClick={onBack}>
//                         Back
//                       </Button>
//                       <AnimateButton>
//                         <Button
//                           type="submit"
//                           variant="contained"
//                           disabled={isSubmitting}
//                         >
//                           Create Account
//                         </Button>
//                       </AnimateButton>
//                     </Stack>
//                   </Grid>
//                 </Grid>
//               </Box>
//             </Grid>
//           </Grid>
//         </form>
//       )}
//     </Formik>
//   );
// }
import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  InputLabel,
  OutlinedInput,
  Stack,
  FormHelperText,
  Button,
  Link,
  FormControl,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import AnimateButton from "../../@extended/AnimateButton";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import api from "../api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
export default function AuthRegister({ onSuccess, onBack, registrationData }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const selectedPlan = registrationData?.planType || "Starter";
  const paymentMethodId = registrationData?.paymentMethodId || "";

  return (
    <Formik
      initialValues={{
        npoName: "",
        subdomain: "",
        email: "",
        phone: "",
        firstName: "",
        lastName: "",
        themeColor: "#00A76F",
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        npoName: Yup.string().max(255).required("NPO Name is required"),
        subdomain: Yup.string()
          .matches(/^[a-zA-Z0-9-]+$/, "Only alphanumeric and hyphens allowed")
          .max(63)
          .required("Subdomain is required"),
        email: Yup.string()
          .email("Must be a valid email")
          .max(255)
          .required("Email is required"),
        // phone: Yup.string()
        //   .matches(/^\d{10,15}$/, "Phone number is invalid")
        //   .required("Phone is required"),
        firstName: Yup.string().max(255).required("First Name is required"),
        // lastName: Yup.string().max(255).required("Last Name is required"),
      })}
      onSubmit={async (values, { setErrors }) => {
        try {
          setSubmitting(true);

          const data = {
            name: values.npoName,
            domainSlug: values.subdomain,
            email: values.email,
            phone: values.phone,
            firstName: values.firstName,
            lastName: values.lastName,
            themeColor: values.themeColor,
            planType: selectedPlan,
            paymentMethodId: paymentMethodId,
          };

          await api.post("/auth/register", data);
          onSuccess();
        } catch (error) {
          const message =
            error.response?.data?.message ||
            "Something went wrong. Please try again.";
          setErrors({ submit: message });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        touched,
        values,
        setFieldValue,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              marginTop: "40px",
            }}
          >
            {/* <Box>
              <Card
                sx={{
                  p: 3,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  boxShadow: 2,
                  width: 300,
                  textAlign: "center",
                  height: 410,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Your Subscription
                </Typography>
                <Typography
                  variant="h4"
                  color="primary"
                  sx={{ textTransform: "capitalize" }}
                >
                  {selectedPlan}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Your payment method has been securely saved.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <Link href="#" underline="hover">
                    You can always cancel your subscription later.
                  </Link>
                </Typography>
              </Card>
            </Box> */}

            <Box
              sx={{ width: "100%" }}
            >
              <Stack spacing={3}>
                {/* === Row 1: NPO Name + Subdomain === */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                  }}
                >
                  {/* NPO Name */}
                  <FormControl
                    sx={{ flex: 1 }}
                    error={Boolean(touched.npoName && errors.npoName)}
                  >
                    <InputLabel htmlFor="npo-name">NPO Name*</InputLabel>
                    <OutlinedInput
                      id="npo-name"
                      name="npoName"
                      label="NPO Name*"
                      value={values.npoName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      sx={{
                        borderRadius: 2,
                        height: 44,
                        "& input": {
                          padding: "12px 14px",
                        },
                      }}
                    />
                    {touched.npoName && errors.npoName && (
                      <FormHelperText>{errors.npoName}</FormHelperText>
                    )}
                  </FormControl>

                  {/* Subdomain */}
                  <FormControl
                    sx={{ flex: 1 }}
                    error={Boolean(touched.subdomain && errors.subdomain)}
                  >
                    <InputLabel htmlFor="subdomain">Subdomain*</InputLabel>
                    <OutlinedInput
                      id="subdomain"
                      name="subdomain"
                      label="Subdomain*"
                      value={values.subdomain}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      endAdornment={
                        <Box
                          component="span"
                          sx={{ ml: 1, whiteSpace: "nowrap" }}
                        >
                          .nightbright.org
                        </Box>
                      }
                      sx={{
                        borderRadius: 2,
                        height: 44,
                        "& input": {
                          padding: "12px 14px",
                        },
                      }}
                    />
                    {touched.subdomain && errors.subdomain && (
                      <FormHelperText>{errors.subdomain}</FormHelperText>
                    )}
                  </FormControl>
                </Box>

                {/* === Row 2: First Name + Last Name === */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                  }}
                >
                  <FormControl
                    sx={{ flex: 1 }}
                    error={Boolean(touched.firstName && errors.firstName)}
                  >
                    <InputLabel htmlFor="firstName">First Name*</InputLabel>
                    <OutlinedInput
                      id="firstName"
                      name="firstName"
                      label="First Name*"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      sx={{
                        borderRadius: 2,
                        height: 44,
                        "& input": {
                          padding: "12px 14px",
                        },
                      }}
                    />
                    {touched.firstName && errors.firstName && (
                      <FormHelperText>{errors.firstName}</FormHelperText>
                    )}
                  </FormControl>

                  <FormControl
                    sx={{ flex: 1 }}
                    error={Boolean(touched.lastName && errors.lastName)}
                  >
                    <InputLabel htmlFor="lastName">Last Name</InputLabel>
                    <OutlinedInput
                      id="lastName"
                      name="lastName"
                      label="Last Name"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      sx={{
                        borderRadius: 2,
                        height: 44,
                        "& input": {
                          padding: "12px 14px",
                        },
                      }}
                    />
                    {touched.lastName && errors.lastName && (
                      <FormHelperText>{errors.lastName}</FormHelperText>
                    )}
                  </FormControl>
                </Box>

                {/* === Row 3: Admin Email + Phone === */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                  }}
                >
                  <FormControl
                    sx={{ flex: 1 }}
                    error={Boolean(touched.email && errors.email)}
                  >
                    <InputLabel htmlFor="email"> Email*</InputLabel>
                    <OutlinedInput
                      id="email"
                      name="email"
                      label=" Email*"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      sx={{
                        borderRadius: 2,
                        height: 44,
                        "& input": {
                          padding: "12px 14px",
                        },
                      }}
                    />
                    {touched.email && errors.email && (
                      <FormHelperText>{errors.email}</FormHelperText>
                    )}
                  </FormControl>
                  <FormControl
                    sx={{ flex: 1 }}
                    error={Boolean(touched.phone && errors.phone)}
                  >
                    <PhoneInput
                      country={"us"} 
                      value={values.phone}
                      onChange={(phone) => setFieldValue("phone", phone)}
                      onBlur={handleBlur}
                      inputProps={{
                        name: "phone",
                        required: true,
                        autoFocus: false,
                      }}
                      inputStyle={{
                        width: "100%",
                        height: 44,
                        borderRadius: 8,
                      }}
                      buttonStyle={{
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                      }}
                      containerStyle={{
                        width: "100%",
                      }}
                    />
                    {touched.phone && errors.phone && (
                      <FormHelperText>{errors.phone}</FormHelperText>
                    )}
                  </FormControl>
                </Box>

                {/* Terms & Privacy */}
                <Box>
                  By signing up, you agree to our{" "}
                  <Link component={RouterLink} to="#">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link component={RouterLink} to="#">
                    Privacy Policy
                  </Link>
                  .
                </Box>

                {/* Submit Actions */}
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button variant="outlined" onClick={onBack}>
                    Back
                  </Button>
                  <AnimateButton>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Create Account"}
                    </Button>
                  </AnimateButton>
                </Stack>

                {/* Submit Errors */}
                {errors.submit && (
                  <FormHelperText error>{errors.submit}</FormHelperText>
                )}
              </Stack>
            </Box>
          </Box>
        </form>
      )}
    </Formik>
  );
}
