import React from 'react';
import {
  Radio,
  Users,
  FolderLock,
  Mail,
  BarChart3,
  DollarSign,
  MapPin,
  Shield,
  AlertTriangle,
  Database,
  Search,
  Settings,
  Cpu,
} from 'lucide-react';

interface AppIconRendererProps {
  name: string;
  className?: string;
  size?: number;
}

export const AppIconRenderer: React.FC<AppIconRendererProps> = ({ name, className = 'w-5 h-5', size }) => {
  const iconProps = { className, ...(size ? { size } : {}) };

  switch (name.toLowerCase()) {
    case 'dispatch':
    case 'radio':
    case 'cad':
      return <Radio {...iconProps} />;
    case 'personnel':
    case 'users':
    case 'roster':
      return <Users {...iconProps} />;
    case 'cases':
    case 'case files':
    case 'folder':
    case 'evidence':
      return <FolderLock {...iconProps} />;
    case 'inbox':
    case 'mail':
    case 'comms':
      return <Mail {...iconProps} />;
    case 'analytics':
    case 'chart':
    case 'stats':
      return <BarChart3 {...iconProps} />;
    case 'budget':
    case 'finance':
    case 'dollar':
      return <DollarSign {...iconProps} />;
    case 'map':
    case 'city map':
    case 'gps':
      return <MapPin {...iconProps} />;
    case 'shield':
    case 'police':
      return <Shield {...iconProps} />;
    case 'settings':
      return <Settings {...iconProps} />;
    case 'cpu':
    case 'ai':
    case 'gemini':
      return <Cpu {...iconProps} />;
    case 'alert':
      return <AlertTriangle {...iconProps} />;
    case 'database':
      return <Database {...iconProps} />;
    case 'search':
      return <Search {...iconProps} />;
    default:
      return <Shield {...iconProps} />;
  }
};
