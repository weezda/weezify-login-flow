
import { toast } from "@/components/ui/use-toast";

const showAlert = (title: string, message: string, variant: 'default' | 'destructive' = 'default') => {
  toast({
    title,
    description: message,
    variant
  });
};

const AlertService = {
  showAlert,
  showSuccess: (title: string, message: string) => showAlert(title, message, 'default'),
  showError: (title: string, message: string) => showAlert(title, message, 'destructive')
};

export default AlertService;
