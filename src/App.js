import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

function App() {
  const [showFriend, setShowFriend] = useState(false);

  const [ListFriends, setListFriends] = useState(initialFriends);
  const [Selected, setSelected] = useState(null);

  function HandleShowFriend() {
    setShowFriend((show) => !show);
  }

  function HandleAddFriend(Items) {
    setListFriends((Item) => [...Item, Items]);
    setShowFriend(false);
  }

  function HandleSelected(friend) {
    setSelected((curr) => (curr?.id === friend.id ? null : friend));
    setShowFriend(false);
  }
  function handlesplitbill(value) {
    setListFriends((friends) =>
      friends.map((friend) =>
        friend.id === Selected.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelected(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          ListFriends={ListFriends}
          handleselected={HandleSelected}
          Selected={Selected}
        />
        {showFriend && <FormAddFriend AddFriend={HandleAddFriend} />}
        <Button onClick={HandleShowFriend}>
          {showFriend === true ? "Close" : "Add Friend"}
        </Button>
      </div>
      {Selected && (
        <FormSplitBill Selected={Selected} onSplitBill={handlesplitbill} />
      )}
    </div>
  );
}

function FriendsList({ ListFriends, handleselected, Selected }) {
  return (
    <ul>
      {ListFriends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          handleselected={handleselected}
          Selected={Selected}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, handleselected, Selected }) {
  const isSelected = Selected?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.image} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You Owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}
        </p>
      )}
      {friend.balance === 0 && (
        <p className="">You and {friend.name} are even</p>
      )}
      <Button onClick={() => handleselected(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ AddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handlesubmit(e) {
    const id = crypto.randomUUID();
    e.preventDefault();
    if (!name || !image) return;
    const Friend = { name, image: `${image}?=${id}`, balance: 0, id };
    AddFriend(Friend);
    console.log(Friend);
    setImage("https://i.pravatar.cc/48");
    setName("");
  }
  return (
    <form className="form-add-friend" onSubmit={handlesubmit}>
      <label>😁Friend name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
      ></input>
      <label>📷Image URL</label>
      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        type="text"
      ></input>
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({ Selected, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [PaidByUser, setPaidByUser] = useState("");
  const PaidByFriend = bill ? bill - PaidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handlesubmit(e) {
    e.preventDefault();

    if (!bill || !PaidByUser) return;
    onSplitBill(whoIsPaying === "user" ? PaidByFriend : -PaidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handlesubmit}>
      <h2>Split a bill with {Selected.name}</h2>
      <label>💸Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>
      <label>💲Your expense</label>
      <input
        value={PaidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? PaidByUser : Number(e.target.value)
          )
        }
        type="text"
      ></input>
      <label>👫 {Selected.name}s expense</label>
      <input type="text" disabled value={PaidByFriend}></input>
      <label>👫 Who is paying the bill</label>

      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{Selected.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
export default App;
