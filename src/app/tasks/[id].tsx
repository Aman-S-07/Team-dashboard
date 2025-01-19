// app/tasks/[id].tsx
import { useRouter } from 'next/router';

const TaskDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Tasks for Member {id}</h1>
      {/* Render the tasks for the selected member */}
    </div>
  );
};

export default TaskDetail;