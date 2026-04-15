import Logo from '@societiza/components/logo';

export default function FooterSection() {
  return (
    <footer className="w-full border-t border-border">
      <div className="flex w-full flex-col items-center justify-start">
        <div className="w-full max-w-[1060px] border-x border-border px-6 py-8 sm:px-8 md:px-10 md:py-10">
          <div className="grid gap-8 md:grid-cols-[minmax(0,460px)_minmax(0,1fr)] md:items-end">
            <div className="flex max-w-[460px] flex-col gap-4">
              <Logo className="h-8" />
              <p className="text-sm leading-6 text-muted-foreground">
                A Societiza centraliza a operação societária da contabilidade
                para reduzir burocracia, organizar processos e dar mais
                transparência ao cliente.
              </p>
            </div>

            <div className="flex flex-col gap-1 text-sm leading-6 text-muted-foreground md:items-end md:text-right">
              <p>Feito com &lt;3 em Joinville, SC</p>
              <p>
                &copy; {new Date().getFullYear()} Societiza. Todos os direitos
                reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
