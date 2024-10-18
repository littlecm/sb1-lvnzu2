// Simplified version of the use-toast hook
import { toast } from "@/components/ui/toast"

export const useToast = () => {
  return {
    toast: (props) => {
      toast(props)
    },
  }
}