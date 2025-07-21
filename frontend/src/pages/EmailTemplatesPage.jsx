import React from 'react';
import { Typography, Paper } from '@mui/material';

const EmailTemplatesPage = () => {
    return (
        <Paper sx={{p: 3}}>
            <Typography variant="h4">Manage Email Templates</Typography>
            <Typography>A list of editable email templates will be displayed here.</Typography>
        </Paper>
    );
}

export default EmailTemplatesPage;
// // src/pages/EmailTemplatesPage.js
// import React, { useState, useEffect } from 'react';
// import { Typography, Paper, Button, Stack, Box, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete';
// import GenericTable from "../genricCompoennts/GenericTable"; // Reusable table component
// import { getEmailTemplates, addEmailTemplate, deleteEmailTemplate } from "../services/emailTemplate.service"; // Service for fetching, adding, and deleting email templates

// const EmailTemplatesPage = () => {
//   const [emailTemplates, setEmailTemplates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [name, setName] = useState('');
//   const [subject, setSubject] = useState('');
//   const [body, setBody] = useState('');
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [templateToDelete, setTemplateToDelete] = useState(null);

//   const loadEmailTemplates = async () => {
//     setLoading(true);
//     try {
//       const response = await getEmailTemplates();
//       setEmailTemplates(response.data.data);
//     } catch (error) {
//       console.error("Failed to fetch email templates:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadEmailTemplates();
//   }, []);

//   const columns = [
//     { field: "name", headerName: "Template Name" },
//     { field: "subject", headerName: "Subject" },
//     { field: "body", headerName: "Body Preview", render: (value) => value.slice(0, 50) + "..." },
//   ];

//   const actions = [
//     {
//       label: "Delete",
//       icon: <DeleteIcon />,
//       onClick: (row) => {
//         setTemplateToDelete(row);
//         setIsDeleteDialogOpen(true);
//       },
//     },
//   ];

//   const handleAddTemplate = async () => {
//     try {
//       await addEmailTemplate({ name, subject, body });
//       loadEmailTemplates(); // Refresh the email templates list
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Failed to add email template:", error);
//     }
//   };

//   const handleDeleteTemplate = async () => {
//     try {
//       await deleteEmailTemplate(templateToDelete._id);
//       loadEmailTemplates(); // Refresh the email templates list
//       setIsDeleteDialogOpen(false);
//       setTemplateToDelete(null);
//     } catch (error) {
//       console.error("Failed to delete email template:", error);
//     }
//   };

//   return (
//     <Box>
//       <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
//         <Typography variant="h4" fontWeight={600}>
//           Manage Email Templates
//         </Typography>

//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => setIsModalOpen(true)}
//           sx={{
//             ":hover": {
//               backgroundColor: "primary.light",
//             },
//           }}
//         >
//           Add Template
//         </Button>
//       </Stack>

//       <GenericTable
//         columns={columns}
//         data={emailTemplates}
//         actions={actions}
//         isLoading={loading}
//       />

//       {/* Add Email Template Modal */}
//       <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <DialogTitle>Add Email Template</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Template Name"
//             variant="outlined"
//             fullWidth
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             label="Subject"
//             variant="outlined"
//             fullWidth
//             value={subject}
//             onChange={(e) => setSubject(e.target.value)}
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             label="Body"
//             variant="outlined"
//             fullWidth
//             multiline
//             rows={4}
//             value={body}
//             onChange={(e) => setBody(e.target.value)}
//             sx={{ mb: 2 }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setIsModalOpen(false)} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleAddTemplate} color="primary" variant="contained">
//             Add Template
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
//         <DialogTitle>Delete Email Template</DialogTitle>
//         <DialogContent>
//           Are you sure you want to delete the template "{templateToDelete?.name}"?
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setIsDeleteDialogOpen(false)} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleDeleteTemplate} color="error" variant="contained">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default EmailTemplatesPage;