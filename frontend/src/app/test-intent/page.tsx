import IntentTester from "@/components/IntentTester";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-600">
          🚀 Prueba del Sistema de Intenciones
        </h1>
        <IntentTester />
      </div>
    </div>
  );
}
