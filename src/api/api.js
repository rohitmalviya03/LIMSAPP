import axios from "axios";

// Utility to get labcode from sessionStorage
export const getLabcode = () => sessionStorage.getItem("labcode") || "";

const currentUrl = window.location.href;
console.log("Current URL:", currentUrl);

const urlObject = new URL(currentUrl);
const dynamicBaseURL = urlObject.port
  ? `${urlObject.protocol}//${urlObject.hostname}:${urlObject.port}`
  : `${urlObject.protocol}//${urlObject.hostname}`;

 export const baseURL = "https://lims-backend-2bc1.onrender.com";

// export const baseURL = dynamicBaseURL+"/AiimsBloodBank";


console.log("Dynamic Base URL:", dynamicBaseURL);



const api = axios.create({
  baseURL: baseURL+"/api", // adjust as needed
  withCredentials: true,
});

export default api;




// const getSSOTicketVar = () => {
//   console.log("Extracting SSO Ticket:");
//   const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
//   const varSSOTicketGrantingTicket = urlParams.get(
//     "varSSOTicketGrantingTicket"
//   );

//   if (varSSOTicketGrantingTicket) {
//     const currentTicket = sessionStorage.getItem("grantingTcn");

//     if (currentTicket !== varSSOTicketGrantingTicket) {
//       console.log(
//         "Updating session storage with new SSO Ticket:",
//         varSSOTicketGrantingTicket
//       );
//       sessionStorage.setItem("grantingTcn", varSSOTicketGrantingTicket);
//     }
//   } else {
//     console.log("No SSO ticket found in the URL.");
//   }
// };

// getSSOTicketVar();

// const getUserAgent = () => {
//   return navigator.userAgent;
// };
