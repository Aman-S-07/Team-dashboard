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
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [newTask, setNewTask] = useState<Task>({
    id: 0,
    title: "",
    description: "",
    status: "To Do",
  });
  const [isEditingTask, setIsEditingTask] = useState(false);

  // Load members from localStorage
  useEffect(() => {
    const storedMembers = localStorage.getItem("teamMembers");
    if (storedMembers) {
      const parsedMembers = JSON.parse(storedMembers);
      // Ensure each member has a tasks array
      const membersWithTasks = parsedMembers.map((member: TeamMember) => ({
        ...member,
        tasks: member.tasks || [], // Set empty array if tasks are not defined
      }));
      setMembers(membersWithTasks);

      // If there's a selected member in localStorage, set it
      const savedSelectedMember = localStorage.getItem("selectedMember");
      if (savedSelectedMember) {
        setSelectedMember(JSON.parse(savedSelectedMember));
      }
    } else {
      console.error("No members found in localStorage.");
    }
  }, []);

  // Update localStorage whenever members or tasks change
  const updateLocalStorage = (updatedMembers: TeamMember[]) => {
    localStorage.setItem("teamMembers", JSON.stringify(updatedMembers));
  };

  const handleSaveTask = () => {
    if (!newTask.title || !newTask.description) {
      alert("Please fill out all fields for the task.");
      return;
    }

    const updatedTask = { ...newTask, id: isEditingTask ? newTask.id : Date.now() };

    if (selectedMember) {
      const updatedMembers = members.map((member) =>
        member.id === selectedMember.id
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

      // Save updated members to state
      setMembers(updatedMembers);

      // Update selected member's tasks
      setSelectedMember((prev) => {
        if (prev) {
          return {
            ...prev,
            tasks: isEditingTask
              ? prev.tasks.map((task) =>
                  task.id === newTask.id ? updatedTask : task
                )
              : [...prev.tasks, updatedTask],
          };
        }
        return prev;
      });

      // Update localStorage
      updateLocalStorage(updatedMembers);

      setIsEditingTask(false);
      setNewTask({ id: 0, title: "", description: "", status: "To Do" });
    }
  };

  const handleEditTask = (task: Task) => {
    setNewTask(task);
    setIsEditingTask(true);
  };

  const handleDeleteTask = (taskId: number) => {
    if (selectedMember) {
      const updatedMembers = members.map((member) =>
        member.id === selectedMember.id
          ? {
              ...member,
              tasks: member.tasks.filter((task) => task.id !== taskId),
            }
          : member
      );

      // Save updated members to state and localStorage
      setMembers(updatedMembers);
      updateLocalStorage(updatedMembers);

      // Update selected member's tasks
      setSelectedMember((prev) => {
        if (prev) {
          return {
            ...prev,
            tasks: prev.tasks.filter((task) => task.id !== taskId),
          };
        }
        return prev;
      });
    }
  };

  const handleCancelEdit = () => {
    setNewTask({ id: 0, title: "", description: "", status: "To Do" });
    setIsEditingTask(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl mb-4">Task Manager</h2>
      <div className="mb-4">
        <select
          className="p-2 border rounded"
          onChange={(e) => {
            const member = members.find((m) => m.id === +e.target.value);
            setSelectedMember(member || null);
          }}
        >
          <option value="">Select Team Member</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      {selectedMember && (
        <div>
          <h3 className="font-bold">{selectedMember.name}&#39;s Tasks</h3>
          <ul className="list-none">
            {selectedMember.tasks.map((task) => (
              <li key={task.id} className="mb-2">
                <div className="flex justify-between">
                  <div>{task.title}</div>
                  <div className="text-sm text-gray-500">{task.status}</div>
                </div>
                <div>{task.description}</div>
                <button
                  className="text-blue-500"
                  onClick={() => handleEditTask(task)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 ml-2"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <h4 className="mt-4 font-bold">Add/Edit Task</h4>
          <input
            type="text"
            className="p-2 border rounded w-full"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <textarea
            className="p-2 border rounded w-full mt-2"
            placeholder="Task description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
          <select
            className="p-2 border rounded w-full mt-2"
            value={newTask.status}
            onChange={(e) =>
              setNewTask({ ...newTask, status: e.target.value as Task["status"] })
            }
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <div className="mt-2">
            <button
              onClick={handleSaveTask}
              className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
            >
              {isEditingTask ? "Save Changes" : "Add Task"}
            </button>
            {isEditingTask && (
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
