// pages/api/members.js
let members = []; // In-memory storage (for simplicity)

export default function handler(req, res) {
  if (req.method === "POST") {
    const newMember = req.body;
    newMember.id = members.length + 1; // Assign an id to the new member
    members.push(newMember); // Add to members array
    res.status(200).json(newMember); // Return the added member
  } else if (req.method === "GET") {
    res.status(200).json(members); // Return the list of members
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
