import { fetchGithubUser, searchGithubUser } from "../api/github";
import type { GithubUser } from "../types";
import React, { useState, useEffect, use } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import UserCard from "./UserCard";
import RecentSearches from "./RecentSearches";
import Dropdown from "./Dropdown";


const UserSearch = () => {
    const [username, setUsername] = useState('');
    const [submittedUsername, setSubmittedUsername] = useState('');
    const [recentUsers, setRecentUsers] = useState<string[]>(() => {
        const stored = localStorage.getItem('recentUsers');
        return stored ? JSON.parse(stored) : []
    });

    const [debouncedUsername] = useDebounce(username, 300);
    const [showSuggestions, setShowSuggestions] = useState(false);

    //fetch one user
    const { data, error, isLoading, isError, refetch } = useQuery({
        queryKey: ['users', submittedUsername],
        queryFn: () => fetchGithubUser(submittedUsername),
        enabled: !!submittedUsername //enabled stops search from running on page load and searching for an empty string, !! turns submittedUsername into a boolean (if submittedUsername !== '' -> false, don't run).
    })

    const { data:suggestions } = useQuery({
        queryKey: ['github-user-suggestions', debouncedUsername],
        queryFn: () => searchGithubUser(debouncedUsername),
        enabled: debouncedUsername.length > 1
    })

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedUser = username.trim();
        if (!trimmedUser) return;
        setSubmittedUsername(trimmedUser);
        setUsername('');
        setRecentUsers((prev) => {
            const updated = [trimmedUser, ...prev.filter((u) => u !== trimmedUser)];
            return updated.slice(0, 5);
        })
    };

    useEffect(() => {
        localStorage.setItem('recentUsers', JSON.stringify(recentUsers))
    }, [recentUsers]) //ran if recentUsers changes

    return (
        <>
            <form onSubmit={handleSubmit} className="form">
                <div className="dropdown-wrapper">
                    <input value={username} type="text" placeholder="Find GitHub Users..." onChange={(e) => {const val = e.target.value; setUsername(val); setShowSuggestions(val.trim().length > 1)}} />
                    {showSuggestions && suggestions?.length > 0 && (
                        <Dropdown suggestions={suggestions} show={showSuggestions} onSelect={(selected) => {setUsername(selected); setShowSuggestions(false);
                                                                                                            if (submittedUsername !== selected) {
                                                                                                                setSubmittedUsername(selected);
                                                                                                            } else {
                                                                                                                refetch();
                                                                                                            }
                            setRecentUsers((prev) => {
                            const updated = [selected, ...prev.filter((u) => u !== selected)];
                            return updated.slice(0, 5);
                            })
                        }} />
                    )}
                </div>
                <button type="submit">Search</button>
            </form>


            {isLoading && <p className="status">Loading Page...</p>}
            {isError && <p className="error status">{error.message}</p>}
            { data && <UserCard user={data} /> }

            {recentUsers.length > 0 && (
                <RecentSearches users={recentUsers} onSelect={(username) => {setUsername(username); setSubmittedUsername(username)}} />
            )}
        </>
    );
}
 
export default UserSearch;