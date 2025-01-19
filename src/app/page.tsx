"use client";

import React, { useEffect, useState } from "react";
import Member from "../app/components/Member";
import AddMemberForm from "../app/components/AddMemberForm";
import "./globals.css";

// Task type for tasks assigned to a member
type Task = {
  id: number;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
};

// TeamMember type with tasks as an array of Task objects
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

  useEffect(() => {
    const storedMembers = localStorage.getItem("teamMembers");
    if (storedMembers) {
      setMembers(JSON.parse(storedMembers));
    }
  }, []);

  const addMember = () => {
    if (!newMember.name || !newMember.role || !newMember.bio) {
      alert("Please fill all fields.");
      return;
    }

    const uniqueId = Math.max(0, ...members.map((m) => m.id)) + 1;
    const newMemberWithId = { ...newMember, id: uniqueId, tasks: [] };

    const updatedMembers = [...members, newMemberWithId];
    setMembers(updatedMembers);
    localStorage.setItem("teamMembers", JSON.stringify(updatedMembers));
    setNewMember({ name: "", role: "", bio: "" });
    setShowAddMemberForm(false);
    alert("Member added successfully");
  };

  const deleteMember = (id: number) => {
    const updatedMembers = members.filter((member) => member.id !== id);
    setMembers(updatedMembers);
    localStorage.setItem("teamMembers", JSON.stringify(updatedMembers));
    alert("Member deleted successfully");
  };

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

  const closeModal = () => {
    setShowTaskModal(false);
    setSelectedMemberTasks("");
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name?.toLowerCase().includes(search.toLowerCase()) ||
      member.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-1/2"
        />
        <button
          onClick={() => setShowAddMemberForm(!showAddMemberForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded w-full md:w-auto"
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

      {filteredMembers.length === 0 ? (
        <div className="text-center text-gray-700 mt-6">Member not found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <Member
              key={member.id}
              member={member}
              deleteMember={deleteMember}
              viewTask={viewTask}
            />
          ))}
        </div>
      )}

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
