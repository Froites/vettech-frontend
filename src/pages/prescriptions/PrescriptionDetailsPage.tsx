import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DetailsPageLayout } from '../../components/layouts/DetailsPageLayout';
import { usePrescription, useDigitalPrescription } from '../../hooks/usePrescriptions';
import { useAuthStore } from '../../stores/authStore';
import { 
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
import { format, parseISO, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PrescriptionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showQRCode, setShowQRCode] = useState(false);

  const { data: prescription, isLoading } = usePrescription(id!);
  const { data: digitalPrescription, isLoading: loadingDigital } = useDigitalPrescription(id!);

  if (!prescription && !isLoading) {
    return (
      <DetailsPageLayout
        title="Receita não encontrada"
        onBack={() => navigate('/prescriptions')}
        error={{
          title: "Receita não encontrada",
          description: "A receita solicitada não foi encontrada."
        }}
      >
        <div></div>
      </DetailsPageLayout>
    );
  }

  // Verificar status da receita
  const now = new Date();
  const validUntil = prescription ? parseISO(prescription.validUntil) : new Date();
  const isExpired = prescription ? isBefore(validUntil, now) : false;
  const isActive = prescription ? (!prescription.isDispensed && !isExpired) : false;

  const getStatusConfig = () => {
    if (!prescription) return { color: 'gray' as const, text: 'Carregando...', icon: Clock };
    
    if (prescription.isDispensed) return { color: 'gray' as const, text: 'Dispensada', icon: CheckCircle };
    if (isExpired) return { color: 'error' as const, text: 'Expirada', icon: AlertTriangle };
    return { color: 'success' as const, text: 'Ativa', icon: Clock };
  };

  const statusConfig = getStatusConfig();

  const handleDownloadPDF = () => {
    console.log('📄 Download PDF da receita');
    alert('Funcionalidade em desenvolvimento');
  };

  const handleDispense = () => {
    if (window.confirm('Confirma que esta receita foi dispensada na farmácia?')) {
      console.log('💊 Dispensar receita');
      alert('Funcionalidade em desenvolvimento');
    }
  };

  const canDispense = user?.role === 'TUTOR' && isActive;

  // 🆕 Configuração do DetailsPageLayout
  const pageConfig = {
    title: "Receita Médica",
    subtitle: prescription ? 
      `${prescription.pet?.name || prescription.appointment?.pet?.name} • Criada em ${format(parseISO(prescription.createdAt), 'dd/MM/yyyy', { locale: ptBR })}` : 
      undefined,
    headerIcon: Pill,
    status: {
      text: statusConfig.text,
      icon: statusConfig.icon,
      color: statusConfig.color
    },

    // 🆕 Info Cards usando dados existentes
    infoCards: prescription ? [
      {
        icon: Heart,
        title: "Paciente",
        items: [
          {
            label: "Nome",
            value: prescription.pet?.name || prescription.appointment?.pet?.name || '--'
          },
          {
            label: "Espécie", 
            value: prescription.pet?.species || prescription.appointment?.pet?.species || '--'
          },
          ...(prescription.pet?.breed ? [{
            label: "Raça",
            value: prescription.pet.breed
          }] : [])
        ]
      },
      {
        icon: User,
        title: "Veterinário",
        items: [
          {
            label: "Nome",
            value: `Dr. ${prescription.veterinarian?.profile?.firstName} ${prescription.veterinarian?.profile?.lastName}`
          },
          ...(prescription.veterinarian?.veterinarianProfile?.crmv ? [{
            label: "CRMV",
            value: prescription.veterinarian.veterinarianProfile.crmv
          }] : [])
        ]
      },
      {
        icon: Calendar,
        title: "Validade",
        items: [
          {
            label: "Criada em",
            value: format(parseISO(prescription.createdAt), 'dd/MM/yyyy', { locale: ptBR })
          },
          {
            label: "Válida até",
            value: <span className={isExpired ? 'text-error-600 font-medium' : ''}>
              {format(parseISO(prescription.validUntil), 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          },
          ...(prescription.isDispensed ? [{
            label: "Dispensada em",
            value: format(parseISO(prescription.updatedAt), 'dd/MM/yyyy', { locale: ptBR })
          }] : [])
        ]
      }
    ] : undefined,

    // 🆕 Actions usando dados existentes
    actions: [
      {
        text: "Download PDF",
        icon: Download,
        onClick: handleDownloadPDF,
        variant: 'outline' as const
      },
      {
        text: "QR Code",
        icon: QrCode,
        onClick: () => setShowQRCode(!showQRCode),
        variant: 'outline' as const
      },
      ...(canDispense ? [{
        text: "Marcar como Dispensada", 
        icon: ShoppingBag,
        onClick: handleDispense,
        variant: 'success' as const
      }] : [])
    ]
  };

  return (
    <DetailsPageLayout
      title={pageConfig.title}
      subtitle={pageConfig.subtitle}
      onBack={() => navigate('/prescriptions')}
      headerIcon={pageConfig.headerIcon}
      status={pageConfig.status}
      infoCards={pageConfig.infoCards}
      actions={pageConfig.actions}
      isLoading={isLoading}
    >
      {/* 🎯 Conteúdo específico da receita */}
      {prescription && (
        <>
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

          {/* QR Code Section */}
          {showQRCode && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
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

          {/* Status Footer Info */}
          {!isActive && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-center text-sm text-gray-500">
                {prescription.isDispensed 
                  ? '✅ Esta receita já foi dispensada'
                  : '⚠️ Esta receita está expirada'
                }
              </div>
            </div>
          )}
        </>
      )}
    </DetailsPageLayout>
  );
};

export default PrescriptionDetailsPage;