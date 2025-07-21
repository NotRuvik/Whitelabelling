import React, { useState } from 'react';
import { Container, Box, Tabs, Tab } from '@mui/material';

// Import the separated components
import TabPanel from './TabPanel';
import OverviewContent from './OverviewContent';
import FilterableContent from './FilterableContent';

const DonationPage = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const goldColor = '#C0A068';

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Box sx={{  mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="donation page tabs"
                    sx={{
                        "& .MuiTabs-indicator": {
                            display: "none",
                        },
                    }}
                >
                    {['Overview', 'Donations', 'Donors'].map((label) => (
                        <Tab
                            key={label}
                            label={label}
                            sx={{
                                textTransform: 'none',
                                minWidth: 120,
                                marginRight: 2,
                                fontWeight: 'medium',
                                color: goldColor,
                                borderRadius: '20px',
                                "&.Mui-selected": {
                                    backgroundColor: goldColor,
                                    color: 'white',
                                    fontWeight: 'bold',
                                },
                                "&:not(.Mui-selected):hover": {
                                    backgroundColor: goldColor,
                                    color: "#fff"
                                }
                            }}
                        />
                    ))}
                </Tabs>
            </Box>

            {/* Content panels now use the imported components */}
            <TabPanel value={activeTab} index={0}>
                <OverviewContent />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
                <FilterableContent mode="donations" title="PAYMENT FILTERS" />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
                <FilterableContent  mode="donors" title="DONOR FILTERS" />
            </TabPanel>
        </Container>
    );
};

export default DonationPage;