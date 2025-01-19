"use client";

import React, { useEffect, useState } from "react";
import Member from "../app/components/Member";
import AddMemberForm from "../app/components/AddMemberForm";
import "./globals.css";

type Task = {
  id: number;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
};

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

  // Fetch members from API on component mount
  useEffect(() => {
    const fetchMembers = async () => {
      const res = await fetch("/api/members");
      const data = await res.json();
      setMembers(data);
    };

    fetchMembers();
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
        body: JSON.stringify({ ...newMember, tasks: [] }),
      });

      if (!res.ok) throw new Error("Failed to add member");

      const data = await res.json();
      setMembers((prevMembers) => [...prevMembers, data]);
      setNewMember({ name: "", role: "", bio: "" });
      setShowAddMemberForm(false);
      alert("Member added successfully");
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Error adding member. Please try again.");
    }
  };

  // Delete a member
  const deleteMember = async (id: number) => {
    try {
      const res = await fetch(`/api/members?id=${id}`, { method: "DELETE" });

      if (!res.ok) {
        const errorText = await res.text(); // Log the error response
        throw new Error(`Failed to delete member: ${errorText}`);
      }

      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.id !== id)
      );
      alert("Member deleted successfully");
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Error deleting member. Please check your network connection.");
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
      setShowTaskModal(true);
    } else {
      alert("Member not found");
    }
  };

  // Close the task modal
  const closeModal = () => {
    setShowTaskModal(false);
    setSelectedMemberTasks("");
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
            deleteMember={deleteMember}
            viewTask={viewTask}
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
