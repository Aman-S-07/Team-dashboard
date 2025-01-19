// import { NextApiRequest, NextApiResponse } from "next";

// // Simulated members data
// const members = [
//   { id: 1, name: "Abhinav", role: "Developer", bio: "Loves coding.", tasks: [] },
//   { id: 2, name: "Paridhi", role: "Designer", bio: "Creates amazing UI.", tasks: [] },
//   { id: 3, name: "Pravesh", role: "Manager", bio: "Keeps the team on track.", tasks: [] },
// ];

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "GET") {
//     return res.status(200).json(members);
//   } else if (req.method === "POST") {
//     try {
//       const newMember = req.body;
//       if (!newMember.name || !newMember.role || !newMember.bio) {
//         return res.status(400).json({ error: "Missing required fields" });
//       }
//       const newId = members.length ? members[members.length - 1].id + 1 : 1;
//       const member = { ...newMember, id: newId, tasks: [] };
//       members.push(member);
//       return res.status(201).json(member);
//     } catch (error) {
//       console.error("Error in POST:", error);
//       return res.status(500).json({ error: "Failed to add member" });
//     }
//   } else {
//     return res.setHeader("Allow", ["GET", "POST"]).status(405).end("Method Not Allowed");
//   }
// }
