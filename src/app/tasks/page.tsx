"use client";

import React, { useEffect, useState } from "react";

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

const TaskManager = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [openMemberId, setOpenMemberId] = useState<number | null>(null); // Track the open member dropdown
  const [newTask, setNewTask] = useState<Task>({
    id: 0,
    title: "",
    description: "",
    status: "To Do",
  });
  const [isEditingTask, setIsEditingTask] = useState(false);

  useEffect(() => {
    const storedMembers = localStorage.getItem("teamMembers");
    if (storedMembers) {
      const parsedMembers = JSON.parse(storedMembers);
      setMembers(parsedMembers);
    }
  }, []);

  const updateLocalStorage = (updatedMembers: TeamMember[]) => {
    localStorage.setItem("teamMembers", JSON.stringify(updatedMembers));
  };

  const toggleMemberDropdown = (memberId: number) => {
    setOpenMemberId((prev) => (prev === memberId ? null : memberId));
  };

  const handleSaveTask = (memberId: number) => {
    if (!newTask.title || !newTask.description) {
      alert("Please fill out all fields for the task.");
      return;
    }

    const updatedTask = { ...newTask, id: isEditingTask ? newTask.id : Date.now() };
    const updatedMembers = members.map((member) =>
      member.id === memberId
        ? {
            ...member,
            tasks: isEditingTask
              ? member.tasks.map((task) =>
                  task.id === newTask.id ? updatedTask : task
                )
              : [...(member.tasks || []), updatedTask],
          }
        : member
    );

    setMembers(updatedMembers);
    updateLocalStorage(updatedMembers);

    setNewTask({ id: 0, title: "", description: "", status: "To Do" });
    setIsEditingTask(false);
  };

  const handleEditTask = (task: Task) => {
    setNewTask(task);
    setIsEditingTask(true);
  };

  const handleDeleteTask = (memberId: number, taskId: number) => {
    const updatedMembers = members.map((member) =>
      member.id === memberId
        ? {
            ...member,
            tasks: member.tasks.filter((task) => task.id !== taskId),
          }
        : member
    );

    setMembers(updatedMembers);
    updateLocalStorage(updatedMembers);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-6 text-center md:text-left">Team Members</h2>
      <ul className="space-y-4">
        {members.length > 0 ? (
          members.map((member) => (
            <li key={member.id} className="bg-gray-100 rounded shadow-md">
              <div
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-200"
                onClick={() => toggleMemberDropdown(member.id)}
              >
                <span className="font-semibold text-gray-800">{member.name}</span>
                <span className="text-gray-500">
                  {openMemberId === member.id ? "▲" : "▼"}
                </span>
              </div>
              {openMemberId === member.id && (
                <div className="p-4 bg-gray-50">
                  <h3 className="font-bold mb-2 text-lg">Tasks</h3>
                  <ul className="space-y-2">
                    {member.tasks.length > 0 ? (
                      member.tasks.map((task) => (
                        <li
                          key={task.id}
                          className="p-3 bg-gray-200 rounded flex justify-between items-center"
                        >
                          <div>
                            <h4 className="font-semibold">{task.title}</h4>
                            <p>{task.description}</p>
                            <p className="text-sm text-gray-600">
                              Status: {task.status}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditTask(task)}
                              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(member.id, task.id)}
                              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p>No tasks available for this member.</p>
                    )}
                  </ul>
                  <div className="mt-4">
                    <h4 className="font-bold mb-2">
                      {isEditingTask ? "Edit Task" : "Add Task"}
                    </h4>
                    <input
                      type="text"
                      placeholder="Title"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask((prev) => ({ ...prev, title: e.target.value }))
                      }
                      className="p-2 border rounded w-full mb-2"
                    />
                    <textarea
                      placeholder="Description"
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="p-2 border rounded w-full mb-2"
                    ></textarea>
                    <select
                      value={newTask.status}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          status: e.target.value as Task["status"],
                        }))
                      }
                      className="p-2 border rounded w-full mb-2"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <button
                      onClick={() => handleSaveTask(member.id)}
                      className="px-6 py-2 bg-green-500 text-white rounded"
                    >
                      Save Task
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>No team members available. Add members to start managing tasks.</p>
        )}
      </ul>
    </div>
  );
};

export default TaskManager;
