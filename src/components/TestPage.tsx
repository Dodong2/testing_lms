
import { addTask } from "@/actions/actions";
import { prisma } from "@/lib/db";

export default async function TestPage() {
  const tasks = await prisma.task.findMany()

  return (
    <main className="bg-zinc-200 flex min-h-screen flex-col items-center pt-10">
      <h1 className="text-3xl text-black font-medium">All tasks:</h1>
      {tasks.map((task) => (
        <ul key={task.id} className="text-black">
        <li>{task.title} </li>
        </ul>
      ))}

      <form action={addTask} className="space-x-2 h-4">
        <input type="text" name="title" className="bg-white te px-3 py-1 rounded text-black"/>
        <button type="submit" className="bg-blue-500 px-3 py-1 text-black rounded">add task</button>
      </form>
    </main>
  );
}