import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

function Assignments() {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [modal, setModal] = useState({ show: false, type: '', data: null });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', course: '' });

  useEffect(() => {
    if (user?.token) fetchAssignments();
    else setLoading(false);
  }, [user]);

  const fetchAssignments = async () => {
    try {
      setError(null);
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view assignments');
        return;
      }

      const response = await fetch(`${API_URL}/assignments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
          return;
        }
        throw new Error('Failed to fetch assignments');
      }
      
      const data = await response.json();
      setAssignments(selectedCourse ? data.filter(a => a.course === selectedCourse) : data);
      setLoading(false);
    } catch (error) {
      setError(error.message || 'Failed to fetch assignments');
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
    fetchAssignments();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setFileError('File size should be less than 5MB');
        return;
      }
      if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(selectedFile.type)) {
        setFileError('Only PDF and DOCX files are allowed');
        return;
      }
      setFile(selectedFile);
    setFileError(false);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setFileError('Please select a file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assignmentId', modal.data._id);

      const response = await fetch(`${API_URL}/assignments/submit`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to submit assignment');

      setSuccessMessage(true);
    setTimeout(() => {
        setSuccessMessage(false);
        setModal({ show: false, type: '', data: null });
        setFile(null);
        fetchAssignments();
    }, 3000);
    } catch (error) {
      setError(error.message || 'Failed to submit assignment');
    }
  };

  const handleAssignmentAction = async (action, id) => {
    if (action === 'delete' && !window.confirm('Are you sure you want to delete this assignment?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to perform this action');
        return;
      }

      let url = `${API_URL}/assignments`;
      let method = 'POST';
      let body = newAssignment;

      if (action === 'delete') {
        url = `${API_URL}/assignments/${id}`;
        method = 'DELETE';
        body = undefined;
      } else if (action === 'update') {
        url = `${API_URL}/assignments/${id}`;
        method = 'PUT';
        body = newAssignment;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: body ? JSON.stringify(body) : undefined
      });

      if (!response.ok) throw new Error(`Failed to ${action} assignment`);

      if (action === 'delete') {
        setAssignments(assignments.filter(a => a._id !== id));
      } else {
        await fetchAssignments();
        if (action === 'create') {
          setSelectedCourse(newAssignment.course);
        }
      }

      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        setModal({ show: false, type: '', data: null });
        setNewAssignment({ title: '', description: '', course: '' });
      }, 3000);
    } catch (error) {
      setError(error.message || `Failed to ${action} assignment`);
    }
  };

  const handleInputChange = (e) => {
    setNewAssignment({ ...newAssignment, [e.target.name]: e.target.value });
  };

  const handleEditClick = (assignment) => {
    setNewAssignment({
      title: assignment.title,
      description: assignment.description,
      course: assignment.course
    });
    setModal({ show: true, type: 'edit', data: assignment });
  };

  const renderLoadingState = () => (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-blue-800 to-black py-12 text-white text-center">
        <h1 className="text-4xl mt-20 font-bold">Assignments</h1>
      </div>
      <div className="flex justify-center items-center p-6">
        <div className="text-center text-2xl font-semibold text-gray-700">Loading assignments...</div>
      </div>
    </div>
  );

  const renderAssignmentCard = (assignment) => (
    <div key={assignment._id} className="bg-gray-50 p-6 rounded-lg shadow-md relative" style={{ minHeight: '220px' }}>
      <h3 className="text-xl font-semibold text-blue-600">{assignment.title}</h3>
      <p className="mt-2 text-gray-700">{assignment.description}</p>
      <p className="mt-2 text-sm text-gray-500">Created by: {assignment.createdBy?.name || 'Unknown'}</p>

      {user.role === 'student' && (
        <button
          onClick={() => setModal({ show: true, type: 'submit', data: assignment })}
          className="absolute bottom-4 right-4 px-6 py-2 bg-gradient-to-r from-black to-blue-800 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Submit Assignment
        </button>
      )}

      {user.role === 'teacher' && (
        <div className="absolute bottom-4 right-4 space-x-2">
          <button
            onClick={() => handleEditClick(assignment)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleAssignmentAction('delete', assignment._id)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );

  const renderModal = () => {
    if (!modal.show) return null;

    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
          <button
            onClick={() => setModal({ show: false, type: '', data: null })}
            className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>

          {modal.type === 'submit' && (
            <>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">Attach file: {modal.data?.title}</h2>
              <div className="flex items-center justify-between border p-4 rounded-lg shadow-md">
                <input
                  type="text"
                  value={file ? file.name : 'No file selected'}
                  className="w-3/4 text-lg font-medium text-gray-700 bg-transparent border-none focus:outline-none"
                  disabled
                />
                <div
                  className="cursor-pointer text-blue-600"
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM12 22c-5.522 0-10-4.478-10-10S6.478 2 12 2s10 4.478 10 10-4.478 10-10 10zm-1-15h2v5h3l-4 4-4-4h3z" />
                  </svg>
                </div>
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                />
              </div>
              {file && (
                <button
                  onClick={() => setFile(null)}
                  className="text-red-600 mt-2 w-full text-center py-2 border rounded-md hover:bg-red-100"
                >
                  Cancel File
                </button>
              )}
              {fileError && <p className="text-red-600 text-center mt-2">{fileError}</p>}
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 mt-4 w-full"
              >
                Submit Assignment
              </button>
            </>
          )}

          {modal.type === 'edit' && (
            <>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">Edit Assignment</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newAssignment.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={newAssignment.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course</label>
                  <select
                    name="course"
                    value={newAssignment.course}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Course</option>
                    <option value="Advanced Programming">Advanced Programming</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Machine Learning">Machine Learning</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => handleAssignmentAction('update', modal.data._id)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 mt-4 w-full"
              >
                Update Assignment
              </button>
            </>
          )}

          {modal.type === 'create' && (
            <>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">Create New Assignment</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newAssignment.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={newAssignment.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course</label>
                  <select
                    name="course"
                    value={newAssignment.course}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Course</option>
                    <option value="Advanced Programming">Advanced Programming</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Machine Learning">Machine Learning</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => handleAssignmentAction('create')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 mt-4 w-full"
              >
                Create Assignment
              </button>
            </>
          )}

          {successMessage && (
            <p className="text-green-500 mt-4 text-center">Operation completed successfully!</p>
          )}
        </div>
      </div>
    );
  };

  if (loading) return renderLoadingState();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-blue-800 to-black py-12 text-white text-center">
        <h1 className="text-4xl mt-20 font-bold">Assignments</h1>
      </div>
      <div className="flex justify-center items-center p-6">
        <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-8 text-center">
            <label htmlFor="courseSelect" className="text-lg text-blue-800">Select a Course:</label>
            <select
              id="courseSelect"
              value={selectedCourse}
              onChange={handleCourseChange}
              className="ml-4 p-2 border rounded-md"
            >
              <option value="">--Select a Course--</option>
              <option value="Advanced Programming">Advanced Programming</option>
              <option value="Web Development">Web Development</option>
              <option value="Machine Learning">Machine Learning</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {user.role === 'teacher' && (
            <div className="mb-6 text-center">
              <button
                onClick={() => setModal({ show: true, type: 'create', data: null })}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
              >
                Create Assignment
              </button>
            </div>
          )}

          {!selectedCourse ? (
            <div className="flex justify-center items-center p-6">
              <img src="https://via.placeholder.com/150" alt="Placeholder" className="mx-auto" />
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-blue-800">Assignments for {selectedCourse}</h2>
              {assignments.length > 0 ? (
                assignments.map(renderAssignmentCard)
              ) : (
                <p className="text-lg text-gray-500">No assignments available for this course.</p>
              )}
            </div>
          )}

          {renderModal()}
        </div>
      </div>
    </div>
  );
}

export default Assignments;
