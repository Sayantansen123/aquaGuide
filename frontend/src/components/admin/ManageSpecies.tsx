import {useState, useEffect} from "react";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Search, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2, X} from "lucide-react";
import AddSpeciesModal from "./AddSpeciesModal";
import {speciesApi} from "@/api/modules/species";
import type {SpeciesItem} from "@/api/apiTypes";
import {toast} from "@/components/ui/use-toast";
import EditSpeciesModal from "./EditSpeciesModal";
import {useDebounce} from "@/hooks/useDebounce";
import CircularLoader from "../ui/CircularLoader";

const ManageSpecies = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedSpecies, setSelectedSpecies] = useState<SpeciesItem | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [waterTypeFilter, setWaterTypeFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [speciesIdToDelete, setSpeciesIdToDelete] = useState<{id: string; name: string} | null>(null);

	// Debounce search query with 500ms delay
	const debouncedSearchQuery = useDebounce(searchQuery, 500);

	// Determine if we should use search or normal fetch
	const shouldSearch = debouncedSearchQuery || waterTypeFilter !== "all" || statusFilter !== "all";

	// Fetch species data with React Query
	const {
		data: speciesData,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["species", currentPage, debouncedSearchQuery, waterTypeFilter, statusFilter],
		queryFn: () => {
			if (shouldSearch) {
				return speciesApi.searchSpecies({
					query: debouncedSearchQuery,
					waterType: waterTypeFilter !== "all" ? waterTypeFilter : undefined,
					status: statusFilter !== "all" ? statusFilter : undefined,
					page: currentPage,
					limit: 20, // Adjust the limit as needed
				});
			} else {
				return speciesApi.getSpeciesManagement(currentPage);
			}
		},
		staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
		gcTime: 10 * 60 * 1000, // Cache for 10 minutes (formerly cacheTime)
	});

	// Reset to page 1 when search/filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearchQuery, waterTypeFilter, statusFilter]);

	// Delete mutation
	const deleteMutation = useMutation({
		mutationFn: (fishId: string) => speciesApi.deleteSpecies(fishId),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ["species"]});
			toast({description: "Species deleted successfully"});
		},
		onError: (error) => {
			toast({description: error?.message || "Failed to delete species"});
		},
	});

	const species = speciesData?.data.species || [];
	const totalPages = speciesData?.data.totalPages || 1;
	const total = speciesData?.data.total || 0;

	const handleAddModalClose = () => {
		setIsAddModalOpen(false);
		queryClient.invalidateQueries({queryKey: ["species"]});
	};

	const handleEditModalClose = () => {
		setIsEditModalOpen(false);
		setSelectedSpecies(null);
		queryClient.invalidateQueries({queryKey: ["species"]});
	};

	const handleEditClick = (spec: SpeciesItem) => {
		setSelectedSpecies(spec);
		setIsEditModalOpen(true);
	};

	const handleDeleteClick = (fishId: string, commonName: string) => {
		setSpeciesIdToDelete({id: fishId, name: commonName});
		setDeleteConfirmOpen(true);
	};

	const confirmDelete = () => {
		if (speciesIdToDelete) {
			deleteMutation.mutate(speciesIdToDelete.id);
			setDeleteConfirmOpen(false);
			setSpeciesIdToDelete(null);
		}
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	const getStatusBadge = (status: SpeciesItem["status"]) => {
		switch (status) {
			case "published":
				return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Published</Badge>;
			case "draft":
				return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Draft</Badge>;
			case "archived":
				return <Badge className="bg-muted text-muted-foreground border-muted">Archived</Badge>;
			default:
				return <Badge>{status}</Badge>;
		}
	};

	const getCareLevelBadge = (level?: string) => {
		if (!level) return <Badge className="bg-muted text-muted-foreground">N/A</Badge>;

		// Convert snake_case to Title Case
		const formattedLevel = level
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

		const colors: Record<string, string> = {
			"Very Easy": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
			Easy: "bg-green-500/20 text-green-400 border-green-500/30",
			Moderate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
			Difficult: "bg-orange-500/20 text-orange-400 border-orange-500/30",
			Expert: "bg-red-500/20 text-red-400 border-red-500/30",
			"Very Difficult": "bg-red-500/20 text-red-400 border-red-500/30",
		};
		return <Badge className={colors[formattedLevel] || "bg-muted text-muted-foreground"}>{formattedLevel}</Badge>;
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {year: "numeric", month: "short", day: "numeric"});
	};

	if (isError) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center space-y-4">
					<p className="text-destructive">Error loading species: {error?.message}</p>
					<Button onClick={() => queryClient.invalidateQueries({queryKey: ["species"]})}>Retry</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header with Add Button */}
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-foreground">Manage Species</h2>
				<Button onClick={() => setIsAddModalOpen(true)} className="bg-primary hover:bg-primary/90">
					<Plus className="w-4 h-4 mr-2" />
					Add New Species
				</Button>
			</div>
			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="Search by name, scientific name, or family..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 bg-card border-border"
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery("")}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
							<X className="w-4 h-4" />
						</button>
					)}
				</div>
				<Select value={waterTypeFilter} onValueChange={setWaterTypeFilter}>
					<SelectTrigger className="w-full sm:w-[180px] bg-card border-border">
						<SelectValue placeholder="Water Type" />
					</SelectTrigger>
					<SelectContent className="bg-card border-border">
						<SelectItem value="all">All Water Types</SelectItem>
						<SelectItem value="freshwater">Freshwater</SelectItem>
						<SelectItem value="marine">Marine</SelectItem>
						<SelectItem value="brackish">Brackish</SelectItem>
					</SelectContent>
				</Select>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-full sm:w-[180px] bg-card border-border">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent className="bg-card border-border">
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="published">Published</SelectItem>
						<SelectItem value="draft">Draft</SelectItem>
						<SelectItem value="archived">Archived</SelectItem>
					</SelectContent>
				</Select>
			</div>
			{/* Loading State */}
			{isLoading ? (
				<CircularLoader />
			) : (
				<>
					{/* Desktop Table View */}
					<div className="hidden md:block rounded-lg border border-border overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow className="bg-muted/50 border-border">
									<TableHead className="text-muted-foreground">Image</TableHead>
									<TableHead className="text-muted-foreground">Species Info</TableHead>
									<TableHead className="text-muted-foreground">Water Type</TableHead>
									<TableHead className="text-muted-foreground">Care Level</TableHead>
									<TableHead className="text-muted-foreground">Status</TableHead>
									<TableHead className="text-muted-foreground">Created</TableHead>
									<TableHead className="text-muted-foreground">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{species.length === 0 ? (
									<TableRow>
										<TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
											No species found matching your filters.
										</TableCell>
									</TableRow>
								) : (
									species.map((spec) => (
										<TableRow key={spec.fish_id} className="border-border hover:bg-muted/30">
											<TableCell>
												<img
													src={spec.primary_image || "https://via.placeholder.com/50?text=No+Image"}
													alt={spec.common_name}
													className="w-12 h-12 rounded-lg object-cover"
													onError={(e) => {
														e.currentTarget.src = "https://via.placeholder.com/50?text=No+Image";
													}}
												/>
											</TableCell>
											<TableCell>
												<div className="space-y-1">
													<p className="font-medium text-foreground">{spec.common_name}</p>
													<p className="text-sm text-muted-foreground italic">{spec.scientific_name}</p>
													<p className="text-xs text-muted-foreground">{spec.family || "N/A"}</p>
												</div>
											</TableCell>
											<TableCell>
												<Badge variant="outline" className="border-primary/50 text-primary capitalize">
													{spec.water_type}
												</Badge>
											</TableCell>
											<TableCell>{getCareLevelBadge(spec.care_level)}</TableCell>
											<TableCell>{getStatusBadge(spec.status as SpeciesItem["status"])}</TableCell>
											<TableCell className="text-muted-foreground">{formatDate(spec.created_at)}</TableCell>
											<TableCell>
												<div className="flex gap-2">
													<Button
														size="sm"
														variant="ghost"
														onClick={() => window.open(`/view/fish/${spec.fish_id}`, "_blank")}
														className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
														<Eye className="w-4 h-4" />
													</Button>
													<Button
														size="sm"
														variant="ghost"
														onClick={() => handleEditClick(spec)}
														className="h-8 w-8 p-0 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10">
														<Pencil className="w-4 h-4" />
													</Button>
													<Button
														size="sm"
														variant="ghost"
														onClick={() => handleDeleteClick(spec.fish_id, spec.common_name)}
														disabled={deleteMutation.isPending}
														className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10">
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>

					{/* Mobile/Tablet Card View */}
					<div className="md:hidden space-y-4">
						{species.length === 0 ? (
							<div className="text-center py-12 text-muted-foreground">No species found matching your filters.</div>
						) : (
							species.map((spec) => (
								<div key={spec.fish_id} className="bg-card border border-border rounded-lg p-4 space-y-4">
									<div className="flex items-start gap-4">
										<img
											src={spec.primary_image || "https://via.placeholder.com/64?text=No+Image"}
											alt={spec.common_name}
											className="w-16 h-16 rounded-lg object-cover"
											onError={(e) => {
												e.currentTarget.src = "https://via.placeholder.com/64?text=No+Image";
											}}
										/>
										<div className="flex-1 space-y-1">
											<p className="font-medium text-foreground">{spec.common_name}</p>
											<p className="text-sm text-muted-foreground italic">{spec.scientific_name}</p>
											<p className="text-xs text-muted-foreground">{spec.family || "N/A"}</p>
										</div>
									</div>
									<div className="flex flex-wrap gap-2">
										<Badge variant="outline" className="border-primary/50 text-primary capitalize">
											{spec.water_type}
										</Badge>
										{getCareLevelBadge(spec.care_level)}
										{getStatusBadge(spec.status as SpeciesItem["status"])}
									</div>
									<div className="flex items-center justify-between pt-2 border-t border-border">
										<span className="text-sm text-muted-foreground">Created: {formatDate(spec.created_at)}</span>
										<div className="flex gap-2">
											<Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
												<Eye className="w-4 h-4" />
											</Button>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => handleEditClick(spec)}
												className="h-8 w-8 p-0 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10">
												<Pencil className="w-4 h-4" />
											</Button>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => handleDeleteClick(spec.fish_id, spec.common_name)}
												disabled={deleteMutation.isPending}
												className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10">
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</>
			)}
			{/* Pagination Controls */}
			{!isLoading && totalPages > 1 && (
				<div className="flex items-center justify-between border-t border-border pt-4">
					<div className="text-sm text-muted-foreground">
						Showing page {currentPage} of {totalPages} ({total} total)
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1 || isLoading}
							className="border-border">
							<ChevronLeft className="w-4 h-4 mr-1" />
							Previous
						</Button>

						{/* page numbers */}
						<div className="hidden sm:flex items-center gap-1">
							{Array.from({length: Math.min(5, totalPages)}, (_, i) => {
								let pageNum;
								if (totalPages <= 5) {
									pageNum = i + 1;
								} else if (currentPage <= 3) {
									pageNum = i + 1;
								} else if (currentPage >= totalPages - 2) {
									pageNum = totalPages - 4 + i;
								} else {
									pageNum = currentPage - 2 + i;
								}

								return (
									<Button
										key={pageNum}
										variant={currentPage === pageNum ? "default" : "outline"}
										size="sm"
										onClick={() => handlePageChange(pageNum)}
										disabled={isLoading}
										className={currentPage === pageNum ? "bg-primary" : "border-border"}>
										{pageNum}
									</Button>
								);
							})}
						</div>

						<Button
							variant="outline"
							size="sm"
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages || isLoading}
							className="border-border">
							Next
							<ChevronRight className="w-4 h-4 ml-1" />
						</Button>
					</div>
				</div>
			)}
			{!isLoading && species.length === 0 && <div className="text-center py-12 text-muted-foreground">No species found matching your filters.</div>}
			<AddSpeciesModal isOpen={isAddModalOpen} onClose={() => handleAddModalClose()} />
			<EditSpeciesModal isOpen={isEditModalOpen} onClose={() => handleEditModalClose()} species={selectedSpecies} />
			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
				<AlertDialogContent className="bg-card border-border">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-foreground">Are you sure?</AlertDialogTitle>
						<AlertDialogDescription className="text-muted-foreground">
							This action cannot be undone. This will permanently delete the species{" "}
							<span className="font-semibold text-foreground">"{speciesIdToDelete?.name}"</span> from the database.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							disabled={deleteMutation.isPending}
							className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
							{deleteMutation.isPending ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>{" "}
		</div>
	);
};

export default ManageSpecies;
