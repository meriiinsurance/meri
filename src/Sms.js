import React, { useEffect, useState } from 'react';
import { db } from './firebase2';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Sms = () => {
    const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const today = new Date();
        const expiryThresholdDate = new Date();
        expiryThresholdDate.setDate(today.getDate() + 20);  // Assuming the expiry threshold is 20 days from today

        const oneMonthBeforeExpiry = new Date(expiryThresholdDate);
        oneMonthBeforeExpiry.setDate(expiryThresholdDate.getDate() - 30);  // 30 days before the expiry starts

        const usersRef = collection(db, "users");
        const expirationQuery = query(
          usersRef,
          where("endDate", ">=", oneMonthBeforeExpiry),
          where("endDate", "<=", expiryThresholdDate)
        );
        const expirationData = await getDocs(expirationQuery);
        console.log(expiryThresholdDate)
        console.log(oneMonthBeforeExpiry)

        expirationData.forEach((doc) => {
            const endDate = new Date(doc.data().endingDate);
            list.push({ id: doc.id, ...doc.data(), endingDate: endDate });
        });
        setData(list);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);
    console.log(data)

  // sms
    
    function sendSMS(name, phone, days) {

      const url = 'https://api.afromessage.com/api/send';
      const token = 'eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoiN3h2a0ROZDdkYllDVGd3VmxrQlNjNnR3ZzdhajN5WkMiLCJleHAiOjE4NzI5NDQ5MjcsImlhdCI6MTcxNTE3ODUyNywianRpIjoiN2NmMzdiNGItNTdiNS00NWJkLWIxN2MtNTZjMzRhMmI3YjZjIn0.eE1BcCyWzth4mm-9a6yU2U8xBVYvdzcaKuDGSrGS470'; 
      const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      };

      const body = {
          'callback': '', // Replace with your callback URL
          'from': 'e80ad9d8-adf3-463f-80f4-7c4b39f7f164', // From phone number
          'sender': '', // Sender name
          'to': `${phone}`, // Recipient phone number
          'message': `dear ${name} your insurance with insurance number ${12345} expires in ${days} days please upgrade` // Message
      };

      fetch(url, {
          method: 'POST', // HTTP method
          headers: headers,
          body: JSON.stringify(body) // Convert the JavaScript object to a JSON string
      })
      .then(response => {
          console.log(response)
          if (response.ok) {
              return response.json();
          } else {
              throw new Error('HTTP error, status = ' + response.status);
          }
      })
      .then(data => {
          if (data.acknowledge === 'success') {
            console.log('success')
              // document.getElementById('response').textContent = 'API success';
          } else {
            console.log('failed')
              // document.getElementById('response').textContent = 'API error';
          }
      })
      .catch(error => {
        console.error(error)
          // document.getElementById('response').textContent = 'HTTP error ... code: ' + error.message;
      });
  }
    useEffect(() => {
      data.map(item => {
        let today = new Date();
        let givenDay = new Date(item.endingDate);
        let timeDifference = givenDay - today;
        let daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        if (daysDifference == 1) {
          sendSMS(item.name, item.phoneNumber, daysDifference)
        }
      })

    }, [data])

  // sms
  console.log(data)

    return (
        <div>
            <h1>Users with End Date in the Next 20 Days:</h1>
            <ul>
                {data.map(user => (
                    <li key={user.id}>
                        <p>Name: {user.name}</p>
                        <p>Last Name: {user.lastname}</p>
                        <p>Phone Number: {user.phoneNumber}</p>
                        <p>Start Date: {user.startingDate}</p>
                        <p>End Date: {String(user.endingDate)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sms;
