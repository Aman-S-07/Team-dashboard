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

  useEffect(() => {
    const storedMembers = localStorage.getItem("teamMembers");
    if (storedMembers) {
      const parsedMembers = JSON.parse(storedMembers);
      const membersWithTasks = parsedMembers.map((member: TeamMember) => ({
        ...member,
        tasks: member.tasks || [],
      }));
      setMembers(membersWithTasks);

      const savedSelectedMember = localStorage.getItem("selectedMember");
      if (savedSelectedMember) {
        setSelectedMember(JSON.parse(savedSelectedMember));
      }
    } else {
      // Set empty array if no members are found
      setMembers([]);
    }
  }, []);

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

      setMembers(updatedMembers);

      setSelectedMember((prev) => {
        if (!prev) return null;
        const updatedTasks = isEditingTask
          ? prev.tasks.map((task) =>
              task.id === newTask.id ? updatedTask : task
            )
          : [...(prev.tasks || []), updatedTask];
        return { ...prev, tasks: updatedTasks };
      });

      updateLocalStorage(updatedMembers);
      localStorage.setItem("selectedMember", JSON.stringify(selectedMember));
    }

    setNewTask({ id: 0, title: "", description: "", status: "To Do" });
    setIsEditingTask(false);
  };

  const handleSelectMember = (member: TeamMember) => {
    setSelectedMember(member);
    localStorage.setItem("selectedMember", JSON.stringify(member));
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

      setMembers(updatedMembers);

      setSelectedMember((prev) => {
        if (!prev) return null;
        const updatedTasks = prev.tasks.filter((task) => task.id !== taskId);
        return { ...prev, tasks: updatedTasks };
      });

      updateLocalStorage(updatedMembers);
      localStorage.setItem("selectedMember", JSON.stringify(selectedMember));
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-lg font-bold mb-4">Team Members</h2>
        <ul>
          {members.length > 0 ? (
            members.map((member) => (
              <li
                key={member.id} // Using member.id as the key
                className={`p-2 mb-2 rounded cursor-pointer ${
                  selectedMember?.id === member.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
                onClick={() => handleSelectMember(member)}
              >
                {member.name}
              </li>
            ))
          ) : (
            <p>No team members available. Add members to start managing tasks.</p>
          )}
        </ul>
      </div>

      <div className="w-3/4 p-4">
        {selectedMember ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Tasks for {selectedMember.name}
            </h2>
            <ul className="mb-4">
              {selectedMember.tasks.length > 0 ? (
                selectedMember.tasks.map((task) => (
                  <li
                    key={task.id} // Using task.id as the key
                    className="p-4 mb-2 bg-gray-100 rounded flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p>{task.description}</p>
                      <p className="text-sm text-gray-600">
                        Status: {task.status}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded"
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
            <div>
              <h3 className="text-lg font-bold mb-2">
                {isEditingTask ? "Edit Task" : "Add Task"}
              </h3>
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="p-2 border rounded"
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
                  className="p-2 border rounded"
                ></textarea>
                <select
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      status: e.target.value as Task["status"],
                    }))
                  }
                  className="p-2 border rounded"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <button
                  onClick={handleSaveTask}
                  className="px-6 py-2 bg-green-500 text-white rounded"
                >
                  Save Task
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>Select a member to view their tasks</div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
