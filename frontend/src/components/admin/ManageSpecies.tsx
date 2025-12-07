import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import AddSpeciesModal from "./AddSpeciesModal";

interface Species {
  id: number;
  image: string;
  commonName: string;
  scientificName: string;
  family: string;
  waterType: string;
  careLevel: string;
  status: "published" | "draft" | "archived";
  createdAt: string;
}

const mockSpecies: Species[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=100&h=100&fit=crop",
    commonName: "Clownfish",
    scientificName: "Amphiprion ocellaris",
    family: "Pomacentridae",
    waterType: "Marine",
    careLevel: "Easy",
    status: "published",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=100&h=100&fit=crop",
    commonName: "Betta Fish",
    scientificName: "Betta splendens",
    family: "Osphronemidae",
    waterType: "Freshwater",
    careLevel: "Easy",
    status: "published",
    createdAt: "2024-01-12",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=100&h=100&fit=crop",
    commonName: "Neon Tetra",
    scientificName: "Paracheirodon innesi",
    family: "Characidae",
    waterType: "Freshwater",
    careLevel: "Very Easy",
    status: "draft",
    createdAt: "2024-01-10",
  },
];

const ManageSpecies = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [waterTypeFilter, setWaterTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredSpecies = mockSpecies.filter((species) => {
    const matchesSearch =
      species.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      species.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWaterType =
      waterTypeFilter === "all" ||
      species.waterType.toLowerCase() === waterTypeFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "all" || species.status === statusFilter;
    return matchesSearch && matchesWaterType && matchesStatus;
  });

  const getStatusBadge = (status: Species["status"]) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Published
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Draft
          </Badge>
        );
      case "archived":
        return (
          <Badge className="bg-muted text-muted-foreground border-muted">
            Archived
          </Badge>
        );
    }
  };

  const getCareLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      "Very Easy": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      Easy: "bg-green-500/20 text-green-400 border-green-500/30",
      Moderate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      Difficult: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "Very Difficult": "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return (
      <Badge className={colors[level] || "bg-muted text-muted-foreground"}>
        {level}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Manage Species</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Species
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
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

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 border-border">
              <TableHead className="text-muted-foreground">Image</TableHead>
              <TableHead className="text-muted-foreground">
                Species Info
              </TableHead>
              <TableHead className="text-muted-foreground">
                Water Type
              </TableHead>
              <TableHead className="text-muted-foreground">
                Care Level
              </TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Created</TableHead>
              <TableHead className="text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSpecies.map((species) => (
              <TableRow
                key={species.id}
                className="border-border hover:bg-muted/30"
              >
                <TableCell>
                  <img
                    src={species.image}
                    alt={species.commonName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {species.commonName}
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      {species.scientificName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {species.family}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="border-primary/50 text-primary"
                  >
                    {species.waterType}
                  </Badge>
                </TableCell>
                <TableCell>{getCareLevelBadge(species.careLevel)}</TableCell>
                <TableCell>{getStatusBadge(species.status)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {species.createdAt}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="md:hidden space-y-4">
        {filteredSpecies.map((species) => (
          <div
            key={species.id}
            className="bg-card border border-border rounded-lg p-4 space-y-4"
          >
            <div className="flex items-start gap-4">
              <img
                src={species.image}
                alt={species.commonName}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1 space-y-1">
                <p className="font-medium text-foreground">
                  {species.commonName}
                </p>
                <p className="text-sm text-muted-foreground italic">
                  {species.scientificName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {species.family}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="border-primary/50 text-primary"
              >
                {species.waterType}
              </Badge>
              {getCareLevelBadge(species.careLevel)}
              {getStatusBadge(species.status)}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm text-muted-foreground">
                Created: {species.createdAt}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSpecies.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No species found matching your filters.
        </div>
      )}

      <AddSpeciesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ManageSpecies;
