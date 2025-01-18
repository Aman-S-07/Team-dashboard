import React from "react";

interface NewMemberProps {
  newMember: { name: string; role: string; bio: string };
  setNewMember: React.Dispatch<React.SetStateAction<{ name: string; role: string; bio: string }>>;
  addMember: () => void;
  setShowAddMemberForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddMemberForm: React.FC<NewMemberProps> = ({
  newMember,
  setNewMember,
  addMember,
  setShowAddMemberForm,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    addMember(); // Trigger the add member function
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Member</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={newMember.name}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          className="border p-3 rounded-lg w-full mb-4"
        />
        <input
          type="text"
          placeholder="Role"
          value={newMember.role}
          onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
          className="border p-3 rounded-lg w-full mb-4"
        />
        <textarea
          placeholder="Bio"
          value={newMember.bio}
          onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
          className="border p-3 rounded-lg w-full mb-4"
        />
        <button
          type="submit" // Submit button triggers form submission
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
        >
          Add Member
        </button>
        <button
          type="button" // This will only close the form, no form submission
          onClick={() => setShowAddMemberForm(false)}
          className="bg-red-500 text-white px-6 py-3 rounded-lg ml-4 hover:bg-red-600"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddMemberForm;
