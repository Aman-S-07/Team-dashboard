"use client";
import { useState } from "react";
import AddMemberForm from "../../app/components/AddMemberForm"; // Adjust path as needed
import { useRouter } from "next/navigation";

const AddMemberPage = () => {
  const [newMember, setNewMember] = useState({ name: "", role: "", bio: "" });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Used for redirecting

  const addMember = async () => {
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMember),
      });

      if (!res.ok) {
        throw new Error("Failed to add member");
      }

      const data = await res.json();
      console.log("New Member Added:", data);
      
      // After adding the member, redirect to the Home page
      router.push("/"); // Navigate back to the Home page to show the updated list
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Member</h1>
      <AddMemberForm
        newMember={newMember}
        setNewMember={setNewMember}
        addMember={addMember}
        setShowAddMemberForm={() => {}}
      />
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default AddMemberPage;
