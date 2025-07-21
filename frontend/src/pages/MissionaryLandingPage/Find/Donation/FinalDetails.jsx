// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Divider,
//   Button,
//   CircularProgress,
//   IconButton,
//   Select,
//   MenuItem,
//   FormControlLabel,
//   Checkbox,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   CardElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
// console.log(
//   "process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY",
//   process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
// );
// const themeColor = "#C09355";

// // Inner component that can use Stripe hooks
// const CheckoutForm = ({ donationData, onBack }) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [tipPercent, setTipPercent] = useState(12);
//   const [allowContact, setAllowContact] = useState(true);

//   // --- Data Calculation ---
//   const npoCommissionPercent = parseFloat(donationData.commissions.npo) || 0;
//   const missionaryCommissionPercent =
//     parseFloat(donationData.commissions.missionary) || 0;
//   const superAdminCommissionPercent =
//     parseFloat(donationData.commissions.superAdmin) || 0;
//   const donationAmount = parseFloat(donationData.amount);
//   const npoCommissionAmount = (donationAmount * npoCommissionPercent) / 100;
//   const superAdminCommission =
//     (donationAmount * superAdminCommissionPercent) / 100;
//   const missionaryCommissionAmount =
//     (donationAmount * missionaryCommissionPercent) / 100;
//   const fee = 0.39;
//   const total = (
//     donationAmount +
//     npoCommissionAmount +
//     missionaryCommissionAmount +
//     superAdminCommission
//   ).toFixed(2);
//   const handleFinishClick = async () => {
//     if (!stripe || !elements) {
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     const {
//       donationType,
//       donorName,
//       donorEmail,
//       target,
//       isAnonymous,
//       message,
//     } = donationData;

//     // --- One-Time Donation Flow ---
//     if (donationType === "one-time") {
//       try {
//         const response = await fetch(
//           `${process.env.REACT_APP_API_BASE_URL}/donations/create-checkout-session`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               donation: donationAmount,
//               tip: superAdminCommission, //tip,
//               missionaryCommission: missionaryCommissionAmount,
//               npoCommission: npoCommissionAmount,
//               // fee: fee,
//               donorName: donorName,
//               donorEmail: donorEmail,
//               targetId: target.id,
//               targetType: target.type,
//               targetName: target.name,
//               isAnonymous: isAnonymous,
//               message: message,
//             }),
//           }
//         );

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(
//             errorData.message || "Failed to create Stripe session"
//           );
//         }

//         const session = await response.json();
//         await stripe.redirectToCheckout({ sessionId: session.id });
//       } catch (err) {
//         setError(`Could not process donation: ${err.message}`);
//         setIsLoading(false);
//       }
//     }
//     // --- Monthly Subscription Flow ---
//     else if (donationType === "monthly") {
//       try {
//         const { error, paymentMethod } = await stripe.createPaymentMethod({
//           type: "card",
//           card: elements.getElement(CardElement),
//         });

//         if (error) {
//           throw new Error(error.message);
//         }

//         const response = await fetch(
//           `${process.env.REACT_APP_API_BASE_URL}/donations/create-subscription`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               paymentMethodId: paymentMethod.id,
//               donation: donationAmount,
//               tip: superAdminCommission, //tip,
//               donorName,
//               donorEmail,
//               targetId: target.id,
//               targetType: target.type,
//               targetName: target.name,
//               isAnonymous,
//               message,
//             }),
//           }
//         );

//         const subData = await response.json();

//         if (!response.ok) {
//           throw new Error(subData.message || "Failed to create subscription.");
//         }

//         const { clientSecret } = subData.data;
//         const { error: confirmError } = await stripe.confirmCardPayment(
//           clientSecret
//         );

//         if (confirmError) {
//           throw new Error(confirmError.message);
//         }

//         alert("Thank you for your monthly donation!");
//         window.location.href = "/donation-success";
//       } catch (err) {
//         setError(err.message);
//         setIsLoading(false);
//       }
//     }
//   };

//   const CARD_ELEMENT_OPTIONS = {
//     style: {
//       base: {
//         color: "#32325d",
//         fontFamily: "Arial, sans-serif",
//         fontSmoothing: "antialiased",
//         fontSize: "16px",
//         "::placeholder": {
//           color: "#aab7c4",
//         },
//       },
//       invalid: {
//         color: "#fa755a",
//         iconColor: "#fa755a",
//       },
//     },
//   };

//   return (
//     <Box
//       sx={{
//         bgcolor: "#fff",
//         borderRadius: "15px",
//         maxWidth: 530,
//         mx: "auto",
//         p: 4,
//         boxShadow: 3,
//       }}
//     >
//       <IconButton onClick={onBack} disabled={isLoading}>
//         <ArrowBackIcon />
//       </IconButton>

//       <Typography variant="h6" fontWeight="bold" mb={2}>
//         Final Details
//       </Typography>
//       <Divider sx={{ mb: 2 }} />

//       <Box display="flex" justifyContent="space-between" mb={1}>
//         <Typography>
//           {donationData.target.type === "cause"
//             ? `Donation for ${donationData.target.name}`
//             : "Donation"}
//         </Typography>
//         <Typography fontWeight="bold">${donationAmount.toFixed(2)}</Typography>
//       </Box>
//       <Box display="flex" justifyContent="space-between" mb={1}>
//         <Typography sx={{ color: "#999" }}>
//           NPO Fee ({npoCommissionPercent}%)
//         </Typography>
//         <Typography fontWeight="bold">
//           ${npoCommissionAmount.toFixed(2)}
//         </Typography>
//       </Box>
//       <Box display="flex" justifyContent="space-between" mb={2}>
//         <Typography sx={{ color: "#999" }}>
//           Missionary Fee ({missionaryCommissionPercent}%)
//         </Typography>
//         <Typography fontWeight="bold">
//           ${missionaryCommissionAmount.toFixed(2)}
//         </Typography>
//       </Box>

//       <Divider sx={{ mb: 2 }} />
//       {/* <Box
//         sx={{
//           background: "#FFFBE5",
//           borderRadius: "8px",
//           p: 2,
//           mb: 1, // Adjusted margin
//         }}
//       >
//         <Typography fontWeight="bold" mb={1}>
//           Add a tip to support Night Bright
//         </Typography>
//         <Box
//           sx={{
//             background: "#FFFBE5",
//             borderRadius: "8px",
//             p: 2,
//             mb: 1,
//           }}
//         >
//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//           >
//             <Typography variant="body2" sx={{ color: "#888", maxWidth: "70%" }}>
//               Night Bright relies on your generosity to support this free
//               service.
//             </Typography>
//             <Typography fontWeight="bold">
//               {superAdminCommissionPercent}%
//             </Typography>
//           </Box>
//         </Box>
//       </Box> */}
//       <Box
//         sx={{
//           background: "#FFFBE5",
//           borderRadius: "8px",
//           p: 2,
//           mb: 2,
//         }}
//       >
//         <Typography fontWeight="bold" mb={1}>
//           Add a tip to support Night Bright
//         </Typography>
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Typography variant="body2" sx={{ color: "#888", maxWidth: "70%" }}>
//             Why Tip? Night Bright relies on your generosity to support this
//             free service.
//           </Typography>
//           <Select
//             value={tipPercent}
//             onChange={(e) => setTipPercent(parseInt(e.target.value))}
//             sx={{ minWidth: 90 }}
//             disabled={isLoading}
//           >
//             {[0, 5, 10, 12, 15, 20].map((p) => (
//               <MenuItem key={p} value={p}>{p}%</MenuItem>
//             ))}
//           </Select>
//         </Box>
//       </Box>
//       <Box display="flex" justifyContent="space-between" mb={1}>
//         <Typography>Tip Amount</Typography>
//         <Typography fontWeight="bold">
//           ${superAdminCommission.toFixed(2)}
//         </Typography>
//       </Box>
//       <Divider sx={{ mb: 2 }} />
//       {donationData.donationType === "monthly" && (
//         <Box sx={{ my: 3 }}>
//           <Typography variant="body1" fontWeight="bold" mb={1}>
//             Payment Details
//           </Typography>
//           <Box sx={{ border: "1px solid #ccc", borderRadius: "4px", p: 1.5 }}>
//             <CardElement options={CARD_ELEMENT_OPTIONS} />
//           </Box>
//         </Box>
//       )}

//       <FormControlLabel
//         control={
//           <Checkbox
//             checked={allowContact}
//             onChange={(e) => setAllowContact(e.target.checked)}
//             sx={{ "&.Mui-checked": { color: themeColor } }}
//             disabled={isLoading}
//           />
//         }
//         label="Allow Night Bright Inc to contact me"
//         sx={{ mb: 3, mt: 1 }}
//       />

//       {error && (
//         <Typography color="error" sx={{ my: 2, textAlign: "center" }}>
//           {error}
//         </Typography>
//       )}

//       <Button
//         fullWidth
//         variant="contained"
//         disabled={isLoading || !stripe}
//         onClick={handleFinishClick}
//         sx={{
//           bgcolor: themeColor,
//           color: "#fff",
//           fontWeight: "bold",
//           borderRadius: "8px",
//           py: 1.5,
//           textTransform: "none",
//           "&:hover": { bgcolor: "#a98244" },
//           "&.Mui-disabled": {
//             backgroundColor: "#cccccc",
//             color: "#666666",
//           },
//         }}
//       >
//         {isLoading ? (
//           <CircularProgress size={24} color="inherit" />
//         ) : (
//           `Finish Donation ($${total})`
//         )}
//       </Button>
//     </Box>
//   );
// };

// // Wrap the main component with the Elements provider
// const FinalDetails = (props) => (
//   <Elements stripe={stripePromise}>
//     <CheckoutForm {...props} />
//   </Elements>
// );

// export default FinalDetails;
import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  CircularProgress,
  IconButton,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// It's recommended to load the Stripe object outside of a component's render to avoid recreating it on every render.
// Ensure your Stripe publishable key is correctly set in your environment variables.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "your_default_stripe_publishable_key");

const themeColor = "#C09355";

// Inner component that can use Stripe hooks
const CheckoutForm = ({ donationData, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
console.log("donationData,",donationData)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allowContact, setAllowContact] = useState(true);

  // --- Dynamic Tip/Commission Configuration ---
  // Memoize the commission options to avoid recalculation on every render.
  // It expects `donationData.commissions.superAdmin` to be an array of numbers.
  // Falls back to a default array if the prop is not in the expected format.
  const tipOptions = useMemo(() => {
    const opts = donationData?.commissions?.superAdmin;
    if (Array.isArray(opts) && opts.length > 0) {
      return opts;
    }
    // Fallback to the original hardcoded values if the data is not provided correctly.
    return [];
  }, [donationData]);

  // Initialize the tip percentage with the first option available.
  const [tipPercent, setTipPercent] = useState(tipOptions[0]);

  // --- Data Calculation ---
  // All calculations are memoized to optimize performance, re-running only when dependencies change.
  const {
    donationAmount,
    npoCommissionAmount,
    missionaryCommissionAmount,
    tipAmount,
    total,
  } = useMemo(() => {
    const donation = parseFloat(donationData.amount) || 0;
    const npoPercent = parseFloat(donationData.commissions.npo) || 0;
    const missionaryPercent = parseFloat(donationData.commissions.missionary) || 0;

    const npoAmount = (donation * npoPercent) / 100;
    const missionaryAmount = (donation * missionaryPercent) / 100;
    const currentTipAmount = (donation * tipPercent) / 100;

    const totalAmount = (
      donation +
      npoAmount +
      missionaryAmount +
      currentTipAmount
    ).toFixed(2);

    return {
      donationAmount: donation,
      npoCommissionAmount: npoAmount,
      missionaryCommissionAmount: missionaryAmount,
      tipAmount: currentTipAmount,
      total: totalAmount,
    };
  }, [donationData, tipPercent]);

  const npoCommissionPercent = parseFloat(donationData.commissions.npo) || 0;
  const missionaryCommissionPercent = parseFloat(donationData.commissions.missionary) || 0;

  const handleFinishClick = async () => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    setError(null);

    const {
      donationType,
      donorName,
      donorEmail,
      target,
      isAnonymous,
      message,
    } = donationData;

    const commonPayload = {
      donation: donationAmount,
      tip: tipAmount,
      missionaryCommission: missionaryCommissionAmount,
      npoCommission: npoCommissionAmount,
      donorName,
      donorEmail,
      targetId: target.id,
      targetType: target.type,
      targetName: target.name,
      isAnonymous,
      message,
      allowContact,
    };

    // --- One-Time Donation Flow ---
    if (donationType === "one-time") {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/donations/create-checkout-session`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commonPayload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to create Stripe session"
          );
        }

        const session = await response.json();
        await stripe.redirectToCheckout({ sessionId: session.id });
      } catch (err) {
        setError(`Could not process donation: ${err.message}`);
        setIsLoading(false);
      }
    }
    // --- Monthly Subscription Flow ---
    else if (donationType === "monthly") {
      try {
        const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement),
        });

        if (paymentMethodError) {
          throw new Error(paymentMethodError.message);
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/donations/create-subscription`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...commonPayload,
              paymentMethodId: paymentMethod.id,
            }),
          }
        );

        const subData = await response.json();

        if (!response.ok) {
          throw new Error(subData.message || "Failed to create subscription.");
        }

        // Handle 3D Secure authentication if required
        const { clientSecret, status } = subData.data;
        if (status === 'requires_action') {
            const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);
            if (confirmError) {
                throw new Error(confirmError.message);
            }
        }

        alert("Thank you for your monthly donation!"); // Replace with a proper modal/toast notification
        window.location.href = "/donation-success"; // Redirect to a success page
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: "15px",
        maxWidth: 530,
        mx: "auto",
        p: { xs: 2, sm: 4 }, // Responsive padding
        boxShadow: 3,
      }}
    >
      <IconButton onClick={onBack} disabled={isLoading} sx={{ mb: 1 }}>
        <ArrowBackIcon />
      </IconButton>

      <Typography variant="h6" fontWeight="bold" mb={2} textAlign="center">
        Final Details
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Donation Breakdown */}
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography>
          {donationData.target.type === "cause"
            ? `Donation for ${donationData.target.name}`
            : "Donation"}
        </Typography>
        <Typography fontWeight="bold">${donationAmount.toFixed(2)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography sx={{ color: "#999" }}>
          NPO Fee ({npoCommissionPercent}%)
        </Typography>
        <Typography fontWeight="bold">
          ${npoCommissionAmount.toFixed(2)}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography sx={{ color: "#999" }}>
          Missionary Fee ({missionaryCommissionPercent}%)
        </Typography>
        <Typography fontWeight="bold">
          ${missionaryCommissionAmount.toFixed(2)}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Dynamic Tip Section */}
      <Box
        sx={{
          background: "#FFFBE5",
          borderRadius: "8px",
          p: 2,
          mb: 2,
        }}
      >
        <Typography fontWeight="bold" mb={1}>
          Add a tip to support Night Bright
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" sx={{ color: "#888", maxWidth: "70%" }}>
            Why Tip? Night Bright relies on your generosity to support this
            free service.
          </Typography>
          <Select
            value={tipPercent}
            onChange={(e) => setTipPercent(Number(e.target.value))}
            sx={{ minWidth: 90 }}
            disabled={isLoading}
          >
            {tipOptions.map((p) => (
              <MenuItem key={p} value={p}>{p}%</MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Tip Amount Display */}
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography>Tip Amount</Typography>
        <Typography fontWeight="bold">${tipAmount.toFixed(2)}</Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Card Element for Monthly Donations */}
      {donationData.donationType === "monthly" && (
        <Box sx={{ my: 3 }}>
          <Typography variant="body1" fontWeight="bold" mb={1}>
            Payment Details
          </Typography>
          <Box sx={{ border: "1px solid #ccc", borderRadius: "4px", p: 1.5 }}>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </Box>
        </Box>
      )}

      {/* Contact Permission */}
      <FormControlLabel
        control={
          <Checkbox
            checked={allowContact}
            onChange={(e) => setAllowContact(e.target.checked)}
            sx={{ "&.Mui-checked": { color: themeColor } }}
            disabled={isLoading}
          />
        }
        label="Allow Night Bright Inc to contact me"
        sx={{ mb: 3, mt: 1 }}
      />

      {/* Error Display */}
      {error && (
        <Typography color="error" sx={{ my: 2, textAlign: "center" }}>
          {error}
        </Typography>
      )}

      {/* Finish Button */}
      <Button
        fullWidth
        variant="contained"
        disabled={isLoading || !stripe}
        onClick={handleFinishClick}
        sx={{
          bgcolor: themeColor,
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "8px",
          py: 1.5,
          textTransform: "none",
          "&:hover": { bgcolor: "#a98244" },
          "&.Mui-disabled": {
            backgroundColor: "#cccccc",
            color: "#666666",
          },
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          `Finish Donation ($${total})`
        )}
      </Button>
    </Box>
  );
};

// Main component wrapped with Stripe's Elements provider
const FinalDetails = (props) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm {...props} />
  </Elements>
);

export default FinalDetails;
