import React from 'react';
import { Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';

const LogoutButton = () => {
    const { logout } = useAuth();
    return (
        <Button color="inherit" onClick={logout} startIcon={<LogoutOutlined />}>
            Logout
        </Button>
    );
};

export default LogoutButton;