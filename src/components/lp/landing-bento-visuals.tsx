import EffortlessIntegration from "./effortless-integration-updated"
import SmartSimpleBrilliant from "./smart-simple-brilliant"
import YourWorkInSync from "./your-work-in-sync"

export function ChaosToClarityBentoVisual() {
  return (
    <SmartSimpleBrilliant
      width="100%"
      height="100%"
      theme="light"
      className="scale-50 sm:scale-65 md:scale-75 lg:scale-90"
    />
  )
}

export function ClientTransparencyBentoVisual() {
  return (
    <YourWorkInSync
      width="400"
      height="250"
      theme="light"
      className="scale-60 sm:scale-75 md:scale-90"
    />
  )
}

export function ManualFollowUpBentoVisual() {
  return <EffortlessIntegration width={400} height={250} className="max-w-full max-h-full" />
}

export function TeamworkBentoVisual() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,#FFF4EE_0%,#F7F5F3_72%)]">
      <div className="relative h-[88%] w-[88%] max-w-[380px] overflow-hidden rounded-[28px] border border-[rgba(55,50,47,0.08)] bg-[#FCFBFA] p-4 shadow-[0px_20px_50px_rgba(55,50,47,0.08)]">
        <div className="pointer-events-none absolute inset-x-12 top-0 h-20 bg-[radial-gradient(circle_at_center,rgba(255,85,0,0.12),transparent_70%)] blur-3xl" />

        <div className="relative flex h-full items-center justify-center">
          <div className="absolute inset-x-6 top-6 flex items-center justify-between">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-full border border-[rgba(55,50,47,0.08)] bg-white/90 px-3 py-2 shadow-[0px_8px_20px_rgba(55,50,47,0.05)]"
                style={{
                  transform:
                    index === 0
                      ? "translate(-10px, 0px)"
                      : index === 1
                        ? "translateY(8px)"
                        : "translate(6px, 0px)",
                }}
              >
                <div className="size-7 rounded-full bg-[#FFEFE7] animate-pulse" style={{ animationDuration: "3.6s", animationDelay: `${index * 0.25}s` }} />
                <div className="h-2.5 w-16 rounded-full bg-[linear-gradient(90deg,#F1ECE7_0%,#FFF6F0_50%,#F1ECE7_100%)] animate-pulse" style={{ animationDuration: "3.6s", animationDelay: `${index * 0.18}s` }} />
              </div>
            ))}
          </div>

          <div className="absolute inset-x-8 bottom-8 flex items-center justify-between">
            {[0, 1].map((index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-full border border-[rgba(55,50,47,0.08)] bg-white/90 px-3 py-2 shadow-[0px_8px_20px_rgba(55,50,47,0.05)]"
              >
                <div className="size-7 rounded-full bg-[#FFF1E8] animate-pulse" style={{ animationDuration: "3.8s", animationDelay: `${index * 0.3}s` }} />
                <div className="h-2.5 w-14 rounded-full bg-[linear-gradient(90deg,#F1ECE7_0%,#FFF6F0_50%,#F1ECE7_100%)] animate-pulse" style={{ animationDuration: "3.8s", animationDelay: `${index * 0.16}s` }} />
              </div>
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute size-[220px] rounded-full border border-[rgba(55,50,47,0.08)]" />
            <div className="absolute size-[160px] rounded-full border border-[#FF5500]/16" />
            <div className="absolute size-[112px] rounded-[28px] border border-[rgba(55,50,47,0.08)] bg-white shadow-[0px_18px_40px_rgba(55,50,47,0.10)]" />
            <div className="absolute flex w-[84px] flex-col gap-2">
              <div className="h-2.5 w-2/3 rounded-full bg-[linear-gradient(90deg,#F1ECE7_0%,#FFF6F0_50%,#F1ECE7_100%)] animate-pulse" />
              <div className="h-2 w-full rounded-full bg-[linear-gradient(90deg,#F1ECE7_0%,#FFF6F0_50%,#F1ECE7_100%)] animate-pulse" style={{ animationDelay: "0.18s" }} />
              <div className="flex items-center gap-2 pt-1">
                <div className="size-2 rounded-full bg-[#FF5500] animate-ping" style={{ animationDuration: "2.8s" }} />
                <div className="h-2 w-10 rounded-full bg-[linear-gradient(90deg,#F1ECE7_0%,#FFF6F0_50%,#F1ECE7_100%)] animate-pulse" style={{ animationDelay: "0.24s" }} />
              </div>
            </div>
          </div>

          {[
            "top-[94px] left-[74px]",
            "top-[104px] right-[78px]",
            "bottom-[96px] left-[88px]",
            "bottom-[110px] right-[96px]",
          ].map((position, index) => (
            <div
              key={position}
              className={`absolute ${position} size-3 rounded-full ${
                index % 2 === 0 ? "bg-[#FF5500] animate-pulse" : "bg-[#37322F]/14"
              }`}
              style={{ animationDuration: "5s", animationDelay: `${index * 0.22}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
