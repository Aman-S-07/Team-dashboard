"use client";

import React, { useEffect, useState } from "react";
import Member from "../app/components/Member";
import AddMemberForm from "../app/components/AddMemberForm";
import "./globals.css";

// Updated Task type to include title, description, and status
type Task = {
  id: number;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
};

// Updated TeamMember type to reflect tasks as an array of Task objects
type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  tasks: Task[];
};

const HomePage = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [search, setSearch] = useState("");
  const [newMember, setNewMember] = useState({ name: "", role: "", bio: "" });
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedMemberTasks, setSelectedMemberTasks] = useState<string>("");

  // Re-fetch members from localStorage when page loads or when data changes
  useEffect(() => {
    const storedMembers = localStorage.getItem("teamMembers");
    if (storedMembers) {
      const parsedMembers = JSON.parse(storedMembers);
      setMembers(parsedMembers);
    }
  }, []);

  // Add a new member
  const addMember = async () => {
    if (!newMember.name || !newMember.role || !newMember.bio) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMember),
      });

      if (!res.ok) throw new Error("Failed to add member");

      const data = await res.json();
      setMembers((prevMembers) => [...prevMembers, data]);
      // Update localStorage
      localStorage.setItem("teamMembers", JSON.stringify([...members, data]));
      setNewMember({ name: "", role: "", bio: "" });
      setShowAddMemberForm(false);
      alert("Member added successfully");
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Error adding member. Please try again.");
    }
  };

  // View tasks for a member
  const viewTask = (id: number) => {
    const member = members.find((m) => m.id === id);
    if (member) {
      if (member.tasks && member.tasks.length > 0) {
        const tasksList = member.tasks
          .map(
            (task) => `
            <div class="task-item border-b py-2">
              <div class="task-title font-bold text-lg">${task.title}</div>
              <div class="task-description text-gray-700">${task.description}</div>
              <div class="task-status text-sm text-gray-500">Status: <span class="text-${
                task.status === "To Do"
                  ? "red"
                  : task.status === "In Progress"
                  ? "yellow"
                  : "green"
              }-500">${task.status}</span></div>
            </div>
          `
          )
          .join("");
        setSelectedMemberTasks(tasksList);
      } else {
        setSelectedMemberTasks("<div>No tasks assigned.</div>");
      }
      setShowTaskModal(true); // Show the modal
    } else {
      alert("Member not found");
    }
  };

  // Close the task modal
  const closeModal = () => {
    setShowTaskModal(false);
    setSelectedMemberTasks(""); // Clear tasks when closing modal
  };

  // Filter members based on search input
  const filteredMembers = members.filter(
    (member) =>
      member.name?.toLowerCase().includes(search.toLowerCase()) ||
      member.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by name or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <button
          onClick={() => setShowAddMemberForm(!showAddMemberForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add New Member
        </button>
      </div>

      {showAddMemberForm && (
        <AddMemberForm
          newMember={newMember}
          setNewMember={setNewMember}
          addMember={addMember}
          setShowAddMemberForm={setShowAddMemberForm}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <Member
            key={member.id}
            member={member}
            viewTask={viewTask} // Removed deleteMember
          />
        ))}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 max-w-full">
            <h2 className="text-xl font-bold mb-4">Tasks</h2>
            <div
              className="task-list mb-4"
              dangerouslySetInnerHTML={{ __html: selectedMemberTasks }}
            />
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
