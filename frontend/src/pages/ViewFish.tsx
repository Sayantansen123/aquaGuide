import {useParams, useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {ArrowLeft, Fish, Thermometer, Droplets, Ruler, MapPin, Heart, Utensils, Users, Eye, Leaf, Loader2} from "lucide-react";
import {speciesApi} from "@/api/modules/species";

const ViewFish = () => {
	const {id} = useParams();
	const navigate = useNavigate();

	console.log("Fetching fish with ID:", id);

	const {data, isLoading, isError} = useQuery({
		queryKey: ["fish", id],
		queryFn: async () => {
			return await speciesApi.getSpeciesById(id!);
		},
		enabled: !!id,
		select: (res) => res.data,
	});

	const fish = data?.species;

	const InfoItem = ({icon: Icon, label, value}: {icon: React.ComponentType<{className?: string}>; label: string; value: string}) => (
		<div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
			<Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
			<div>
				<p className="text-sm text-muted-foreground">{label}</p>
				<p className="font-medium text-foreground">{value}</p>
			</div>
		</div>
	);

	const Section = ({icon: Icon, title, content}: {icon: React.ComponentType<{className?: string}>; title: string; content: string}) => (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-lg">
					<Icon className="h-5 w-5 text-primary" />
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground leading-relaxed">{content}</p>
			</CardContent>
		</Card>
	);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Loader2 className="w-10 h-10 animate-spin text-primary" />
			</div>
		);
	}

	if (isError || !fish) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<p className="text-destructive mb-4">Error loading fish data.</p>
				<Button onClick={() => navigate(-1)}>Go Back</Button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				{/* Back Button */}
				<Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
					<ArrowLeft className="h-4 w-4" />
					Back
				</Button>

				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-2">
						<Fish className="h-8 w-8 text-primary" />
						<h1 className="text-3xl md:text-4xl font-bold text-foreground">{fish.common_name}</h1>
					</div>
					<p className="text-lg text-muted-foreground italic">{fish.scientific_name}</p>
					<Badge variant="secondary" className="mt-2">
						{fish.care_level} Care
					</Badge>
				</div>

				{/* Basic Info Grid */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="text-xl">Basic Information</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							<InfoItem icon={Fish} label="Scientific Name" value={fish.scientific_name} />
							<InfoItem icon={Users} label="Family" value={fish.family || "N/A"} />
							<InfoItem icon={MapPin} label="Origin" value={fish.origin || "N/A"} />
							<InfoItem icon={Droplets} label="Water Type" value={fish.water_type} />
							<InfoItem icon={Ruler} label="Max Size" value={fish.max_size_cm ? `${fish.max_size_cm} cm` : "N/A"} />
							<InfoItem icon={Thermometer} label="Min Temp" value={fish.min_temp ? `${fish.min_temp}°C` : "N/A"} />
							<InfoItem icon={Thermometer} label="Max Temp" value={fish.max_temp ? `${fish.max_temp}°C` : "N/A"} />
							<InfoItem icon={Droplets} label="Min pH" value={fish.min_ph ? `${fish.min_ph}` : "N/A"} />
							<InfoItem icon={Droplets} label="Max pH" value={fish.max_ph ? `${fish.max_ph}` : "N/A"} />
							<InfoItem icon={Droplets} label="Min Hardness" value={fish.min_hardness ? `${fish.min_hardness}` : "N/A"} />
							<InfoItem icon={Droplets} label="Max Hardness" value={fish.max_hardness ? `${fish.max_hardness}` : "N/A"} />
							<InfoItem icon={Utensils} label="Diet Type" value={fish.diet_type || "N/A"} />
							<InfoItem icon={Users} label="Temperament" value={fish.temperament || "N/A"} />
						</div>
					</CardContent>
				</Card>

				{/* Detailed Sections */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Section icon={Eye} title="Overview" content={fish.description || ""} />
					<Section icon={Utensils} title="Care and Feeding" content={fish.diet_info || ""} />
					<Section icon={Heart} title="Breeding" content={fish.breeding_notes || ""} />
				</div>

				{/* Back to Home Button */}
				<div className="mt-8 flex justify-center">
					<Button onClick={() => navigate("/")} className="gap-2">
						<ArrowLeft className="h-4 w-4" />
						Back to Home
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ViewFish;
