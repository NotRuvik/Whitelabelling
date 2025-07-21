// // import React, { useState, useEffect } from "react";
// // import {
// //   Box,
// //   Button,
// //   Typography,
// //   Card,
// //   CardContent,
// //   Radio,
// //   CircularProgress,
// //   FormHelperText,
// // } from "@mui/material";
// // import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// // import CheckIcon from "@mui/icons-material/Check";
// // import { useNavigate } from "react-router-dom";

// // const highlightColor = "#7b61ff";

// // const cardElementOptions = {
// //   style: {
// //     base: {
// //       color: "#32325d",
// //       fontFamily: "Arial, sans-serif",
// //       fontSmoothing: "antialiased",
// //       fontSize: "16px",
// //       "::placeholder": { color: "#aab7c4" },
// //     },
// //     invalid: {
// //       color: "#fa755a",
// //       iconColor: "#fa755a",
// //     },
// //   },
// // };

// // const SubscriptionPlans = ({ onPlanSelect }) => {
// //   const [plans, setPlans] = useState([]);
// //   const [selectedPlan, setSelectedPlan] = useState("");
// //   const [loading, setLoading] = useState(true);
// //   const [showPayment, setShowPayment] = useState(false);
// //   const [processing, setProcessing] = useState(false);
// //   const [error, setError] = useState(null);

// //   const navigate = useNavigate();
// //   const stripe = useStripe();
// //   const elements = useElements();
// //   useEffect(() => {
// //     fetch("http://localhost:5000/api/v1/plans")
// //       .then((res) => res.json())
// //       .then((response) => {
// //         console.log("Raw API response:", response);
// //         const apiPlans = Array.isArray(response)
// //           ? response
// //           : Array.isArray(response.data)
// //           ? response.data
// //           : [];

// //         const cleanedPlans = apiPlans.map((plan) => ({
// //           ...plan,
// //           features:
// //             Array.isArray(plan.features) && plan.features[0]?.trim()
// //               ? plan.features
// //               : [],
// //           usage:
// //             Array.isArray(plan.usage) && plan.usage[0]?.trim()
// //               ? plan.usage
// //               : [],
// //         }));

// //         const sortOrder = [
// //           "starter",
// //           "standard",
// //           "premium",
// //           "business",
// //           "enterprise",
// //           "custom",
// //         ];
// //         const sortedPlans = cleanedPlans.sort(
// //           (a, b) => sortOrder.indexOf(a.name) - sortOrder.indexOf(b.name)
// //         );

// //         setPlans(sortedPlans);
// //         setLoading(false);
// //       })
// //       .catch((err) => {
// //         console.error("Error fetching plans:", err);
// //         setPlans([]);
// //         setLoading(false);
// //       });
// //   }, []);

// //   const formatPrice = (cents) => {
// //     if (cents === null || cents === undefined) return "Custom";
// //     return `$${(cents / 100).toFixed(0)}/month`;
// //   };

// //   const handleContinue = () => {
// //     setShowPayment(true);
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!stripe || !elements) return;

// //     setProcessing(true);
// //     const cardElement = elements.getElement(CardElement);

// //     const { error: stripeError, paymentMethod } =
// //       await stripe.createPaymentMethod({
// //         type: "card",
// //         card: cardElement,
// //       });

// //     if (stripeError) {
// //       setError(stripeError.message);
// //       setProcessing(false);
// //       return;
// //     }

// //     setError(null);
// //     onPlanSelect({
// //       planName: selectedPlan,
// //       paymentMethodId: paymentMethod.id,
// //     });
// //     setProcessing(false);
// //   };

// //   if (loading) {
// //     return (
// //       <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
// //         <CircularProgress />
// //       </Box>
// //     );
// //   }

// //   return (
// //     <Box>
// //       {!showPayment ? (
// //         <>
// //           <Typography
// //             variant="h6"
// //             sx={{
// //               display: "flex",
// //               justifyContent: "center",
// //               mb: 2,
// //               fontWeight: 600,
// //             }}
// //           >
// //             Please choose a subscription plan to start with
// //           </Typography>

// //           <Box
// //             sx={{
// //               display: "flex",
// //               flexWrap: "nowrap",
// //               overflowX: "auto",
// //               gap: 3,
// //               py: 2,
// //               px: 1,
// //             }}
// //           >
// //             {plans.map((plan) => {
// //               const isPopular = plan.name === "Business";
// //               const isSelected = selectedPlan === plan.name;

// //               return (
// //                 <Card
// //                   key={plan.name}
// //                   onClick={() => setSelectedPlan(plan.name)}
// //                   sx={{
// //                     minWidth: 260,
// //                     maxWidth: 280,
// //                     flexShrink: 0,
// //                     height: isSelected ? 630 : 600,
// //                     border: isSelected
// //                       ? `2px solid ${highlightColor}`
// //                       : "1px solid #ddd",
// //                     boxShadow: isSelected ? 6 : 2,
// //                     transform: isSelected ? "scale(1.04)" : "scale(1)",
// //                     transition: "all 0.3s ease",
// //                     borderRadius: 3,
// //                     cursor: "pointer",
// //                     position: "relative",
// //                     "&:hover": {
// //                       boxShadow: 6,
// //                       transform: "scale(1.03)",
// //                     },
// //                   }}
// //                 >
// //                   {isPopular && (
// //                     <Box
// //                       sx={{
// //                         position: "absolute",
// //                         top: 0,
// //                         left: 0,
// //                         right: 0,
// //                         bgcolor: highlightColor,
// //                         color: "white",
// //                         fontWeight: 600,
// //                         fontSize: "0.75rem",
// //                         py: 0.5,
// //                         textAlign: "center",
// //                       }}
// //                     >
// //                       ⚡ Most popular
// //                     </Box>
// //                   )}
// //                   <CardContent sx={{ pt: isPopular ? 4 : 2 }}>
// //                     <Box display="flex" justifyContent="center" mb={1}>
// //                       <Radio
// //                         checked={isSelected}
// //                         value={plan.name}
// //                         color="primary"
// //                         sx={{ p: 0.5 }}
// //                       />
// //                     </Box>
// //                     <Typography
// //                       variant="h6"
// //                       fontWeight="bold"
// //                       textAlign="center"
// //                       sx={{ textTransform: "capitalize" }}
// //                     >
// //                       {plan.name}
// //                     </Typography>
// //                     <Typography
// //                       variant="h4"
// //                       fontWeight="bold"
// //                       textAlign="center"
// //                       sx={{ mt: 1 }}
// //                     >
// //                       {formatPrice(plan.priceInCents)}
// //                     </Typography>
// //                     <Typography
// //                       variant="body2"
// //                       textAlign="center"
// //                       sx={{ color: "#666", mt: 0.5 }}
// //                     >
// //                       {plan.description}
// //                     </Typography>
// //                     <Typography
// //                       variant="subtitle2"
// //                       sx={{ mt: 2, fontWeight: 600 }}
// //                     >
// //                       Features
// //                     </Typography>
// //                     <Box mt={1}>
// //                       {plan.features.map((feature, i) => (
// //                         <Typography
// //                           key={i}
// //                           variant="body2"
// //                           sx={{
// //                             display: "flex",
// //                             alignItems: "center",
// //                             gap: 1,
// //                             mb: 0.5,
// //                           }}
// //                         >
// //                           <CheckIcon
// //                             fontSize="small"
// //                             sx={{ color: "#5cb85c" }}
// //                           />{" "}
// //                           {feature}
// //                         </Typography>
// //                       ))}
// //                     </Box>

// //                     {isSelected && (
// //                       <Box mt={3} display="flex" justifyContent="center">
// //                         <Button
// //                           variant="contained"
// //                           onClick={(e) => {
// //                             e.stopPropagation();
// //                             handleContinue();
// //                           }}
// //                         >
// //                           Get Started
// //                         </Button>
// //                       </Box>
// //                     )}
// //                   </CardContent>
// //                 </Card>
// //               );
// //             })}
// //           </Box>
// //         </>
// //       ) : (
// //         <Box
// //           display="flex"
// //           flexDirection={{ xs: "column", md: "row" }}
// //           gap={4}
// //           mt={5}
// //         >
// //           {/* Left: Payment Summary Card */}
// //           <Card
// //             sx={{
// //               width: { xs: "100%", md: 350 },
// //               border: `2px solid ${highlightColor}`,
// //               boxShadow: 4,
// //               borderRadius: 3,
// //               p: 3,
// //             }}
// //           >
// //             <CardContent>
// //               <Typography variant="h6" fontWeight="bold" textAlign="center">
// //                 Pay {selectedPlan}
// //               </Typography>

// //               <Typography
// //                 variant="h3"
// //                 fontWeight="bold"
// //                 textAlign="center"
// //                 sx={{ mt: 1 }}
// //               >
// //                 {formatPrice(
// //                   plans.find((plan) => plan.name === selectedPlan)?.priceInCents
// //                 )}
// //               </Typography>

// //               <Typography variant="subtitle1" textAlign="center" sx={{ mb: 2 }}>
// //                 Then{" "}
// //                 {formatPrice(
// //                   plans.find((plan) => plan.name === selectedPlan)?.priceInCents
// //                 )}{" "}
// //                 per month
// //               </Typography>

// //               <Typography variant="body2" sx={{ mb: 2 }}>
// //                 Authorization charge: this temporary authorization will be
// //                 refunded immediately upon successful checkout.
// //               </Typography>

// //               <Typography variant="body2" sx={{ mb: 2 }}>
// //                 Monthly subscription: 30 days free trial, then billed
// //                 automatically after.
// //               </Typography>

// //               <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 600 }}>
// //                 Features
// //               </Typography>
// //               <Box mt={1}>
// //                 {plans
// //                   .find((plan) => plan.name === selectedPlan)
// //                   ?.features.map((feature, i) => (
// //                     <Typography
// //                       key={i}
// //                       variant="body2"
// //                       sx={{
// //                         display: "flex",
// //                         alignItems: "center",
// //                         gap: 1,
// //                         mb: 0.5,
// //                       }}
// //                     >
// //                       <CheckIcon fontSize="small" sx={{ color: "#5cb85c" }} />
// //                       {feature}
// //                     </Typography>
// //                   ))}
// //               </Box>
// //             </CardContent>
// //           </Card>

// //           {/* Right: Stripe Payment Form */}
// //           <Box
// //             component="form"
// //             onSubmit={handleSubmit}
// //             sx={{
// //               flex: 1,
// //               border: "1px solid #ddd",
// //               borderRadius: "8px",
// //               padding: 4,
// //               bgcolor: "#fff",
// //               minWidth: 300,
// //             }}
// //           >
// //             <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
// //               Enter payment details
// //             </Typography>

// //             <Typography variant="body2" sx={{ mb: 1 }}>
// //               Email
// //             </Typography>
// //             <input
// //               type="email"
// //               required
// //               placeholder="Enter your email"
// //               style={{
// //                 width: "100%",
// //                 padding: "12px",
// //                 borderRadius: "4px",
// //                 border: "1px solid #ccc",
// //                 marginBottom: "16px",
// //               }}
// //             />

// //             <Typography variant="body2" sx={{ mb: 1 }}>
// //               Card Information
// //             </Typography>
// //             <CardElement options={cardElementOptions} />

// //             <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
// //               Cardholder Name
// //             </Typography>
// //             <input
// //               type="text"
// //               required
// //               placeholder="Full name on card"
// //               style={{
// //                 width: "100%",
// //                 padding: "12px",
// //                 borderRadius: "4px",
// //                 border: "1px solid #ccc",
// //                 marginBottom: "16px",
// //               }}
// //             />

// //             <Typography variant="body2" sx={{ mb: 1 }}>
// //               Country or Region
// //             </Typography>
// //             <select
// //               required
// //               defaultValue="India"
// //               style={{
// //                 width: "100%",
// //                 padding: "12px",
// //                 borderRadius: "4px",
// //                 border: "1px solid #ccc",
// //                 marginBottom: "16px",
// //               }}
// //             >
// //               <option value="India">India</option>
// //               <option value="US">United States</option>
// //               <option value="UK">United Kingdom</option>
// //             </select>

// //             {error && (
// //               <FormHelperText error sx={{ mb: 2 }}>
// //                 {error}
// //               </FormHelperText>
// //             )}

// //             <Button
// //               type="submit"
// //               variant="contained"
// //               fullWidth
// //               disabled={processing || !stripe}
// //               sx={{ mb: 2 }}
// //             >
// //               {processing ? "Processing..." : "Pay and start trial"}
// //             </Button>

// //             <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
// //               After your trial ends, you’ll be charged{" "}
// //               {formatPrice(
// //                 plans.find((plan) => plan.name === selectedPlan)?.priceInCents
// //               )}{" "}
// //               per month. Cancel anytime.
// //             </Typography>

// //             <Box sx={{ mt: 2, textAlign: "center" }}>
// //               <Button variant="text"
// //               // onClick={() => setShowPayment(false)}
// //               onClick={() => navigate("/")}
// //               >
// //                 Cancel
// //               </Button>
// //             </Box>
// //           </Box>
// //         </Box>
// //       )}
// //     </Box>
// //   );
// // };

// // export default SubscriptionPlans;
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Card,
//   CardContent,
//   CircularProgress,
// } from "@mui/material";
// import CheckIcon from "@mui/icons-material/Check";
// import { useNavigate } from "react-router-dom";

// const highlightColor = "#7b61ff";

// const SubscriptionPlans = ({ onPlanSelect }) => {
//   const navigate = useNavigate();
//   const [plans, setPlans] = useState([]);
//   const [selectedPlan, setSelectedPlan] = useState("starter");
//   const [loading, setLoading] = useState(true);
//   const [billingCycle, setBillingCycle] = useState("monthly");

//   useEffect(() => {
//     fetch("http://localhost:5000/api/v1/plans")
//       .then((res) => res.json())
//       .then((response) => {
//         const apiPlans = Array.isArray(response)
//           ? response
//           : Array.isArray(response.data)
//           ? response.data
//           : [];

//         const cleanedPlans = apiPlans.map((plan) => ({
//           ...plan,
//           features:
//             Array.isArray(plan.features) && plan.features[0]?.trim()
//               ? plan.features
//               : [],
//           usage:
//             Array.isArray(plan.usage) && plan.usage[0]?.trim()
//               ? plan.usage
//               : [],
//         }));

//         const sortOrder = [
//           "starter",
//           "standard",
//           "premium",
//           "business",
//           "enterprise",
//           "custom",
//         ];
//         const sortedPlans = cleanedPlans.sort(
//           (a, b) => sortOrder.indexOf(a.name) - sortOrder.indexOf(b.name)
//         );

//         setPlans(sortedPlans);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching plans:", err);
//         setPlans([]);
//         setLoading(false);
//       });
//   }, []);

//   const formatPrice = (cents) => {
//     if (cents === null || cents === undefined) return "Custom";
//     return `$${(cents / 100).toFixed(0)}`;
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ px: 2, py: 4 }}>
//       {/* Plans */}
//       <Box
//         sx={{
//           display: "flex",
//           flexWrap: "nowrap",
//           overflowX: "auto",
//           gap: 2,
//           pb: 2,
//         }}
//       >
//         {plans.map((plan) => {
//           const isPopular = plan.name === "business";
//           const isSelected = selectedPlan === plan.name;

//           return (
//             <Card
//               key={plan.name}
//               onClick={() => setSelectedPlan(plan.name)}
//               sx={{
//                 minWidth: 230,
//                 maxWidth: 250,
//                 flexShrink: 0,
//                 border: `2px solid ${isSelected ? highlightColor : "#ddd"}`,
//                 boxShadow: isSelected ? 6 : 2,
//                 borderRadius: 4,
//                 cursor: "pointer",
//                 position: "relative",
//                 bgcolor: isSelected ? "#EEF2FF" : "#fff",
//                 transition: "all 0.3s ease",
//                 "&:hover": { boxShadow: 6 },
//               }}
//             >
//               {isPopular && selectedPlan === "business" && (
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     // top: "10px",
//                     width: "100%",
//                     left: "50%",
//                     transform: "translateX(-50%)",
//                     bgcolor: highlightColor,
//                     color: "#fff",
//                     px: 2,
//                     py: 0.5,
//                     fontSize: "0.75rem",
//                     borderRadius: "4px",
//                   }}
//                 >
//                   ⚡ Most popular
//                 </Box>
//               )}

//               <CardContent sx={{ p: 3 }}>
//                 <Typography
//                   variant="h6"
//                   fontWeight="bold"
//                   textAlign="center"
//                   sx={{ textTransform: "capitalize" }}
//                 >
//                   {plan.name}
//                 </Typography>

//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "flex-end",
//                     mt: 1,
//                   }}
//                 >
//                   <Typography variant="h4" fontWeight="bold">
//                     {formatPrice(plan.priceInCents)}
//                   </Typography>
//                   <Typography variant="body2" sx={{ ml: 0.5 }}>
//                     /month
//                   </Typography>
//                 </Box>

//                 <Typography
//                   variant="body2"
//                   textAlign="center"
//                   sx={{ color: "#666", mt: 0.5 }}
//                 >
//                   {plan.description}
//                 </Typography>
//                 {/* Action Button */}
//                 <Button
//                   variant="contained"
//                   fullWidth
//                   sx={{
//                     mt: 3,
//                     bgcolor: "#000",
//                     color: "#fff",
//                     "&:hover": { bgcolor: "#333" },
//                     borderRadius: "30px",
//                     py: 1.5,
//                     fontWeight: "bold",
//                   }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     if (!plan.priceInCents) {
//                       navigate("/npoLanding/contact");
//                     } else {
//                       onPlanSelect(plan);
//                     }
//                   }}
//                 >
//                   {plan.priceInCents ? "Get started free" : "Let's talk"}
//                 </Button>

//                 {/* Features */}
//                 <Typography
//                   variant="subtitle2"
//                   sx={{ mt: 2, fontWeight: 600, textAlign: "center" }}
//                 >
//                   Features
//                 </Typography>

//                 <Box
//                   mt={1}
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "flex-start", // 👈 Left align list!
//                     gap: 0.5,
//                     mx: "auto", // keeps list centered in card horizontally
//                     width: "fit-content", // wrap tight to content
//                   }}
//                 >
//                   {plan.features.map((feature, i) => (
//                     <Box
//                       key={i}
//                       sx={{
//                         display: "flex",
//                         alignItems: "flex-start",
//                       }}
//                     >
//                       <CheckIcon
//                         fontSize="small"
//                         sx={{ color: "#5cb85c", mr: 1, mt: "2px" }} // slight top margin aligns with multi-line text
//                       />
//                       <Typography variant="body2">{feature}</Typography>
//                     </Box>
//                   ))}
//                 </Box>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </Box>
//     </Box>
//   );
// };

// export default SubscriptionPlans;

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const highlightColor = "#7b61ff";

const cardElementOptions = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: "Arial, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": { color: "#aab7c4" },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const SubscriptionPlans = ({ onPlanSelect, onCancel }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("starter");
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/plans")
      .then((res) => res.json())
      .then((response) => {
        const apiPlans = Array.isArray(response)
          ? response
          : Array.isArray(response.data)
          ? response.data
          : [];

        const cleanedPlans = apiPlans.map((plan) => ({
          ...plan,
          features:
            Array.isArray(plan.features) && plan.features[0]?.trim()
              ? plan.features
              : [],
          usage:
            Array.isArray(plan.usage) && plan.usage[0]?.trim()
              ? plan.usage
              : [],
        }));

        const sortOrder = [
          "starter",
          "standard",
          "premium",
          "business",
          "enterprise",
          "custom",
        ];
        const sortedPlans = cleanedPlans.sort(
          (a, b) => sortOrder.indexOf(a.name) - sortOrder.indexOf(b.name)
        );

        setPlans(sortedPlans);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching plans:", err);
        setPlans([]);
        setLoading(false);
      });
  }, []);

  const formatPrice = (cents) => {
    if (cents === null || cents === undefined) return "Custom";
    return `$${(cents / 100).toFixed(0)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const cardElement = elements.getElement(CardElement);

    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      return;
    }

    setError(null);
    onPlanSelect({
      planName: selectedPlan,
      paymentMethodId: paymentMethod.id,
    });
    setProcessing(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, py: 4 }}>
      {!showPayment ? (
        <>
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
              fontWeight: 600,
            }}
          >
            Please choose a subscription plan to start with
          </Typography>
          <Box mt={2} display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "nowrap",
              overflowX: "auto",
              gap: 2,
              pb: 2,
            }}
          >
            {plans.map((plan) => {
              const isPopular = plan.name === "business";
              const isSelected = selectedPlan === plan.name;

              return (
                <Card
                  key={plan.name}
                  onClick={() => setSelectedPlan(plan.name)}
                  sx={{
                    minWidth: 230,
                    maxWidth: 250,
                    flexShrink: 0,
                    border: `2px solid ${isSelected ? highlightColor : "#ddd"}`,
                    boxShadow: isSelected ? 6 : 2,
                    borderRadius: 4,
                    cursor: "pointer",
                    position: "relative",
                    bgcolor: isSelected ? "#EEF2FF" : "#fff",
                    transition: "all 0.3s ease",
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  {isPopular && selectedPlan === "business" && (
                    <Box
                      sx={{
                        position: "absolute",
                        width: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        bgcolor: highlightColor,
                        color: "#fff",
                        px: 2,
                        py: 0.5,
                        fontSize: "0.75rem",
                        borderRadius: "4px",
                      }}
                    >
                      ⚡ Most popular
                    </Box>
                  )}

                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      textAlign="center"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {plan.name}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        mt: 1,
                      }}
                    >
                      <Typography variant="h4" fontWeight="bold">
                        {formatPrice(plan.priceInCents)}
                      </Typography>
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        /month
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      textAlign="center"
                      sx={{ color: "#666", mt: 0.5 }}
                    >
                      {plan.description}
                    </Typography>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 3,
                        bgcolor: "#000",
                        color: "#fff",
                        "&:hover": { bgcolor: "#333" },
                        borderRadius: "30px",
                        py: 1.5,
                        fontWeight: "bold",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!plan.priceInCents) {
                          navigate("/npoLanding/contact");
                        } else {
                          setSelectedPlan(plan.name);
                          setShowPayment(true);
                        }
                      }}
                    >
                      {plan.priceInCents ? "Get started free" : "Let's talk"}
                    </Button>

                    <Typography
                      variant="subtitle2"
                      sx={{ mt: 2, fontWeight: 600, textAlign: "center" }}
                    >
                      Features
                    </Typography>

                    <Box
                      mt={1}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 0.5,
                        mx: "auto",
                        width: "fit-content",
                      }}
                    >
                      {plan.features.map((feature, i) => (
                        <Box
                          key={i}
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                          }}
                        >
                          <CheckIcon
                            fontSize="small"
                            sx={{ color: "#5cb85c", mr: 1, mt: "2px" }}
                          />
                          <Typography variant="body2">{feature}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={4}
          mt={5}
        >
          <Card
            sx={{
              width: { xs: "100%", md: 350 },
              border: `2px solid ${highlightColor}`,
              boxShadow: 4,
              borderRadius: 3,
              p: 3,
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" textAlign="center">
                Pay {selectedPlan}
              </Typography>

              <Typography
                variant="h3"
                fontWeight="bold"
                textAlign="center"
                sx={{ mt: 1 }}
              >
                {formatPrice(
                  plans.find((plan) => plan.name === selectedPlan)?.priceInCents
                )}
              </Typography>

              <Typography variant="subtitle1" textAlign="center" sx={{ mb: 2 }}>
                Then{" "}
                {formatPrice(
                  plans.find((plan) => plan.name === selectedPlan)?.priceInCents
                )}{" "}
                per month
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                Authorization charge: this temporary authorization will be
                refunded immediately upon successful checkout.
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                Monthly subscription: 30 days free trial, then billed
                automatically after.
              </Typography>

              <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 600 }}>
                Features
              </Typography>
              <Box mt={1}>
                {plans
                  .find((plan) => plan.name === selectedPlan)
                  ?.features.map((feature, i) => (
                    <Typography
                      key={i}
                      variant="body2"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <CheckIcon fontSize="small" sx={{ color: "#5cb85c" }} />
                      {feature}
                    </Typography>
                  ))}
              </Box>
            </CardContent>
          </Card>

          {/* Stripe Payment Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              flex: 1,
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: 4,
              bgcolor: "#fff",
              minWidth: 300,
            }}
          >
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Enter payment details
            </Typography>

            <Typography variant="body2" sx={{ mb: 1 }}>
              Email
            </Typography>
            <input
              type="email"
              required
              placeholder="Enter your email"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginBottom: "16px",
              }}
            />

            <Typography variant="body2" sx={{ mb: 1 }}>
              Card Information
            </Typography>
            <CardElement options={cardElementOptions} />

            <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
              Cardholder Name
            </Typography>
            <input
              type="text"
              required
              placeholder="Full name on card"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginBottom: "16px",
              }}
            />

            <Typography variant="body2" sx={{ mb: 1 }}>
              Country or Region
            </Typography>
            <select
              required
              defaultValue="India"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginBottom: "16px",
              }}
            >
              <option value="India">India</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
            </select>

            {error && (
              <FormHelperText error sx={{ mb: 2 }}>
                {error}
              </FormHelperText>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={processing || !stripe}
              sx={{ mb: 2 }}
            >
              {processing ? "Processing..." : "Pay and start trial"}
            </Button>

            <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
              After your trial ends, you’ll be charged{" "}
              {formatPrice(
                plans.find((plan) => plan.name === selectedPlan)?.priceInCents
              )}{" "}
              per month. Cancel anytime.
            </Typography>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Button variant="text" onClick={() => setShowPayment(false)}>
                Back to plans
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SubscriptionPlans;
