'use client';

import {
  Button,
  Form,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shadcn/index';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

import {
  _partners,
  PartnersData,
  useOpeningForm,
  usePartnersFormValidation,
  BasicPartnerSection,
  AdministratorSection,
  AddressPartnerSection,
} from '@form/index';

export const PartnersDataForm = () => {
  const {
    updateStepData,
    savePartnersData,
    goToPreviousStep,
    isFirstStep,
    processoId,
  } = useOpeningForm();

  const form = useForm<PartnersData>({
    resolver: zodResolver(_partners),
    defaultValues: {
      empresa_id: processoId,
      socios: [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'socios',
  });

  const {
    setShowFieldErrors,
    setValidationAttempts,
    hasArrayFieldError,
    validateForm,
  } = usePartnersFormValidation({ form });

  const addPartner = () => {
    append({
      nome: '',
      nacionalidade: '',
      data_nascimento: '',
      estado_civil: 'solteiro',
      profissao: '',
      cpf: '',
      rg: '',
      orgao_expedidor: '',
      uf: '',
      administrador: false,
      qtd_cotas: 0,
      endereco: {
        cep: '',
        rua: '',
        numero: 0,
        bairro: '',
        complemento: '',
        municipio: '',
        uf: '',
      },
    });
  };

  const removePartner = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.error('É necessário ter pelo menos um sócio');
    }
  };

  const handleNext = async () => {
    setValidationAttempts((prev) => prev + 1);

    try {
      const currentValues = form.getValues();
      updateStepData({ partnersData: currentValues });

      if (!currentValues.socios || currentValues.socios.length === 0) {
        setShowFieldErrors(true);
        toast.error('É necessário ter pelo menos um sócio');
        return;
      }

      const validation = await validateForm();
      if (!validation.isValid) {
        setShowFieldErrors(true);
        toast.error('Há campos com erros. Verifique e tente novamente.');
        return;
      }

      setShowFieldErrors(false);
      toast.success('Dados dos sócios validados com sucesso!');
      await savePartnersData(currentValues);
    } catch (error) {
      console.error('Erro na validação:', error);
      toast.error('Erro inesperado. Tente novamente.');
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-8">

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Dados dos Sócios</h2>
          <Button type="button" variant={'ghost'} onClick={addPartner}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Sócio
          </Button>
        </div>

        {fields.map((field, index) => (
          <Card key={field.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Sócio {index + 1}</CardTitle>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removePartner(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <BasicPartnerSection
                form={form}
                hasArrayFieldError={hasArrayFieldError}
                partnerIndex={index}
              />

              <AdministratorSection
                form={form}
                hasArrayFieldError={hasArrayFieldError}
                partnerIndex={index}
              />

              <AddressPartnerSection
                form={form}
                hasArrayFieldError={hasArrayFieldError}
                partnerIndex={index}
              />
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goToPreviousStep}
            disabled={isFirstStep}
          >
            Anterior
          </Button>

          <Button type="button" onClick={handleNext}>
            Próximo
          </Button>
        </div>
      </div>
    </Form>
  );
};