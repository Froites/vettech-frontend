// src/components/prescriptions/PrescriptionCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Pill, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Download,
  ShoppingBag
} from 'lucide-react';
import { format, parseISO, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Prescription } from '../../types/prescription';

interface PrescriptionCardProps {
  prescription: Prescription;
  showPetInfo?: boolean;
  compact?: boolean;
  onDispense?: (id: string) => void;
  isDispensing?: boolean;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({ 
  prescription, 
  showPetInfo = false, 
  compact = false,
  onDispense,
  isDispensing = false
}) => {
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  const formatDateTime = (dateString: string) => {
    return format(parseISO(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

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

  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <Pill className="h-4 w-4 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              {showPetInfo && prescription.pet && (
                <h4 className="font-medium text-gray-900 truncate">
                  {prescription.pet.name}
                </h4>
              )}
              <p className="text-sm text-gray-600">
                {formatDate(prescription.createdAt)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {prescription.medications.length} medicamento{prescription.medications.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {getStatusText()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <Pill className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            {showPetInfo && prescription.pet && (
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Receita - {prescription.pet.name}
              </h3>
            )}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Criada em {formatDate(prescription.createdAt)}
              </div>
              {prescription.veterinarian && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Dr. {prescription.veterinarian.profile?.firstName} {prescription.veterinarian.profile?.lastName}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          <StatusIcon className="h-4 w-4 mr-1" />
          {getStatusText()}
        </span>
      </div>

      {/* Medications */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Pill className="h-4 w-4 mr-2" />
          Medicamentos Prescritos ({prescription.medications.length})
        </h4>
        <div className="space-y-3">
          {prescription.medications.map((medication, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{medication.name}</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Dosagem:</span> {medication.dosage}
                    </div>
                    <div>
                      <span className="font-medium">Frequência:</span> {medication.frequency}
                    </div>
                    <div>
                      <span className="font-medium">Duração:</span> {medication.duration}
                    </div>
                  </div>
                  {medication.instructions && (
                    <div className="mt-2 text-sm text-gray-700">
                      <span className="font-medium">Instruções:</span> {medication.instructions}
                    </div>
                  )}
                  {medication.warnings && medication.warnings.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {medication.warnings.map((warning, wIndex) => (
                          <span key={wIndex} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-warning-100 text-warning-800">
                            ⚠️ {warning}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      {prescription.instructions && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Instruções Gerais</h4>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">{prescription.instructions}</p>
          </div>
        </div>
      )}

      {/* Validity and Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Válida até:</span> {formatDate(prescription.validUntil)}
        </div>
        
        <div className="flex items-center space-x-2">
          <Link to={`/prescriptions/${prescription.id}`}>
            <button className="btn btn-outline btn-sm">
              <Eye className="h-4 w-4 mr-1" />
              Detalhes
            </button>
          </Link>
          
          <button className="btn btn-outline btn-sm">
            <Download className="h-4 w-4 mr-1" />
            PDF
          </button>
          
          {isActive && onDispense && (
            <button
              onClick={() => onDispense(prescription.id)}
              disabled={isDispensing}
              className="btn btn-success btn-sm"
            >
              {isDispensing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
              ) : (
                <ShoppingBag className="h-4 w-4 mr-1" />
              )}
              Dispensar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};