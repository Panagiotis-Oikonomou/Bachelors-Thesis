import { Link} from "react-router-dom";

function Index() {
    return (
        <div>
            <Link to='/login'>Login</Link><br></br>
            <Link to='/register'>Register</Link>
        </div>
    )
}

export default Index;