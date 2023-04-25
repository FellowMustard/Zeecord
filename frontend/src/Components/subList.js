import ProfileUser from "./profileUser";

function SubList() {
  return (
    <div className="sublist-container">
      <div className="sublist-head">
        <button className="find-conversation">
          Find or start a conversation
        </button>
      </div>
      <div className="sublist-content"></div>
      <div className="sublist-footer">
        <ProfileUser />
      </div>
    </div>
  );
}

export default SubList;
