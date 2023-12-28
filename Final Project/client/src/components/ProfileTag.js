import { Link } from 'react-router-dom'

import '../stylesheets/general.css';
import '../stylesheets/components/ProfileItem.css'

function ProfileTag(props) {
    const { tag, uid } = props;
    return (
        <div className="profile-item-wrapper">
            <div className='profile-item-number'>Used By {tag.used_by.length} user(s)</div>
            <div className="profile-item-text">{tag.name}</div>
            {tag.used_by.length === 1 && <div className='profile-item-buttons-wrapper'>
                <Link to={`/edittag/${tag.name}/${tag._id}/${uid}`} className='profile-item-button'>Edit/Delete</Link>
            </div>}
        </div>
    )
}

export default ProfileTag;