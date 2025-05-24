import { Layout } from "../../components/layout/Layout";


const AppointmentsPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
            <p className="text-gray-600">Gerencie suas consultas e compromissos</p>
          </div>
          <button className="btn btn-primary">
            + Novo Agendamento
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Funcionalidade em Desenvolvimento
          </h3>
          <p className="text-gray-600">
            O sistema de agendamentos estará disponível em breve.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AppointmentsPage;