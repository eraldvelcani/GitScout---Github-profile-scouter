import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaGithub } from "react-icons/fa";

const UserSearch = () => {
    const [username, setUsername] = useState('');
    const [submittedUsername, setSubmittedUsername] = useState('');

    const { data, error, isLoading, isError } = useQuery({
        queryKey: ['users', submittedUsername],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_GITHUB_API_URL}/users/${submittedUsername}`);
            if (!res.ok) throw new Error('User not found...');

            const data = await res.json();
            return data;
        },
        enabled: !!submittedUsername //enabled stops search from running on page load and searching for an empty string, !! turns submittedUsername into a boolean (if submittedUsername !== '' -> false, don't run).
    })

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmittedUsername(username.trim());
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="form">
                <input value={username} type="text" placeholder="Find GitHub Users..." onChange={(e) => setUsername(e.target.value)} />
                <button type="submit">Search</button>
            </form>

            {isLoading && <p className="status">Loading Page...</p>}
            {isError && <p className="error status">{error.message}</p>}
            { data && (
                <div className="user-card">
                    <img src={data.avatar_url} alt={data.name} className="avatar" />
                    <h2>{data.name || data.login}</h2>
                    <p className="bio">{data.bio}</p>
                    <a href={data.html_url} className="profile-btn" target="_blank" rel="noopener noreferrer">View Profile <FaGithub /></a>
                </div>
            ) }
        </>
    );
}
 
export default UserSearch;