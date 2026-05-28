export default function StoryBar({ stories }) {
  return (
    <div className="story-bar">
      {stories.length === 0 ? (
        <div className="story-bar-empty">
          <p>No stories available</p>
        </div>
      ) : (
        stories.map((group) => (
          <div key={group.user?._id} className="story-preview">
            <div className="story-ring">
              <img
                src={group.user?.photo || `https://ui-avatars.com/api/?name=${group.user?.name}&background=ffd84d`}
              />
            </div>
            <span className="story-name">
              {group.user?.name?.split(" ")[0]}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
