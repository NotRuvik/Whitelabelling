import React, { useState } from 'react';
import { Container, Box, Tabs, Tab } from '@mui/material';

// Import the separated components
import TabPanel from './TabPanel';
import MainPageContent from './MainPageContent';
import PostsContent from './PostsContent';

const MyPage = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Box sx={{ mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="my page tabs"
                    sx={{
                        "& .MuiTabs-indicator": {
                            display: "none", 
                        },
                        "& .MuiTabs-flexContainer": {
                            gap: 2, 
                        },
                    }}
                >
                    {['Main Page', 'Posts'].map((label) => (
                        <Tab
                            key={label}
                            label={label}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 'medium',
                                color: 'text.secondary',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                "&.Mui-selected": {
                                    backgroundColor: '#c0a068',
                                    color: '#fff',
                                    border: '1px solid #e0e0e0',
                                    
                                    fontWeight: 'bold',
                                },
                                 "&:not(.Mui-selected):hover": {
                                    backgroundColor: "#c0a068",
                                    color: "#fff"
                                }
                            }}
                        />
                    ))}
                </Tabs>
            </Box>

            <TabPanel value={activeTab} index={0}>
                <MainPageContent />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
                <PostsContent />
            </TabPanel>
        </Container>
    );
};

export default MyPage;