export default function PanelAdmin() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Panel de administracion</h1>
        <p>Solo los admin pueden ver esta pagina.</p>
      </div>
    </div>
  );
}