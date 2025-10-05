type RecentSearchesProps = {
	users: string[];
	onSelect: (username:string) => void;
};

const RecentSearches = ({ users, onSelect }:RecentSearchesProps) => {
	return ( 
		<div className="recent-searches">
			<div className="recent-header">
				<h3>Recently Searched</h3>
			</div>
			<ul>
				{users.map((user) => (
					<li key={user}>
						<button onClick={() => onSelect(user)}>{user}</button>
					</li>
				))}
			</ul>
		</div> 
	 );
}
 
export default RecentSearches;