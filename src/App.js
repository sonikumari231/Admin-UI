
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setFilteredUsers(data);
      });
  }, []);

  useEffect(() => {
    setFilteredUsers(users.filter(user =>
      Object.values(user).some(value =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ));
    setCurrentPage(1);
  }, [searchTerm, users]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === currentPageUsers.length
        ? []
        : currentPageUsers.map(user => user.id)
    );
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    setUsers(prev => prev.filter(user => !selectedRows.includes(user.id)));
    setFilteredUsers(prev => prev.filter(user => !selectedRows.includes(user.id)));
    setSelectedRows([]);
  };

  const handleEdit = (user) => {
    setEditingRow(user.id);
    setEditedData(user);
  };

  const handleSave = (id) => {
    setUsers(prev => prev.map(user => user.id === id ? editedData : user));
    setFilteredUsers(prev => prev.map(user => user.id === id ? editedData : user));
    setEditingRow(null);
    setEditedData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleDelete = (id) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    setFilteredUsers(prev => prev.filter(user => user.id !== id));
  };

  const formatRole = (role) => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

  const rowsPerPageOptions = Array.from({ length: Math.ceil(filteredUsers.length / rowsPerPage) }, (_, i) => i + 1);
  const currentPageUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="app">
      <div className="search-bar">
        <input
          type="text"
          className="search-box"
          placeholder="Search by name, email or role"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th><input type="checkbox" onChange={handleSelectAll} /></th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPageUsers.map(user => (
            <tr key={user.id} className={selectedRows.includes(user.id) ? 'selected' : ''}>
              <td><input type="checkbox" checked={selectedRows.includes(user.id)} onChange={() => handleSelectRow(user.id)} /></td>
              <td>
                {editingRow === user.id ?
                  <input type="text" name="name" value={editedData.name} onChange={handleInputChange} /> :
                  user.name
                }
              </td>
              <td>
                {editingRow === user.id ?
                  <input type="text" name="email" value={editedData.email} onChange={handleInputChange} /> :
                  user.email
                }
              </td>
              <td>
                {editingRow === user.id ?
                  <input type="text" name="role" value={editedData.role} onChange={handleInputChange} /> :
                  formatRole(user.role)
                }
              </td>
              <td>
                {editingRow === user.id ?
                  <>
                    <button className="save" onClick={() => handleSave(user.id)}>Save</button>
                    <button className="cancel" onClick={() => setEditingRow(null)}>Cancel</button>
                  </> :
                  <>
                    <button className="edit" onClick={() => handleEdit(user)}>✎</button>
                    <button className="delete" onClick={() => handleDelete(user.id)}>🗑</button>
                  </>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bottom-controls">
        <button className="delete-selected" onClick={handleDeleteSelected}>Delete Selected</button>
        <div className="pagination">
          <button
            className="pagination-arrow"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
          <button
            className="pagination-arrow"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {rowsPerPageOptions.map(page => (
            <button
              key={page}
              className={`page-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="pagination-arrow"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === rowsPerPageOptions.length}
          >
            &gt;
          </button>
          <button
            className="pagination-arrow"
            onClick={() => handlePageChange(rowsPerPageOptions.length)}
            disabled={currentPage === rowsPerPageOptions.length}
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
