import { Check, X, Shield } from "lucide-react";
import { useEffect } from "react";

interface PasswordValidationPopoverProps {
  password: string;
  onConfirm: () => void;
  onClose: () => void;
}

const PasswordValidationPopover = ({
  password,
  onConfirm,
  onClose,
}: PasswordValidationPopoverProps) => {
  const checks = [
    {
      label: "6+ characters",
      passed: password.length >= 6,
    },
    {
      label: "One capital letter",
      passed: /[A-Z]/.test(password),
    },
    {
      label: "One symbol (!@#$...)",
      passed: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    },
    {
      label: "One number",
      passed: /[0-9]/.test(password),
    },
  ];

  const allPassed = checks.every((check) => check.passed);

  // Auto-confirm and close when all checks pass
  useEffect(() => {
    if (allPassed) {
      onConfirm();
      onClose();
    }
  }, [allPassed, onConfirm, onClose]);

  return (
    <div className="absolute top-full left-0 mt-2 w-full md:left-full md:top-0 md:ml-3 md:mt-0 md:w-56 bg-popover border rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm">Requirements</span>
      </div>
      <div className="space-y-2">
        {checks.map((check, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 p-2 rounded text-xs ${
              check.passed
                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {check.passed ? (
              <Check className="h-3 w-3 shrink-0" />
            ) : (
              <X className="h-3 w-3 shrink-0" />
            )}
            <span>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordValidationPopover;
