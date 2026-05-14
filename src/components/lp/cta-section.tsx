"use client"

export default function CTASection() {
  return (
    <div id="interesse" className="w-full relative overflow-hidden flex flex-col justify-center items-center gap-2 scroll-mt-28">
      {/* Content */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-12 border-y border-border flex justify-center items-center gap-6 relative z-10">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="w-full h-full relative">
            {Array.from({ length: 300 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-4 w-full rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-border/70 outline-offset-[-0.25px]"
                style={{
                  top: `${i * 16 - 120}px`,
                  left: "-100%",
                  width: "300%",
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-[586px] px-6 py-5 md:py-8 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-6 relative z-20">
          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <div className="self-stretch text-center flex justify-center flex-col text-foreground text-3xl md:text-5xl font-semibold leading-tight md:leading-[56px] font-sans tracking-tight">
              Pronto para transformar sua operação societária?
            </div>
            <div className="self-stretch text-center text-muted-foreground text-base leading-7 font-sans font-medium">
Centralize seus processos, reduza a burocracia da rotina e entregue ao cliente a clareza que sua contabilidade sempre quis oferecer.
            </div>
          </div>
          <div className="w-full max-w-[497px] flex flex-col justify-center items-center gap-12">
            <div className="flex justify-start items-center gap-4">
              <a
                href="https://forms.gle/Psgqo5uy2MXtwU1n8"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-12 py-[6px] relative bg-primary shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#e84e00] transition-colors"
              >
                <div className="w-44 h-[41px] absolute left-0 top-0 bg-gradient-to-b mix-blend-multiply"></div>
                <div className="flex flex-col justify-center text-primary-foreground text-[13px] font-medium leading-5 font-sans">
                  Quero acesso antecipado
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
