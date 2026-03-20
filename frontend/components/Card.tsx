export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      {children}
    </div>
  );
}