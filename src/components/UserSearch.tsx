import { fetchGithubUser } from "../api/github";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UserCard from "./UserCard";


const UserSearch = () => {
    const [username, setUsername] = useState('');
    const [submittedUsername, setSubmittedUsername] = useState('');
    const [recentUsers, setRecentUsers] = useState<string[]>([]);

    const { data, error, isLoading, isError } = useQuery({
        queryKey: ['users', submittedUsername],
        queryFn: () => fetchGithubUser(submittedUsername),
        enabled: !!submittedUsername //enabled stops search from running on page load and searching for an empty string, !! turns submittedUsername into a boolean (if submittedUsername !== '' -> false, don't run).
    })

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedUser = username.trim();
        if (!trimmedUser) return;
        setSubmittedUsername(trimmedUser);
        setRecentUsers((prev) => {
            const updated = [trimmedUser, ...prev.filter((u) => u !== trimmedUser)];
            return updated.slice(0, 5);
        })
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="form">
                <input value={username} type="text" placeholder="Find GitHub Users..." onChange={(e) => setUsername(e.target.value)} />
                <button type="submit">Search</button>
            </form>

            {isLoading && <p className="status">Loading Page...</p>}
            {isError && <p className="error status">{error.message}</p>}
            { data && <UserCard user={data} /> }

            {recentUsers.length > 0 && (
                <div className="recent-searches">
                    <div className="recent-header">
                        <h3>Recently Searched</h3>
                    </div>
                    <ul>
                        {recentUsers.map((user) => (
                            <li key={user}>
                                <button onClick={() => {
                                    setUsername(user);
                                    setSubmittedUsername(user);
                                }}>{user}</button>
                            </li>
                        ))}
                    </ul>
                </div> 
            )}
        </>
    );
}
 
export default UserSearch;