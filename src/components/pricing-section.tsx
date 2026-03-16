import { Button } from "@societiza/components/ui/button";
import { CheckIcon } from "lucide-react";
import { OnlineFriends } from "@societiza/components/online-friends";

type PricingPlan = {
	name: string;
	price: string;
	priceLabel?: string;
	audience: string;
	description: string;
	href?: string;
	includesTitle: string;
	includes: string[];
	limitsTitle: string;
	limits: string[];
	ctaLabel: string;
	isPopular?: boolean;
};

const pricingPlans: PricingPlan[] = [
	{
		name: "Salinha",
		price: "Grátis",
		priceLabel: "para sempre",
		audience: "Para contadores independentes e pequenos volumes de processos",
		description: "Organize e profissionalize sua gestão societária sem nenhum custo.",
		includesTitle: "Inclui",
		includes: [
			"Workflow societário customizável",
			"Notificação ao cliente",
			"Notificação inteligente ao contador",
			"Limite de 3 processos",
			"1 usuário",
		],
		limitsTitle: "Limites",
		limits: ["1 usuário", "até 3 processos ativos"],
		ctaLabel: "Comece agora",
		href: "#",
	},
	{
		name: "Escritório",
		isPopular: true,
		href: "#",
		price: "R$ 109,90",
		priceLabel: "por mês",
		audience: "Para contabilidades que lidam com alto volume de processos",
		description: "Tudo do plano Salinha, preparado para equipes e maior escala de operação.",
		includesTitle: "Tudo do Salinha, mais",
		includes: [
			"Colaboração entre usuários",
			"Gestão centralizada do escritório",
			"Fluxos organizados para múltiplos clientes",
			"Processos ilimitados",
		],
		limitsTitle: "Limites",
		limits: ["até 3 usuários", "processos ilimitados"],
		ctaLabel: "Teste gratuitamente",
	},
];

export function PricingSection() {
	return (
		<section className="mx-auto w-full max-w-7xl py-4">
			<div className="relative">
				<div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
					<div className="flex flex-col bg-background p-8 md:col-span-2">
						<p className="mb-6 text-muted-foreground text-sm uppercase tracking-wider">
							Planos
						</p>
						<h1 className="font-bold text-3xl leading-tight md:text-5xl">
							Planos para quem vive de societário
						</h1>
						<p className="mt-4 text-muted-foreground text-sm md:text-base">
							Da organização do contador independente à escala de escritórios contábeis.
						</p>
						<OnlineFriends className="mt-6 w-full max-w-xs" />
					</div>

					{pricingPlans.map((plan) => (
						<PricingCard key={plan.name} plan={plan} />
					))}
				</div>
			</div>
		</section>
	);
}

function PricingCard({ plan }: { plan: PricingPlan }) {
	return (
		<div className="flex flex-col bg-background *:px-4 *:py-6">
			<div className="border-b">
				<p className="mb-4 text-muted-foreground text-sm uppercase tracking-wider">
					{plan.name}
				</p>
				<div className="mb-1 flex items-baseline gap-2">
					<span className="font-bold text-4xl text-foreground">{plan.price}</span>
				</div>
				{plan.priceLabel && (
					<p className="mb-4 text-muted-foreground text-xs">{plan.priceLabel}</p>
				)}
				<p className="mb-2 text-foreground text-sm font-medium leading-relaxed">
					{plan.audience}
				</p>
				<p className="mb-6 text-muted-foreground text-sm leading-relaxed">
					{plan.description}
				</p>

				<Button
					asChild
					className="w-full"
					variant={plan.isPopular ? "default" : "outline"}
				>
					<a href={plan.href}>{plan.ctaLabel}</a>
				</Button>
			</div>

			<div className="space-y-3 text-muted-foreground text-sm">
				<p className="mb-4 text-xs uppercase">{plan.includesTitle}</p>

				{plan.includes.map((feature) => (
					<p
						className="flex items-center gap-2 text-foreground/80"
						key={feature}
					>
						<CheckIcon className="size-4" />
						{feature}
					</p>
				))}

				<p className="mb-2 mt-6 text-xs uppercase">{plan.limitsTitle}</p>

				{plan.limits.map((feature) => (
					<p
						className="flex items-center gap-2 text-foreground/80"
						key={feature}
					>
						<span className="text-muted-foreground">•</span>
						{feature}
					</p>
				))}
			</div>
		</div>
	);
}
