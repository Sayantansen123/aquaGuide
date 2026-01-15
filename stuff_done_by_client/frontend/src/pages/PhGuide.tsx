import React from "react";
import {Info, AlertTriangle, Droplet, CheckCircle} from "lucide-react";

const phRanges = [
	{
		label: "Acidic",
		value: "< 7.0",
		color: "bg-blue-200",
		icon: <Droplet className="text-blue-500" />,
	},
	{
		label: "Neutral",
		value: "≈ 7.0",
		color: "bg-green-200",
		icon: <CheckCircle className="text-green-600" />,
	},
	{
		label: "Alkaline",
		value: "> 7.0",
		color: "bg-yellow-100",
		icon: <AlertTriangle className="text-yellow-600" />,
	},
];

const tips = [
	"Test your aquarium water regularly using a reliable pH test kit.",
	"Make pH adjustments slowly to avoid stressing your fish.",
	"Use natural methods (like driftwood or crushed coral) for gradual pH changes.",
	"Research the preferred pH range for each species in your tank.",
];

const PhGuide = () => (
	<div className="container mx-auto px-4 py-10 min-h-screen">
		{/* Hero Section */}
		<div className="flex flex-col items-center mb-10">
			<img
				src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
				alt="Aquarium"
				className="rounded-2xl shadow-lg w-full max-w-xl mb-6 object-cover h-56"
			/>
			<h1 className="text-4xl font-extrabold mb-2 text-center text-primary">Aquarium pH Guide</h1>
			<p className="text-lg text-muted-foreground text-center max-w-2xl">
				Learn how to maintain the ideal pH for a healthy, thriving aquarium. The right pH keeps your fish happy and your tank balanced.
			</p>
		</div>

		{/* pH Scale Visualization */}
		<div className="flex flex-col items-center mb-10">
			<h2 className="text-2xl font-semibold mb-4 text-center">Understanding the pH Scale</h2>
			<div className="flex flex-row gap-4 w-full max-w-2xl justify-center">
				{phRanges.map((range) => (
					<div
						key={range.label}
						className={`
          flex flex-col items-center rounded-xl px-6 py-5 shadow
          w-1/3
          ${
				range.label === "Acidic"
					? "bg-gradient-to-b from-blue-900/80 to-blue-800/60"
					: range.label === "Neutral"
					? "bg-gradient-to-b from-green-900/80 to-green-800/60"
					: "bg-gradient-to-b from-yellow-900/80 to-yellow-800/60"
			}
        `}>
						<div className="mb-2">
							{range.label === "Acidic" && <Droplet className="text-blue-400 w-7 h-7" />}
							{range.label === "Neutral" && <CheckCircle className="text-green-400 w-7 h-7" />}
							{range.label === "Alkaline" && <AlertTriangle className="text-yellow-400 w-7 h-7" />}
						</div>
						<div className="font-bold text-lg text-white drop-shadow">{range.label}</div>
						<div className="text-md text-slate-200">{range.value}</div>
					</div>
				))}
			</div>
			<div className="mt-4 text-center text-slate-400 max-w-xl">
				<span className="font-semibold text-white">pH</span> measures how acidic or alkaline your aquarium water is. Most freshwater fish thrive in a pH
				range of <span className="font-semibold text-primary">6.5 to 7.5</span>.
			</div>
		</div>

		{/* Info Section */}
		<div className="prose dark:prose-invert max-w-2xl mx-auto mb-10">
			<h3>Why pH Matters</h3>
			<p>pH affects fish health, biological filtration, and the availability of nutrients. Sudden changes can stress or even harm your aquatic life.</p>
			<ul>
				<li>
					<b>Acidic Water:</b> Some tetras, discus, and angelfish prefer slightly acidic water.
				</li>
				<li>
					<b>Neutral Water:</b> Most community fish and plants thrive here.
				</li>
				<li>
					<b>Alkaline Water:</b> African cichlids and livebearers (like guppies) prefer alkaline conditions.
				</li>
			</ul>
		</div>

		{/* Tips Section */}
		<div className="bg-primary/10 rounded-xl p-6 max-w-2xl mx-auto mb-10 shadow">
			<div className="flex items-center mb-3">
				<Info className="text-primary mr-2" />
				<span className="font-semibold text-primary">Tips for Managing pH</span>
			</div>
			<ul className="list-disc pl-6 text-base text-muted-foreground">
				{tips.map((tip, idx) => (
					<li key={idx}>{tip}</li>
				))}
			</ul>
		</div>

		{/* Warning Section */}
		<div className="flex items-center bg-red-100 dark:bg-red-900/30 rounded-lg p-4 max-w-2xl mx-auto shadow">
			<AlertTriangle className="text-red-500 mr-3" />
			<span className="text-red-700 dark:text-red-300">
				<b>Warning:</b> Never make rapid pH changes. Adjust slowly and monitor your fish for signs of stress.
			</span>
		</div>
	</div>
);

export default PhGuide;
