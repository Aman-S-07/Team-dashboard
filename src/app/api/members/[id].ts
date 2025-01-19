import { NextApiRequest, NextApiResponse } from "next";

const members = [
  { id: 1, name: "Abhinav", role: "Developer", bio: "Loves coding.", tasks: [] },
  { id: 2, name: "Paridhi", role: "Designer", bio: "Creates amazing UI.", tasks: [] },
  { id: 3, name: "Pravesh", role: "Manager", bio: "Keeps the team on track.", tasks: [] },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    const memberId = parseInt(id as string, 10);
    const memberIndex = members.findIndex((member) => member.id === memberId);
    if (memberIndex === -1) {
      return res.status(404).json({ error: "Member not found" });
    }
    members.splice(memberIndex, 1);
    return res.status(200).json({ message: "Member deleted successfully" });
  } else {
    return res.setHeader("Allow", ["DELETE"]).status(405).end("Method Not Allowed");
  }
}
