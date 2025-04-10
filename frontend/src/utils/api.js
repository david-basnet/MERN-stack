// utils/api.js
export const apiUrl = "http://localhost:5000/api/auth";  // Adjust the base URL if necessary

export const loginUser = async (email, password) => {
  const response = await fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();  // Return the user data and token
};

export const signupUser = async (name, email, password, role) => {
  const response = await fetch(`${apiUrl}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();  // Return the user data and token
};
