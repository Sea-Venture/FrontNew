import { useState } from "react";
import { ArrowLeft, Upload, FileText, Phone, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";

interface BecomeAdminFormProps {
  onClose: () => void;
}

export default function BecomeAdminForm({ onClose }: BecomeAdminFormProps) {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    nic: "",
    phone: "",
    registrationNumber: "",
    touristLicence: null as File | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nic.trim()) {
      newErrors.nic = "NIC is required";
    } else if (!/^[0-9]{9}[vVxX]$|^[0-9]{12}$/.test(formData.nic)) {
      newErrors.nic = "Please enter a valid NIC number";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(\+94|0)[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Sri Lankan phone number";
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration number is required";
    }

    if (!formData.touristLicence) {
      newErrors.touristLicence = "Tourist licence document is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, touristLicence: "Please upload a valid image or PDF file" }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, touristLicence: "File size must be less than 5MB" }));
        return;
      }

      setFormData(prev => ({ ...prev, touristLicence: file }));
      setErrors(prev => ({ ...prev, touristLicence: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { accessToken } = useAuthStore.getState();

      if (!accessToken) {
        throw new Error('No access token available. Please log in again.');
      }


      alert('Admin application submitted successfully! We will review your application and get back to you soon.');
      onClose();

    } catch (error) {
      console.error('Admin application failed:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to submit application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-sky-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-200/50 p-6 sm:p-8 ghibli-card">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-blue-100/50 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 text-blue-700" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold ghibli-text-gradient">Become an Admin</h1>
              <p className="text-blue-600 text-sm mt-1">Apply to become a Sea Ventures administrator</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="nic" className="flex items-center gap-2 text-blue-700">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  National Identity Card (NIC)
                </FieldLabel>
                <Input
                  id="nic"
                  type="text"
                  placeholder="123456789V or 123456789012"
                  value={formData.nic}
                  onChange={(e) => handleInputChange("nic", e.target.value)}
                  required
                  className={`${errors.nic ? "border-red-500" : "border-blue-200 focus:border-blue-400"} bg-white/80 backdrop-blur-sm`}
                />
                <FieldDescription className={errors.nic ? "text-red-500" : "text-blue-600"}>
                  {errors.nic || "Enter your NIC number (e.g., 123456789V or 12-digit number)"}
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="phone" className="flex items-center gap-2 text-blue-700">
                  <Phone className="h-4 w-4 text-blue-600" />
                  Phone Number
                </FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+94712345678 or 0712345678"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                  className={`${errors.phone ? "border-red-500" : "border-blue-200 focus:border-blue-400"} bg-white/80 backdrop-blur-sm`}
                />
                <FieldDescription className={errors.phone ? "text-red-500" : "text-blue-600"}>
                  {errors.phone || "Enter your Sri Lankan phone number"}
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="registrationNumber" className="flex items-center gap-2 text-blue-700">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Registration Number
                </FieldLabel>
                <Input
                  id="registrationNumber"
                  type="text"
                  placeholder="Your business registration number"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                  required
                  className={`${errors.registrationNumber ? "border-red-500" : "border-blue-200 focus:border-blue-400"} bg-white/80 backdrop-blur-sm`}
                />
                <FieldDescription className={errors.registrationNumber ? "text-red-500" : "text-blue-600"}>
                  {errors.registrationNumber || "Enter your business registration number"}
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="touristLicence" className="flex items-center gap-2 text-blue-700">
                  <Upload className="h-4 w-4 text-blue-600" />
                  Tourist Licence Document
                </FieldLabel>
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      id="touristLicence"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      required
                      className={`${errors.touristLicence ? "border-red-500" : "border-blue-200 focus:border-blue-400"} bg-white/80 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
                    />
                  </div>
                  {formData.touristLicence && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                      <CheckCircle className="h-4 w-4" />
                      <span>Selected: {formData.touristLicence.name}</span>
                    </div>
                  )}
                </div>
                <FieldDescription className={errors.touristLicence ? "text-red-500" : "text-blue-600"}>
                  {errors.touristLicence || "Upload your tourist licence document (PDF or image, max 5MB)"}
                </FieldDescription>
              </Field>

              {errors.submit && (
                <Field>
                  <div className="text-red-500 text-center bg-red-50 p-3 rounded-lg border border-red-200">
                    {errors.submit}
                  </div>
                </Field>
              )}

              <Field className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-br from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ghibli-float"
                >
                  {isSubmitting ? "Submitting Application..." : "Submit Admin Application"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
}
