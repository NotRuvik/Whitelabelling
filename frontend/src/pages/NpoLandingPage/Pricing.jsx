// // import React from "react";
// // import "./LandingPage.css";
// // import NpoNavbar from "./NpoNavbar";
// // import NpoFooter from "./NpoFooter";

// // const Pricing = () => {
// //   return (
// //     <div className="page-container">
// //         <NpoNavbar />
// //             <h1>Pricing Page</h1>
// //             <p>This is where your pricing details will go.</p>
// //         <NpoFooter />
// //     </div>
// //   );
// // };

// // export default Pricing;
// import React, { useEffect, useState } from "react";
// import "./LandingPage.css";
// import NpoNavbar from "./NpoNavbar";
// import NpoFooter from "./NpoFooter";
// import {
//   Box,
//   Button,
//   Typography,
//   Card,
//   CardContent,
//   Radio,
//   CircularProgress,
// } from "@mui/material";
// import CheckIcon from "@mui/icons-material/Check";

// const highlightColor = "#7b61ff";

// const Pricing = () => {
//   const [plans, setPlans] = useState([]);
//   const [selectedPlan, setSelectedPlan] = useState("");
//   const [loading, setLoading] = useState(true);

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
//     return `$${(cents / 100).toFixed(0)}/month`;
//   };

//   return (
//     <div className="page-container">
//       <NpoNavbar />

//       <Box sx={{ py: 5, px: 4 }}>
//         <Typography variant="h4" align="center" fontWeight={700} mb={4}>
//           Our Subscription Plans
//         </Typography>

//         {loading ? (
//           <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <Box
//             sx={{
//               display: "flex",
//               flexWrap: "nowrap",
//               overflowX: "auto",
//               gap: 3,
//               px: 5,
//               py:2
//               //pb: 5,
//             }}
//           >
//             {plans.map((plan) => {
//               const isPopular = plan.name === "business";
//               const isSelected = selectedPlan === plan.name;

//               return (
//                 <Card
//                   key={plan.name}
//                   onClick={() => setSelectedPlan(plan.name)}
//                   sx={{
//                     minWidth: 260,
//                     maxWidth: 280,
//                     flexShrink: 0,
//                     height: isSelected ? 630 : 600,
//                     border: isSelected
//                       ? `2px solid ${highlightColor}`
//                       : "1px solid #ddd",
//                     boxShadow: isSelected ? 6 : 2,
//                     transform: isSelected ? "scale(1.04)" : "scale(1)",
//                     transition: "all 0.3s ease",
//                     borderRadius: 3,
//                     cursor: "pointer",
//                     position: "relative",
//                     "&:hover": {
//                       boxShadow: 6,
//                       transform: "scale(1.03)",
//                     },
//                   }}
//                 >
//                   {/* {isPopular && (
//                     <Box
//                       sx={{
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bgcolor: highlightColor,
//                         color: "white",
//                         fontWeight: 600,
//                         fontSize: "0.75rem",
//                         py: 0.5,
//                         textAlign: "center",
//                       }}
//                     >
//                       ⚡ Most popular
//                     </Box>
//                   )} */}
//                   <CardContent sx={{ pt: isPopular ? 4 : 2 }}>
//                     <Box display="flex" justifyContent="center" mb={1}>
//                       {/* <Radio
//                         checked={isSelected}
//                         value={plan.name}
//                         color="primary"
//                         sx={{ p: 0.5 }}
//                       /> */}
//                     </Box>
//                     <Typography
//                       variant="h6"
//                       fontWeight="bold"
//                       textAlign="center"
//                       sx={{ textTransform: "capitalize" }}
//                     >
//                       {plan.name}
//                     </Typography>
//                     <Typography
//                       variant="h4"
//                       fontWeight="bold"
//                       textAlign="center"
//                       sx={{ mt: 1 }}
//                     >
//                       {formatPrice(plan.priceInCents)}
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       textAlign="center"
//                       sx={{ color: "#666", mt: 0.5 }}
//                     >
//                       {plan.description}
//                     </Typography>

//                     <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 600 }}>
//                       Usage
//                     </Typography>
//                     <Box mt={1}>
//                       {plan.usage.map((usage, i) => (
//                         <Typography
//                           key={i}
//                           variant="body2"
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 1,
//                             mb: 0.5,
//                           }}
//                         >
//                           <CheckIcon fontSize="small" sx={{ color: "#5cb85c" }} />{" "}
//                           {usage}
//                         </Typography>
//                       ))}
//                     </Box>

//                     <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 600 }}>
//                       Features
//                     </Typography>
//                     <Box mt={1}>
//                       {plan.features.map((feature, i) => (
//                         <Typography
//                           key={i}
//                           variant="body2"
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 1,
//                             mb: 0.5,
//                           }}
//                         >
//                           <CheckIcon fontSize="small" sx={{ color: "#5cb85c" }} />{" "}
//                           {feature}
//                         </Typography>
//                       ))}
//                     </Box>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </Box>
//         )}
//       </Box>

//       <NpoFooter />
//     </div>
//   );
// };

// export default Pricing;

import React, { useEffect, useState } from "react";
import "./LandingPage.css"; // Keep your existing CSS import
import NpoNavbar from "./NpoNavbar"; // Keep your Navbar import
import NpoFooter from "./NpoFooter"; // Keep your Footer import
import {
  Box,
  Button, // Needed for the "Let's talk" button
  Typography,
  Card,
  CardContent,
  CircularProgress,
  // Radio, // Not needed if you don't want a radio button for selection
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom"; // Needed for "Let's talk" button navigation

// Define highlightColor consistent with your other component
const highlightColor = "#7b61ff";

const Pricing = () => {
  const navigate = useNavigate(); // Initialize useNavigate for the "Let's talk" button

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  // No need for selectedPlan state if you're not handling selection/payment flow here,
  // but if you want to keep the "selected" visual state for demonstration, you can.
  // For this pure display version, I'll remove active selection logic for simplicity
  // but keep the styling for the "Most popular" card.

  useEffect(() => {
    // Fetch plans just like in SubscriptionPlans
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
    // Modified to match the display on the pricing page (e.g., "$10/month" not just "$10")
    return `$${(cents / 100).toFixed(0)}/month`;
  };

  return (
    <div className="page-container">
      <NpoNavbar />

      <Box sx={{ py: 5, px: 4 }}>
        <Typography variant="h4" align="center" fontWeight={700} mb={4}>
          Our Subscription Plans
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "nowrap", // Ensure cards stay in a row, allowing horizontal scroll
              overflowX: "auto", // Enable horizontal scrolling if cards overflow
              gap: 3, // Gap between cards
              px: 5, // Padding on the sides
              py: 2, // Padding top/bottom
              pb: 5, // Increased bottom padding to ensure scrollbar visibility
              justifyContent: 'center', // Center items when they don't overflow
              // You might want to adjust max-width or use a container for responsiveness
              // For example: maxWidth: '1200px', margin: '0 auto'
            }}
          >
            {plans.map((plan) => {
              const isPopular = plan.name === "business";
              // Removed isSelected logic as we're not selecting in this component
              // const isSelected = selectedPlan === plan.name;

              return (
                <Card
                  key={plan.name}
                  // Removed onClick to prevent selection behavior
                  sx={{
                    minWidth: 260, // Minimum width for each card
                    maxWidth: 280, // Maximum width for each card
                    flexShrink: 0, // Prevent cards from shrinking
                    // Removed height/transform based on selection, keep consistent height
                    // Adjusted fixed height for better consistency
                    height: isPopular ? 470 : 450, // Slightly taller for popular tag
                    border: isPopular
                      ? `2px solid ${highlightColor}`
                      : "1px solid #ddd", // Highlight popular card
                    boxShadow: isPopular ? 6 : 2, // Emphasize popular card
                    borderRadius: 3,
                    cursor: "default", // No pointer cursor since not selectable
                    position: "relative",
                    bgcolor: isPopular ? "#EEF2FF" : "#fff", // Highlight popular card background
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: 6, // Keep hover effect
                      transform: isPopular ? "scale(1.03)" : "scale(1)", // Only scale popular on hover if desired
                    },
                  }}
                >
                  {isPopular && (
                    <Box
                      sx={{
                        position: "absolute",
                        width: "100%",
                        // Adjusting top and left for the "Most popular" tag position
                        top: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        bgcolor: highlightColor,
                        color: "#fff",
                        px: 2,
                        py: 0.5,
                        fontSize: "0.75rem",
                        borderRadius: "4px",
                        textAlign: 'center', // Ensure text is centered within the tag
                      }}
                    >
                      ⚡ Most popular
                    </Box>
                  )}
                  <CardContent sx={{ pt: isPopular ? 4 : 2 }}>
                    {/* Removed Radio button */}
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      textAlign="center"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {plan.name}
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      textAlign="center"
                      sx={{ mt: 1 }}
                    >
                      {/* Using the formatPrice function */}
                      {formatPrice(plan.priceInCents)}
                    </Typography>
                    <Typography
                      variant="body2"
                      textAlign="center"
                      sx={{ color: "#666", mt: 0.5 }}
                    >
                      {plan.description}
                    </Typography>

                    {/* "Get started free" / "Let's talk" Button */}
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
                      onClick={() => {
                        // Navigate to contact page if Custom, otherwise do nothing or a different action
                        if (!plan.priceInCents) {
                          navigate("/npoLanding/contact");
                        } else {
                          // For paid plans, you might link to a registration/signup page
                          // or do nothing, as per the requirement of "no payment flow".
                          // For now, let's keep it simple: if it has a price, it means
                          // they should probably go to signup or a specific plan page.
                          // For pure UI, this button might just do nothing or show an alert.
                          // Let's assume for now, it's a placeholder or leads to general signup.
                          // You can add `Maps('/signup')` or similar if appropriate.
                          console.log(`Clicked on ${plan.name} plan`);
                        }
                      }}
                    >
                      {plan.priceInCents ? "Get started free" : "Let's talk"}
                    </Button>

                    {/* <Typography
                      variant="subtitle2"
                      sx={{ mt: 2, fontWeight: 600, textAlign: "center" }}
                    >
                      Usage
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
                      {plan.usage.map((usage, i) => (
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
                          <Typography variant="body2">{usage}</Typography>
                        </Box>
                      ))}
                    </Box> */}

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
        )}
      </Box>

      <NpoFooter />
    </div>
  );
};

export default Pricing;