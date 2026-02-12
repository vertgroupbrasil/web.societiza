import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@shadcn/index';
import { UseFormReturn } from 'react-hook-form';
import { CompanyData, maskCEP, useCepLookup } from '@form/index';
import { Loader2, MapPin, AlertCircle } from 'lucide-react';

interface CepFieldProps {
  form: UseFormReturn<CompanyData>;
  hasError?: boolean;
  onAddressUpdate?: () => void;
}

export const CepField = ({ form, hasError, onAddressUpdate }: CepFieldProps) => {
  const { isSearching, isError, isCepValid } = useCepLookup({ 
    form, 
    onAddressUpdate 
  });

  return (
    <FormField
      control={form.control}
      name="endereco.cep"
      render={({ field }) => (
        <FormItem>
          <FormLabel>CEP *</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                placeholder="00000-000"
                value={maskCEP(field.value || '')}
                onChange={(value: string) => {
                  const cleanValue = value.replace(/\D/g, '');
                  field.onChange(cleanValue);
                }}
                className={`${
                  hasError
                    ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500'
                    : isError
                    ? 'border-orange-500 bg-orange-50'
                    : isCepValid && !isSearching
                    ? 'border-green-500 bg-green-50'
                    : ''
                } pr-10`}
              />
              
              {/* Ícone de status */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {isSearching && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                )}
                {!isSearching && isCepValid && !isError && (
                  <MapPin className="h-4 w-4 text-green-500" />
                )}
                {isError && (
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                )}
              </div>
            </div>
          </FormControl>
          
          {/* Mensagens de status */}
          {isSearching && (
            <p className="text-sm text-blue-600">Buscando endereço...</p>
          )}
          {isError && (
            <p className="text-sm text-orange-600">CEP não encontrado</p>
          )}
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
};