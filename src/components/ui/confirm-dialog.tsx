import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

type DialogVariant = "default" | "success" | "warning" | "destructive";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: DialogVariant;
  loading?: boolean;
}

const variantConfig = {
  default: {
    icon: Info,
    iconClass: "text-blue-500",
    confirmClass: "",
  },
  success: {
    icon: CheckCircle2,
    iconClass: "text-green-500",
    confirmClass: "bg-green-600 hover:bg-green-700",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-yellow-500",
    confirmClass: "bg-yellow-600 hover:bg-yellow-700",
  },
  destructive: {
    icon: XCircle,
    iconClass: "text-red-500",
    confirmClass: "bg-red-600 hover:bg-red-700",
  },
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  variant = "default",
  loading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
    if (!loading) {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-zinc-800 ${config.iconClass}`}>
              <Icon className="h-5 w-5" />
            </div>
            <AlertDialogTitle className="text-white text-lg">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-zinc-400 pt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleCancel}
            className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700 hover:text-white"
            disabled={loading}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={config.confirmClass}
            disabled={loading}
          >
            {loading ? "Processando..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook for easy imperative usage
interface UseConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
}

interface UseConfirmReturn {
  confirm: () => Promise<boolean>;
  ConfirmDialogComponent: React.FC;
}

export function useConfirm(options: UseConfirmOptions): UseConfirmReturn {
  const [open, setOpen] = React.useState(false);
  const [resolveRef, setResolveRef] = React.useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = React.useCallback(() => {
    return new Promise<boolean>((resolve) => {
      setResolveRef(() => resolve);
      setOpen(true);
    });
  }, []);

  const handleConfirm = React.useCallback(() => {
    resolveRef?.(true);
    setOpen(false);
  }, [resolveRef]);

  const handleCancel = React.useCallback(() => {
    resolveRef?.(false);
    setOpen(false);
  }, [resolveRef]);

  const ConfirmDialogComponent = React.useCallback(
    () => (
      <ConfirmDialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleCancel();
          }
        }}
        title={options.title}
        description={options.description}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        variant={options.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    ),
    [open, options, handleConfirm, handleCancel]
  );

  return { confirm, ConfirmDialogComponent };
}
