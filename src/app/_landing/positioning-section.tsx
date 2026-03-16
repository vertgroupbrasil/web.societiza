import { MasterPlan } from '@societiza/components/master-plan';

function SectionTag({ children }: { children: React.ReactNode }) {
  return <div className="w-fit rounded-md border px-4 py-1 text-sm">{children}</div>;
}

export function PositioningSection() {
  return (
    <section className="space-y-8 md:space-y-12">
      {/* Mission statement */}
      <div className="py-20 text-right md:py-28 justify-center flex">
        <div className="ml-auto mt-10 max-w-lg w-full">
          <MasterPlan className="h-auto w-full" />
        </div>
        <div className='justify-center flex flex-col'>

        <h2 className="ml-auto max-w-3xl font-bold text-3xl leading-tight tracking-tight md:text-5xl">
          Estamos mudando a maneira como o Brasil abre empresas.
        </h2>

        <p className="ml-auto mt-6 max-w-2xl text-muted-foreground text-sm leading-relaxed md:text-base">
          A burocracia brasileira não vai desaparecer. Mas a forma de lidar com ela pode evoluir.
          A Societiza nasceu com um objetivo claro: transformar o processo societário em algo
          organizado, transparente e eficiente. Para que contadores possam focar no que realmente
          importa — fazer seus clientes crescerem.
        </p>
        </div>

      </div>
    </section>
  );
}