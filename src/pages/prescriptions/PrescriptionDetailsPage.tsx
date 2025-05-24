// src/pages/prescriptions/PrescriptionDetailsPage.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { usePrescription, useDigitalPrescription } from '../../hooks/usePrescriptions';
import { useAuthStore } from '../../stores/authStore';
import { 
  ArrowLeft, 
  Pill, 
  Calendar,
  User,
  Download,
  QrCode,
  CheckCircle,
  Clock,
  AlertTriangle,
  ShoppingBag,
  Heart,
  FileText
} from 'lucide-react';
import { format, parseISO, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PrescriptionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showQRCode, setShowQRCode] = useState(false);

  const { data: prescription, isLoading } = usePrescription(id!);
  const { data: digitalPrescription, isLoading: loadingDigital } = useDigitalPrescription(id!);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!prescription) {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-error-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Receita não encontrada</h3>
          <p className="text-gray-600">A receita solicitada não foi encontrada.</p>
        </div>
      </Layout>
    );
  }

  // Verificar status da receita
  const now = new Date();
  const validUntil = parseISO(prescription.validUntil);
  const isExpired = isBefore(validUntil, now);
  const isActive = !prescription.isDispensed && !isExpired;

  const getStatusColor = () => {
    if (prescription.isDispensed) return 'text-gray-600 bg-gray-100';
    if (isExpired) return 'text-error-600 bg-error-100';
    return 'text-success-600 bg-success-100';
  };

  const getStatusText = () => {
    if (prescription.isDispensed) return 'Dispensada';
    if (isExpired) return 'Expirada';
    return 'Ativa';
  };

  const getStatusIcon = () => {
    if (prescription.isDispensed) return CheckCircle;
    if (isExpired) return AlertTriangle;
    return Clock;
  };

  const StatusIcon = getStatusIcon();

  const handleDownloadPDF = () => {
    // TODO: Implementar download do PDF
    console.log('📄 Download PDF da receita');
    alert('Funcionalidade em desenvolvimento');
  };

  const handleDispense = () => {
    if (window.confirm('Confirma que esta receita foi dispensada na farmácia?')) {
      // TODO: Implementar dispensar receita
      console.log('💊 Dispensar receita');
      alert('Funcionalidade em desenvolvimento');
    }
  };

  const canDispense = user?.role === 'TUTOR' && isActive;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/prescriptions')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Pill className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Receita Médica
              </h1>
              <p className="text-gray-600">
                {prescription.pet?.name || prescription.appointment?.pet?.name} • 
                Criada em {format(parseISO(prescription.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </div>
          </div>
          
          <div className="ml-auto">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
              <StatusIcon className="h-4 w-4 mr-1" />
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pet Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Heart className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Paciente</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Nome:</span>
                <span className="ml-2 font-medium">{prescription.pet?.name || prescription.appointment?.pet?.name}</span>
              </div>
              <div>
                <span className="text-gray-500">Espécie:</span>
                <span className="ml-2">{prescription.pet?.species || prescription.appointment?.pet?.species}</span>
              </div>
              {prescription.pet?.breed && (
                <div>
                  <span className="text-gray-500">Raça:</span>
                  <span className="ml-2">{prescription.pet.breed}</span>
                </div>
              )}
            </div>
          </div>

          {/* Veterinarian Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Veterinário</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Nome:</span>
                <span className="ml-2 font-medium">
                  Dr. {prescription.veterinarian?.profile?.firstName} {prescription.veterinarian?.profile?.lastName}
                </span>
              </div>
              {prescription.veterinarian?.veterinarianProfile?.crmv && (
                <div>
                  <span className="text-gray-500">CRMV:</span>
                  <span className="ml-2">{prescription.veterinarian.veterinarianProfile.crmv}</span>
                </div>
              )}
            </div>
          </div>

          {/* Validity Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Calendar className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Validade</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Criada em:</span>
                <span className="ml-2">{format(parseISO(prescription.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
              <div>
                <span className="text-gray-500">Válida até:</span>
                <span className={`ml-2 ${isExpired ? 'text-error-600 font-medium' : ''}`}>
                  {format(parseISO(prescription.validUntil), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              </div>
              {prescription.isDispensed && (
                <div>
                  <span className="text-gray-500">Dispensada em:</span>
                  <span className="ml-2">{format(parseISO(prescription.updatedAt), 'dd/MM/yyyy', { locale: ptBR })}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Medications */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Pill className="h-5 w-5 mr-2" />
            Medicamentos Prescritos ({prescription.medications.length})
          </h3>
          
          <div className="space-y-4">
            {prescription.medications.map((medication, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">{medication.name}</h4>
                  <div className="text-sm text-gray-500">#{index + 1}</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="p-3 bg-white rounded border">
                    <div className="text-xs text-gray-500 mb-1">DOSAGEM</div>
                    <div className="font-medium text-gray-900">{medication.dosage}</div>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <div className="text-xs text-gray-500 mb-1">FREQUÊNCIA</div>
                    <div className="font-medium text-gray-900">{medication.frequency}</div>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <div className="text-xs text-gray-500 mb-1">DURAÇÃO</div>
                    <div className="font-medium text-gray-900">{medication.duration}</div>
                  </div>
                </div>

                {medication.instructions && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Instruções específicas:</div>
                    <div className="text-sm text-gray-600 p-2 bg-white rounded border">
                      {medication.instructions}
                    </div>
                  </div>
                )}

                {medication.warnings && medication.warnings.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Avisos importantes:</div>
                    <div className="flex flex-wrap gap-2">
                      {medication.warnings.map((warning, wIndex) => (
                        <span key={wIndex} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-warning-100 text-warning-800">
                          ⚠️ {warning}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Instruções Gerais
          </h3>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900 leading-relaxed">{prescription.instructions}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownloadPDF}
                className="btn btn-outline btn-md"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className="btn btn-outline btn-md"
              >
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </button>
              
              {canDispense && (
                <button
                  onClick={handleDispense}
                  className="btn btn-success btn-md"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Marcar como Dispensada
                </button>
              )}
            </div>

            {!isActive && (
              <div className="text-sm text-gray-500">
                {prescription.isDispensed 
                  ? '✅ Esta receita já foi dispensada'
                  : '⚠️ Esta receita está expirada'
                }
              </div>
            )}
          </div>

          {/* QR Code Section */}
          {showQRCode && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-4">Código QR para Verificação</h4>
                {loadingDigital ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : digitalPrescription ? (
                  <div className="inline-block p-4 bg-white border-2 border-gray-300 rounded-lg">
                    <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
                      <QrCode className="h-12 w-12 text-gray-400" />
                      <div className="ml-2 text-sm text-gray-500">QR Code</div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      Código: {digitalPrescription.verificationCode}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    Erro ao carregar QR Code
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-3">
                  Use este código para verificação em farmácias
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PrescriptionDetailsPage;