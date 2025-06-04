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

export default function DeleteModal({
  identifier,
  text,
  onDelete,
  onClose,
  isOpen,
}: DeleteModalProps) {
  const id = useId();
  const [inputValue, setInputValue] = useState('');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Confirmação final
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              {text} <span className="text-primary">{identifier}</span>.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            onDelete();
          }}
        >
          <div className="*:not-first:mt-2">
            <Label htmlFor={id}>Digite o que se pede:</Label>
            <Input
              id={id}
              type="text"
              placeholder={`Digite ${identifier} para confirmar`}
              value={inputValue}
              onChange={(value: string) => setInputValue(value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              className="flex-1"
              disabled={inputValue !== identifier}
              onClick={onDelete}
            >
              Deletar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
