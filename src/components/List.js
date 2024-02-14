import React, { useState, useEffect } from "react";
import "../styles.css";

function List() {
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLists, setSelectedLists] = useState([]);
  const [error, setError] = useState(null);
  const [checkTwo, setCheckTwo] = useState(null);
  const [creatingNewList, setCreatingNewList] = useState(false);
  const [newListItems, setNewListItems] = useState([]);
  const [size, setSize] = useState(2);

  useEffect(() => {
    const fetchListData = async () => {
      try {
        const response = await fetch(
          "https://apis.ccbp.in/list-creation/lists"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const lists = [];
        for (let i = 1; i <= size; i++) {
          const listData = data.lists.filter(
            (item) => item.list_number === i
          );
          lists.push({ id: i, data: listData });
        }
        setListData(lists);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchListData();
  }, [size]);

  const handleCheckboxChange = (listId, checked) => {
    if (checked) {
      setSelectedLists((prevSelectedLists) => [
        ...prevSelectedLists,
        listId,
      ]);
    } else {
      setSelectedLists((prevSelectedLists) =>
        prevSelectedLists.filter((id) => id !== listId)
      );
    }
  };

  const handleCreateNewList = () => {
    if (selectedLists.length !== 2) {
      setCheckTwo("You should select 2 lists to create a new list");
    } else {
      setCheckTwo(null);
      setCreatingNewList(true);
      setNewListItems([]);
      setSize(size + 1); 
      setListData((prevListData) => {
        
        let indexToInsert = selectedLists[0] - 1;
        if (selectedLists[1] < selectedLists[0]) {
          indexToInsert = selectedLists[1];
        }
        
        const newListData = [...prevListData];
        newListData.splice(indexToInsert, 0, { id: size + 1, data: [] });
        return newListData;
      });
    }
  };
  

 
  const handleCancelNewList = () => {
    setCreatingNewList(false);
  };

  const handleConfirmNewList = () => {
   
    setCreatingNewList(false);
    setSelectedLists([]);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="parent-container">
      {creatingNewList ? (
        <div className="new-list-container">
          <div className="container">
            {listData.map((list) => (
              <div key={list.id} className="list-container">
                <h3>List {list.id}</h3>
                {list.data.map((item) => (
                  <div key={item.id} className="list-item">
                    <div>{item.name}</div>
                    <div>{item.description}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button onClick={handleCancelNewList}>Cancel</button>
          <button onClick={handleConfirmNewList}>Confirm</button>
        </div>
      ) : (
        <div className="first-container">
          <h2>List Creation</h2>
          <button onClick={handleCreateNewList}>Create a new list</button>
          {checkTwo && <div>{checkTwo}</div>}
          <div className="container">
            {listData.map((list) => (
              <div key={list.id} className="list-container">
                <input
                  type="checkbox"
                  checked={selectedLists.includes(list.id)}
                  onChange={(e) =>
                    handleCheckboxChange(list.id, e.target.checked)
                  }
                />
                <h3>List {list.id}</h3>
                {list.data.map((item) => (
                  <div key={item.id} className="list-item">
                    <div>{item.name}</div>
                    <div>{item.description}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default List;
