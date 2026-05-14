import { useId, useState } from 'react';
import { CircleAlertIcon } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/shadcnui/dialog';
import { Button } from './ui/shadcnui/button';
import { Label } from './ui/shadcnui/label';
import { Input } from './ui/shadcnui/input';
interface DeleteModalProps {
  identifier: string;
  text: string;
  onDelete: () => void;
  onClose: () => void;
  isLoading?: boolean;
  isOpen: boolean;
}

export function DeleteModal({
  identifier,
  text,
  onDelete,
  onClose,
  isOpen,
  isLoading = false,
}: DeleteModalProps) {
  const id = useId();
  const [inputValue, setInputValue] = useState('');

  const handleClose = () => {
    setInputValue(''); // Reset input ao fechar
    onClose();
  };

  const handleDelete = () => {
    if (inputValue === identifier) {
      onDelete();
      setInputValue(''); // Reset input após deletar
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10"
            aria-hidden="true"
          >
            <CircleAlertIcon className="text-destructive" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Confirmação final
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              {text}{' '}
              <span className="font-medium text-foreground">{identifier}</span>.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={id}>
              Digite <span className="font-medium">{identifier}</span> para
              confirmar:
            </Label>
            <Input
              id={id}
              type="text"
              placeholder={`Digite "${identifier}" para confirmar`}
              value={inputValue}
              onChange={(value: string) => setInputValue(value)}
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              className="flex-1"
              disabled={inputValue !== identifier || isLoading}
              onClick={handleDelete}
            >
              {isLoading ? 'Deletando...' : 'Deletar'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
