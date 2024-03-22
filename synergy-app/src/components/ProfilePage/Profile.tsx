// import React, { useState, useEffect } from "react";
// import "./App.css";
// import { db } from "../../config/firebase";
// import dayjs from "dayjs";

// function App() {
//     const [name, setName] = useState("");
//     const [nameErr, setNameErr] = useState(false);
//     const [email, setEmail] = useState("");
//     const [emailErr, setEmailErr] = useState(false);
//     const [password, setPassword] = useState("");
//     const [passwordConfirm, setPasswordConfirm] = useState("");
//     const [passwordMatchErr, setPasswordMatchErr] = useState(false);
//     const [passwordEmpty, setPasswordEmpty] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [dateOfBirth, setDateOfBirth] = useState(dayjs("").subtract(6, "year"));
//     const [dateOfBirthErr, setDateOfBirthErr] = useState(false);
//     const [checkedTandC, setCheckedTandC] = useState(false);
//     const [checkedTandCErr, setCheckedTandCErr] = useState(false);
//     const [usedEmail, setUsedEmail] = useState(false);

//   useEffect(() => {
//     db.collection("customersData").onSnapshot((snapshot: any) => {
//       setCustomersData(
//         snapshot.docs.map((doc: any) => ({
//           id: doc.id,
//           data: doc.data(),
//         }))
//       );
//     });
//     console.log({ customersData });
//   }, []);

//   const submit = (e: any) => {
//     e.preventDefault();
//     db.collection("customersData").add({
//       name: customerName,
//       password: customerPassword,
//     });

//     setCustomerName("");
//     setCustomerPassword("");
//   };

//   return (
//     <div className="App">
//       <div className="App__form">
//         <input
//           type="text"
//           placeholder="Name"
//           value={customerName}
//           onChange={(e) => setCustomerName(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Password"
//           value={customerPassword}
//           onChange={(e) => setCustomerPassword(e.target.value)}
//         />
//         <button onClick={submit}>Submit</button>
//       </div>
//       <div className="App__DataDisplay">
//         <table>
//           <tr>
//             <th>NAME</th>
//             <th>PASSWORD</th>
//           </tr>

//           {customersData?.map(({ id, data }) => (
//             <tr key={id}>
//               <td>{data.name}</td>
//               <td>{data.password}</td>
//             </tr>
//           ))}
//         </table>
//       </div>
//     </div>
//   );
// }

// export default App;
