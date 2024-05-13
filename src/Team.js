// src/Team.js
import React, { useState } from 'react';
import { db, storage } from './firebase2';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Team = () => {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");  // New state for phone number

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleRoleChange = (e) => setRole(e.target.value);
  const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);  // Update phone number state

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select an image.');
      return;
    }
    const fileRef = ref(storage, `images/${file.name}`);
    await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);

    try {
      await addDoc(collection(db, "teams"), {
        username,
        role,
        phoneNumber,  // Save phone number
        imageUrl: fileUrl
      });
      alert('User added successfully!');
      setFile(null);
      setUsername("");
      setRole("");
      setPhoneNumber("");  // Reset phone number
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error uploading data: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={username} onChange={handleUsernameChange} placeholder="Username" required />
      <input type="text" value={role} onChange={handleRoleChange} placeholder="Role" required />
      <input type="tel" value={phoneNumber} onChange={handlePhoneNumberChange} placeholder="Phone Number" required />  {/* Phone number input */}
      <input type="file" onChange={handleFileChange} required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Team;
