import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { assignBaseToMissionary } from '../services/missionary.service';

const AssignBaseModal = ({ open, onClose, missionary, bases, onAssign }) => {
    const [selectedBase, setSelectedBase] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!selectedBase) {
            alert('Please select a base.');
            return;
        }
        setLoading(true);
        try {
            await assignBaseToMissionary(missionary._id, selectedBase);
            onAssign(); // This will trigger the reload on the parent page
        } catch (error) {
            console.error('Failed to assign base:', error);
            alert('Could not assign base. Please try again.');
        } finally {
            setLoading(false);
            onClose(); // Close the modal
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Assign Base to {missionary?.userId?.firstName}</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="base-select-label">Select Base</InputLabel>
                        <Select
                            labelId="base-select-label"
                            value={selectedBase}
                            label="Select Base"
                            onChange={(e) => setSelectedBase(e.target.value)}
                        >
                            {bases.map((base) => (
                                <MenuItem key={base._id} value={base._id}>
                                    {base.location}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? 'Assigning...' : 'Assign'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignBaseModal;