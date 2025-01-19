import { NextResponse } from "next/server";

// Simulated members data (replace with a database in production)
const members = [
  { id: 1, name: "Abhinav", role: "Developer", bio: "Loves coding.", tasks: [] },
  { id: 2, name: "Paridhi", role: "Designer", bio: "Creates amazing UI.", tasks: [] },
  { id: 3, name: "Pravesh", role: "Manager", bio: "Keeps the team on track.", tasks: [] },
];

// GET handler: Retrieve all members
export async function GET() {
  return NextResponse.json(members);
}

// POST handler: Add a new member
export async function POST(request: Request) {
  try {
    const newMember = await request.json();

    // Validate request body
    if (!newMember.name || !newMember.role || !newMember.bio) {
      return NextResponse.json(
        { error: "Missing required fields: name, role, bio" },
        { status: 400 }
      );
    }

    newMember.id = members.length + 1; // Assign unique ID
    newMember.tasks = []; // Initialize tasks as an empty array
    members.push(newMember);

    return NextResponse.json(newMember);
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "Failed to add member" },
      { status: 500 }
    );
  }
}

// DELETE handler: Remove a member by ID
export async function DELETE(request: Request) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get("id") || "", 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid or missing ID" },
        { status: 400 }
      );
    }

    const memberIndex = members.findIndex((member) => member.id === id);
    if (memberIndex === -1) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

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
