type MemberProps = {
  member: {
    id: number;
    name: string;
    role: string;
    bio: string;
  };
  deleteMember: (id: number) => void; // Function to handle member deletion
  viewTask: (id: number) => void;    // Function to handle task viewing
};

const Member: React.FC<MemberProps> = ({ member, deleteMember, viewTask }) => {
  return (
    <div className="card p-4 m-4 border rounded shadow">
      <h2 className="text-xl font-bold">{member.name}</h2>
      <p>{member.role}</p>
      <p>{member.bio}</p>
      <button
        onClick={() => viewTask(member.id)}
        className="bg-blue-500 text-white px-4 py-2 rounded m-2"
      >
        View Task
      </button>
      <button
        onClick={() => deleteMember(member.id)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Delete
      </button>
    </div>
  );
};

export default Member;
