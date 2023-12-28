import { Link } from 'react-router-dom'

import '../stylesheets/general.css';
import '../stylesheets/components/ProfileItem.css'

function ProfileUser(props) {
    const { user } = props;
    return (
        <div className="profile-item-wrapper">
            <div className='profile-item-number'>User reputation: {user.reputation}</div>
            <Link to={`/profile/${user._id}`} className="profile-item-text profile-item-text-link">{user.username}</Link>
            <div className='profile-item-buttons-wrapper'>
                <Link to={`/deleteUser/${user.reputation}/${user.username}/${user._id}`} className='profile-item-button'>Delete User</Link>
            </div>
        </div>
    )
}

export default ProfileUser;