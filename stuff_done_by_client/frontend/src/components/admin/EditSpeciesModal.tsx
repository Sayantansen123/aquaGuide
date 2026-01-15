import {useState, useEffect} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {SpeciesFormData, SpeciesItem} from "@/api/apiTypes";
import {speciesApi} from "@/api/modules/species";
import {Link as LinkIcon, X} from "lucide-react";

interface EditSpeciesModalProps {
	isOpen: boolean;
	onClose: () => void;
	species: SpeciesItem | null;
}

const EditSpeciesModal = ({isOpen, onClose, species}: EditSpeciesModalProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		commonName: "",
		scientificName: "",
		family: "",
		origin: "",
		waterType: "",
		minTemp: "",
		maxTemp: "",
		minPh: "",
		maxPh: "",
		minHardness: "",
		maxHardness: "",
		dietType: "",
		careLevel: "",
		temperament: "",
		maxSize: "",
		minTankSize: "",
		dietInfo: "",
		description: "",
		imageUrl: "",
		breedingDifficulty: "",
		breedingNotes: "",
		status: "draft",
	});

	// Populate form when species data changes
	useEffect(() => {
		if (species) {
			setFormData({
				commonName: species.common_name || "",
				scientificName: species.scientific_name || "",
				family: species.family || "",
				origin: species.origin || "",
				waterType: species.water_type || "",
				minTemp: species.min_temp?.toString() || "",
				maxTemp: species.max_temp?.toString() || "",
				minPh: species.min_ph?.toString() || "",
				maxPh: species.max_ph?.toString() || "",
				minHardness: species.min_hardness?.toString() || "",
				maxHardness: species.max_hardness?.toString() || "",
				dietType: species.diet_type || "",
				careLevel: species.care_level?.replace(/_/g, "-") || "", // Convert underscores to hyphens
				temperament: species.temperament?.replace(/_/g, "-") || "",
				maxSize: species.max_size_cm?.toString() || "",
				minTankSize: species.min_tank_size_liters?.toString() || "",
				dietInfo: species.diet_info || "",
				description: species.description || "",
				imageUrl: species.primary_image || "",
				breedingDifficulty: species.breeding_difficulty?.replace(/_/g, "-") || "",
				breedingNotes: species.breeding_notes || "",
				status: species.status || "draft",
			});
		}
	}, [species]);

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({...prev, [field]: value}));
	};

	const handleSubmit = async () => {
		if (!species) return;

		try {
			setIsLoading(true);
			setError(null);

			// Validate required fields
			if (!formData.commonName || !formData.scientificName || !formData.waterType || !formData.description) {
				setError("Please fill in all required fields (Common Name, Scientific Name, Water Type, and Description)");
				setIsLoading(false);
				return;
			}

			// Transform camelCase to snake_case for backend
			const speciesData: SpeciesFormData = {
				common_name: formData.commonName,
				scientific_name: formData.scientificName,
				family: formData.family || undefined,
				origin: formData.origin || undefined,
				water_type: formData.waterType,
				min_temp: formData.minTemp ? parseFloat(formData.minTemp) : undefined,
				max_temp: formData.maxTemp ? parseFloat(formData.maxTemp) : undefined,
				min_ph: formData.minPh ? parseFloat(formData.minPh) : undefined,
				max_ph: formData.maxPh ? parseFloat(formData.maxPh) : undefined,
				min_hardness: formData.minHardness ? parseFloat(formData.minHardness) : undefined,
				max_hardness: formData.maxHardness ? parseFloat(formData.maxHardness) : undefined,
				diet_type: formData.dietType || undefined,
				care_level: formData.careLevel ? formData.careLevel.replace(/-/g, "_") : undefined,
				temperament: formData.temperament ? formData.temperament.replace(/-/g, "_") : undefined,
				max_size_cm: formData.maxSize ? parseFloat(formData.maxSize) : undefined,
				min_tank_size_liters: formData.minTankSize ? parseFloat(formData.minTankSize) : undefined,
				diet_info: formData.dietInfo || undefined,
				description: formData.description,
				primary_image: formData.imageUrl || undefined,
				breeding_difficulty: formData.breedingDifficulty ? formData.breedingDifficulty.replace(/-/g, "_") : undefined,
				breeding_notes: formData.breedingNotes || undefined,
				status: formData.status,
			};

			const response = await speciesApi.updateSpecies(species.fish_id, speciesData);

			console.log("Species updated successfully:", response.data);

			toast.success(`Species "${formData.commonName}" updated successfully!`);
			onClose();
		} catch (err) {
			console.error("Error updating species:", err);
			const errorMessage = err.response?.data?.error || err.message || "Failed to update species";
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-card border-border">
				<DialogHeader className="p-6 pb-0">
					<DialogTitle className="text-2xl font-bold text-foreground">Edit Species</DialogTitle>
				</DialogHeader>

				<ScrollArea className="max-h-[calc(90vh-120px)] px-6">
					<div className="space-y-6 pb-6">
						{/* Error Display */}
						{error && (
							<div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
								<p className="text-sm font-medium">{error}</p>
							</div>
						)}

						{/* Basic Information */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
								<span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">1</span>
								Basic Information
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="commonName">Common Name *</Label>
									<Input
										id="commonName"
										placeholder="e.g., Clownfish"
										value={formData.commonName}
										onChange={(e) => handleInputChange("commonName", e.target.value)}
										className="bg-background border-border"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="scientificName">Scientific Name *</Label>
									<Input
										id="scientificName"
										placeholder="e.g., Amphiprion ocellaris"
										value={formData.scientificName}
										onChange={(e) => handleInputChange("scientificName", e.target.value)}
										className="bg-background border-border"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="family">Family</Label>
									<Input
										id="family"
										placeholder="e.g., Pomacentridae"
										value={formData.family}
										onChange={(e) => handleInputChange("family", e.target.value)}
										className="bg-background border-border"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="origin">Origin</Label>
									<Input
										id="origin"
										placeholder="e.g., Indo-Pacific"
										value={formData.origin}
										onChange={(e) => handleInputChange("origin", e.target.value)}
										className="bg-background border-border"
									/>
								</div>
							</div>
						</div>

						<Separator className="bg-border" />

						{/* Water Parameters */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
								<span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">2</span>
								Water Parameters
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								<div className="space-y-2 sm:col-span-2 lg:col-span-3">
									<Label>Water Type *</Label>
									<Select value={formData.waterType} onValueChange={(v) => handleInputChange("waterType", v)}>
										<SelectTrigger className="bg-background border-border">
											<SelectValue placeholder="Select water type" />
										</SelectTrigger>
										<SelectContent className="bg-card border-border">
											<SelectItem value="freshwater">Freshwater</SelectItem>
											<SelectItem value="marine">Marine</SelectItem>
											<SelectItem value="brackish">Brackish</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="minTemp">Min Temperature (°C)</Label>
									<Input
										id="minTemp"
										type="number"
										placeholder="e.g., 24"
										value={formData.minTemp}
										onChange={(e) => handleInputChange("minTemp", e.target.value)}
										className="bg-background border-border"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="maxTemp">Max Temperature (°C)</Label>
									<Input
										id="maxTemp"
										type="number"
										placeholder="e.g., 28"
										value={formData.maxTemp}
										onChange={(e) => handleInputChange("maxTemp", e.target.value)}
										className="bg-background border-border"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="minPh">Min pH</Label>
									<Input
										id="minPh"
										type="number"
										step="0.1"
										placeholder="e.g., 7.0"
										value={formData.minPh}
										onChange={(e) => handleInputChange("minPh", e.target.value)}
										className="bg-background border-border"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="maxPh">Max pH</Label>
									<Input
										id="maxPh"
										type="number"
										step="0.1"
										placeholder="e.g., 8.4"
										value={formData.maxPh}
										onChange={(e) => handleInputChange("maxPh", e.target.value)}
										className="bg-background border-border"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="minHardness">Min Hardness (dGH)</Label>
									<Input
										id="minHardness"
										type="number"
										placeholder="e.g., 8"
										value={formData.minHardness}
										onChange={(e) => handleInputChange("minHardness", e.target.value)}
										className="bg-background border-border"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="maxHardness">Max Hardness (dGH)</Label>
									<Input
										id="maxHardness"
										type="number"
										placeholder="e.g., 12"
										value={formData.maxHardness}
										onChange={(e) => handleInputChange("maxHardness", e.target.value)}
										className="bg-background border-border"
									/>
								</div>
							</div>
						</div>

						<Separator className="bg-border" />

						{/* Care Information */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
								<span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">3</span>
								Care Information
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								<div className="space-y-2">
									<Label>Diet Type</Label>
									<Select value={formData.dietType} onValueChange={(v) => handleInputChange("dietType", v)}>
										<SelectTrigger className="bg-background border-border">
											<SelectValue placeholder="Select diet type" />
										</SelectTrigger>
										<SelectContent className="bg-card border-border">
											<SelectItem value="herbivore">Herbivore</SelectItem>
											<SelectItem value="carnivore">Carnivore</SelectItem>
											<SelectItem value="omnivore">Omnivore</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label>Care Level</Label>
									<Select value={formData.careLevel} onValueChange={(v) => handleInputChange("careLevel", v)}>
										<SelectTrigger className="bg-background border-border">
											<SelectValue placeholder="Select care level" />
										</SelectTrigger>
										<SelectContent className="bg-card border-border">
											<SelectItem value="very-easy">Very Easy</SelectItem>
											<SelectItem value="easy">Easy</SelectItem>
											<SelectItem value="moderate">Moderate</SelectItem>
											<SelectItem value="difficult">Difficult</SelectItem>
											<SelectItem value="expert">Expert</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label>Temperament</Label>
									<Select value={formData.temperament} onValueChange={(v) => handleInputChange("temperament", v)}>
										<SelectTrigger className="bg-background border-border">
											<SelectValue placeholder="Select temperament" />
										</SelectTrigger>
										<SelectContent className="bg-card border-border">
											<SelectItem value="peaceful">Peaceful</SelectItem>
											<SelectItem value="semi-aggressive">Semi-Aggressive</SelectItem>
											<SelectItem value="aggressive">Aggressive</SelectItem>
											<SelectItem value="territorial">Territorial</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="maxSize">Max Size (cm)</Label>
									<Input
										id="maxSize"
										type="number"
										placeholder="e.g., 11"
										value={formData.maxSize}
										onChange={(e) => handleInputChange("maxSize", e.target.value)}
										className="bg-background border-border"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="minTankSize">Min Tank Size (Liters)</Label>
									<Input
										id="minTankSize"
										type="number"
										placeholder="e.g., 100"
										value={formData.minTankSize}
										onChange={(e) => handleInputChange("minTankSize", e.target.value)}
										className="bg-background border-border"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="dietInfo">Diet Information</Label>
								<Textarea
									id="dietInfo"
									placeholder="Describe the dietary requirements..."
									value={formData.dietInfo}
									onChange={(e) => handleInputChange("dietInfo", e.target.value)}
									className="bg-background border-border min-h-[80px]"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="description">Description *</Label>
								<Textarea
									id="description"
									placeholder="General description of the species..."
									value={formData.description}
									onChange={(e) => handleInputChange("description", e.target.value)}
									className="bg-background border-border min-h-[100px]"
								/>
							</div>
						</div>

						<Separator className="bg-border" />

						{/* Media */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
								<span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">4</span>
								Media
							</h3>
							<div className="space-y-2">
								<Label htmlFor="imageUrl">Image URL</Label>
								<div className="relative">
									<LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
									<Input
										id="imageUrl"
										type="url"
										placeholder="https://example.com/image.webp"
										value={formData.imageUrl}
										onChange={(e) => handleInputChange("imageUrl", e.target.value)}
										className="bg-background border-border pl-10"
									/>
								</div>
								{formData.imageUrl && (
									<div className="relative inline-block mt-2 border border-border rounded-lg p-2">
										<img
											src={formData.imageUrl}
											alt="Preview"
											className="max-h-40 rounded object-cover"
											onError={(e) => {
												e.currentTarget.src =
													"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='160'%3E%3Crect fill='%23ddd' width='200' height='160'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EInvalid URL%3C/text%3E%3C/svg%3E";
											}}
										/>
										<button
											onClick={() => handleInputChange("imageUrl", "")}
											type="button"
											className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90">
											<X className="w-4 h-4" />
										</button>
									</div>
								)}
							</div>
						</div>

						<Separator className="bg-border" />

						{/* Breeding Information */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
								<span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">5</span>
								Breeding Information
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Breeding Difficulty</Label>
									<Select value={formData.breedingDifficulty} onValueChange={(v) => handleInputChange("breedingDifficulty", v)}>
										<SelectTrigger className="bg-background border-border">
											<SelectValue placeholder="Select difficulty" />
										</SelectTrigger>
										<SelectContent className="bg-card border-border">
											<SelectItem value="very-easy">Very Easy</SelectItem>
											<SelectItem value="easy">Easy</SelectItem>
											<SelectItem value="moderate">Moderate</SelectItem>
											<SelectItem value="difficult">Difficult</SelectItem>
											<SelectItem value="very-difficult">Very Difficult</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="breedingNotes">Breeding Notes</Label>
								<Textarea
									id="breedingNotes"
									placeholder="Notes about breeding this species..."
									value={formData.breedingNotes}
									onChange={(e) => handleInputChange("breedingNotes", e.target.value)}
									className="bg-background border-border min-h-[80px]"
								/>
							</div>
						</div>

						<Separator className="bg-border" />

						{/* Publication Status */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
								<span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">6</span>
								Publication Status
							</h3>
							<div className="space-y-2">
								<Label>Status</Label>
								<Select value={formData.status} onValueChange={(v) => handleInputChange("status", v)}>
									<SelectTrigger className="bg-background border-border w-full sm:w-[200px]">
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent className="bg-card border-border">
										<SelectItem value="published">Published</SelectItem>
										<SelectItem value="draft">Draft</SelectItem>
										<SelectItem value="archived">Archived</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
				</ScrollArea>

				{/* Footer Actions */}
				<div className="flex flex-col sm:flex-row gap-3 p-6 pt-4 border-t border-border">
					<Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none" disabled={isLoading}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} className="flex-1 sm:flex-none bg-primary hover:bg-primary/90" disabled={isLoading}>
						{isLoading ? "Updating..." : "Update Species"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default EditSpeciesModal;
