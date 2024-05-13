// src/DisplayTeam.js
import React, { useEffect, useState } from 'react';
import { db } from './firebase2';
import { collection, getDocs } from 'firebase/firestore';

const DisplayTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "teams"));
      setTeamMembers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchUsers();
  }, []);

  return (
    <div>
      {teamMembers.map(member => (
        <div key={member.id}>
          <h2>{member.username}</h2>
          <p>{member.role}</p>
          <p>Phone: {member.phoneNumber}</p>
          <img src={member.imageUrl} alt={member.username} style={{ width: "100px" }} />
        </div>
      ))}
    </div>
  );
};

export default DisplayTeam;
