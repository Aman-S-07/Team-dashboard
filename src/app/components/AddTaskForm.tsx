import React from "react";

type Props = {
  selectedMember: { id: number; name: string; tasks: { title: string; description: string }[] } | null;
  newTask: { title: string; description: string };
  setNewTask: React.Dispatch<React.SetStateAction<{ title: string; description: string }>>;
  addTask: () => void;
  setShowAddTaskForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddTaskForm = ({ selectedMember, newTask, setNewTask, addTask, setShowAddTaskForm }: Props) => (
  <div className="p-6 bg-white rounded-lg shadow-lg mt-6">
    <h3 className="text-xl font-semibold mb-4">Add Task for {selectedMember?.name}</h3>
    <input
      type="text"
      placeholder="Task Title"
      value={newTask.title}
      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
      className="border p-3 rounded-lg w-full mb-4"
    />
    <textarea
      placeholder="Task Description"
      value={newTask.description}
      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
      className="border p-3 rounded-lg w-full mb-4"
    />
    <button
      onClick={addTask}
      className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
    >
      Add Task
    </button>
    <button
      onClick={() => setShowAddTaskForm(false)}
      className="bg-red-500 text-white px-6 py-3 rounded-lg ml-4 hover:bg-red-600"
    >
      Cancel
    </button>
  </div>
);

export default AddTaskForm;
