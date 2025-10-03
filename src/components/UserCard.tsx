import { FaGithub } from "react-icons/fa";
import type { GithubUser } from "../types";

const UserCard = ({user}:{user: GithubUser}) => {
    return ( 
        <div className="user-card">
            <img src={user.avatar_url} alt={user.name} className="avatar" />
            <h2>{user.name || user.login}</h2>
            <p className="bio">{user.bio}</p>
            <a href={user.html_url} className="profile-btn" target="_blank" rel="noopener noreferrer">View Profile <FaGithub /></a>
        </div>
     );
}
 
export default UserCard;