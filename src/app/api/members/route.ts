import { NextResponse } from "next/server";

// Simulated members data (you might be using a database in a real app)
const members = [
  { id: 1, name: "Abhinav", role: "Developer", bio: "Loves coding." },
  { id: 2, name: "Paridhi", role: "Designer", bio: "Creates amazing UI." },
  { id: 3, name: "Pravesh", role: "Manager", bio: "Keeps the team on track." },
];

export async function GET() {
  return NextResponse.json(members);
}

export async function POST(request: Request) {
  try {
    const newMember = await request.json();
    newMember.id = members.length + 1; // Assign a unique ID
    members.push(newMember);
    return NextResponse.json(newMember); // Return the new member data
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "Failed to add member" },
      { status: 500 }
    );
  }
}

// DELETE handler
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split("/").pop() as string, 10); // Extract ID from URL

    // Find the member to delete
    const memberIndex = members.findIndex((member) => member.id === id);
    if (memberIndex === -1) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    // Remove the member from the list
    members.splice(memberIndex, 1);

    return NextResponse.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE request:", error);
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 }
    );
  }
}