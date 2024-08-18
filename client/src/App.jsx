import './App.css'
import axios from "axios";
import { useEffect,useState } from 'react';
import './components/login';
import './components/signin';

function App() {
const [users,setUsers]=useState([]);
const [filterusers, setFilterusers] = useState([]);
const [isModalOpen,setIsModelOpen] = useState(false);
const [userData,setUserData]=useState({name:"",age:"",city:""});





const getAllUsers=async()=>{
try {
  const value = await axios.get("http://localhost:5000/users")
  
  setUsers(value.data.data);
  setFilterusers(value.data.data);
} catch (error) {
  console.error(error);
  
}
};



useEffect(()=>{
  
  getAllUsers(); 
},[]);
//search function

const handleSearchChange =(e)=>{
  const searchText=e.target.value.toLowerCase();
  const filteredUsers=users.filter((user)=>user.name.toLowerCase().includes(searchText) || user.city.toLowerCase().includes(searchText));
  setFilterusers(filteredUsers)
};

// add and submit function

 const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (userData._id) {
        await axios.patch(`http://localhost:5000/users/${userData._id}`, userData);
      } else {
        await axios.post('http://localhost:5000/users', userData);
      }
      closeModal();
      setUserData({ name: "", age: "", city: "" });
      getAllUsers();
    } catch (error) {
      console.error(error);
    }
  };



//delete function

const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/delete/${id}`);
    getAllUsers();
  } catch (error) {
    console.error('Error:', error);
  }
};




//add User details
const handleAddRecord =()=>{
  setUserData({name:"",age:"",city:""});
  setIsModelOpen(true);
  // getAllUsers();

}


//close model
const closeModal=()=>{
  setIsModelOpen(false)
   
}
const handleData=(e)=>{
  setUserData({...userData,[e.target.name]:e.target.value});
};

//update user function

const handleUpdateRecord=(user)=>{
  setUserData(user);
  setIsModelOpen(true);


}



  return (
    <>
      <div className="container">
        <h3>Student _____ Records</h3>
        <div className="input-search">
          <input type="search" placeholder='SEARCH ' onChange={handleSearchChange}/>
          <button onClick={handleAddRecord} className='btn green'>Add Record</button>

      
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>AGE</th>
              <th>CITY</th>
              <th>EDIT</th>
              <th>DELETE</th>
            </tr>
          </thead>
          <tbody>
           {filterusers&&filterusers.map((user,index)=>{
             return(<tr key={user._id}>
             <td>{index+1}</td>
             <td>{user.name}</td>
             <td>{user.age}</td>
             <td>{user.city}</td>
             <td><button className='btn green' onClick={()=>handleUpdateRecord(user)}
             >EDIT</button></td>
             <td><button className='btn red'onClick={() => handleDelete(user._id)}>DELETE</button></td>
           </tr>);
           })}

          </tbody>
        </table>
        {isModalOpen && (
          <div className="modal">
            <div className="model-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <h2>{userData._id?"Update Record":"Add Record"}</h2>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" value={userData.name} name="name" id='name' placeholder='Enter name' onChange={handleData}/>
               </div>
               <div className="input-group">
                <label htmlFor="name">Age</label>
               <input type="number" value={userData.age} name="age" id='age' placeholder='Enter age'onChange={handleData} />
               </div> 
                <div className="input-group">
                <label htmlFor="city">city</label>
                <input type="text" value={userData.city} name="city" id='city' placeholder='Enter city' onChange={handleData}/>
                </div>
                <button className="btn green" onClick={handleSubmit}>{userData._id?"Update User":"Add User"}</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
