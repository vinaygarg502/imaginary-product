import {
  ArrowLeft,
  Code2,
  X,
  Menu,
  Info,
  Loader2,
  AlertTriangle,
  Copy,
  GripVertical,
  Calendar,
  Phone,
  ListFilter,
  AlertCircle,
  PackageX,
  Filter,
  Package,
  ChevronRight,
  CheckCircle2,
  ThumbsUp,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Shield,
  ChevronLeft,
  Check,
  ArrowRight,
  Loader,
  XCircle, 
  ShoppingCart,
  Tag,
  Layers,
  Activity,
  Pause, 
  Play,
  Video,
  ShieldCheck,
  Key,
  HelpCircle,
  User,
  Book,
  LibraryBig,
  LayoutDashboard,
  Star,
  FileText
} from "lucide-react";

const ICON_MAP = {
  ArrowLeft,
  Code2,
  X,
  Menu,
  Info,
  Loader2,
  AlertTriangle,
  Copy,
  GripVertical,
  Calendar,
  Phone,
  ListFilter,
  AlertCircle,
  PackageX,
  Filter,
  Package,
  ChevronRight,
  CheckCircle2,
  ThumbsUp,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Shield,
  ChevronLeft,
  Check,
  ArrowRight,
  Loader,
  XCircle, 
  ShoppingCart,
  Tag,
  Layers,
  Activity,
  Pause, 
  Play,
  Video,
  ShieldCheck,
  Key,
  HelpCircle,
  User,
  Book,
  LibraryBig,
  LayoutDashboard,
  Star,
  FileText
};

const Icon = ({
  name,
  size = 24,
  color = "currentColor",
  className = "",
  strokeWidth = 2,
  ...props
})=>{
  const IconComponent = ICON_MAP?.[name];

  if (!IconComponent) {
    return (
      <HelpCircle
        size={size}
        color="gray"
        strokeWidth={strokeWidth}
        className={className}
        {...props}
      />
    );
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
}
export default Icon;
