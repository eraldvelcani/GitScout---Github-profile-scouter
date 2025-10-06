import type { GithubUser } from "../types";

type DropdownProps = {
    suggestions: GithubUser[];
    show: boolean;
    onSelect: (username: string) => void;
};

const Dropdown = ({ suggestions, show, onSelect }:DropdownProps) => {
    if (!show || suggestions.length === 0) return null;

    return ( 
        <ul className="suggestions">
            {suggestions.slice(0, 5).map((user:GithubUser) => (
                <li onClick={() => onSelect(user.login)} key={user.login}>
                    <img src={user.avatar_url} alt={user.login} className="avatar-xs" />
                    {user.login}
                </li>
            ))}
        </ul>
     );
}
 
export default Dropdown;