import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

import matchings from '../assets/images/mymatchings.png';
import myareas from '../assets/images/myareas.png';
import criteria from '../assets/images/criteria.png';
import match from '../assets/images/match.png';
import chats from '../assets/images/chats.png';
import notifications from '../assets/images/notifications.png';
import profile from '../assets/images/profile.png';

const NavBar = () => {
    return (
        <Navbar style={{height: "3.75rem"}}>
            <Container>
                <h2><Link to="/">Home</Link></h2>
            </Container>
            <Nav>
                <Stack direction="horizontal" gap={3}>
                    <Link to='/matchings'><img src={matchings} /></Link>
                    <Link to='/my_areas'><img src={myareas} /></Link>
                    <Link to='/criteria'><img src={criteria} /></Link>
                    <Link to='/match'><img src={match} /></Link>
                    <Link to='/my_chats'><img src={chats} /></Link>
                    <Link to='/notifications'><img src={notifications} /></Link>
                    <Link to='/profile'><img src={profile} /></Link>
                </Stack>
            </Nav>
        </Navbar>
    );
}

export default NavBar;