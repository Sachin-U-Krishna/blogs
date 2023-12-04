import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import useUsersContext from '../hooks/use-users-context';

const settings = ['My Blogs', 'Logout'];

function NavBar() {
    const { loggedIn, updateLoggedIn } = useUsersContext()
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logout = () => {
		localStorage.removeItem("auth")
		localStorage.removeItem("auth2")
		updateLoggedIn(0)
		navigate('/', { replace: true })
	}

    const navigate = useNavigate();

    return (
        <AppBar position="sticky" style={{ backgroundColor: '#FF6300' }}>
            <Container maxWidth="xl" >
                <Toolbar disableGutters className='d-flex justify-content-between'>
                    <div className='d-flex' style={{ cursor: 'pointer' }} onClick={() => navigate('/', { replace: true })}>

                        <img src="https://www.akasaair.com/favicon.ico" alt="icon" className='pe-1' style={{ mixBlendMode: 'color-burn' }} />
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            BLOGS
                        </Typography>


                        <Typography
                            variant="h5"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            BLOGS
                        </Typography>
                    </div>

                    {loggedIn === 1 ?
                        (<Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Icon icon="mdi:user" color="#e3e3e3" width="30" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={(e) => {
                                        if(e.target.innerText === "Logout")
                                            logout()
                                        else
                                            navigate('/myblogs')
                                    }}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>)
                        :
                        (<button type='button' className='btn btn-light' onClick={()=>navigate('/login')}><Icon icon="oi:account-login" /></button>)
                    }
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default NavBar;