import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import JoditEditor from "jodit-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  Pencil,
  Check,
  X,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useTextGuide } from "@/hooks/useTextGuide";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { textApi } from "@/api/modules/text";
import { toast } from "sonner";
import { QuestionItem, TextGuide } from "@/api/apiTypes";
import { useNavigate } from "react-router-dom";
import CircularLoader from "../ui/CircularLoader";
import { useFaq } from "@/hooks/useFaq";
import { faqApi } from "@/api/modules/faq";

interface TextGuides {
  id: string;
  name: string;
  author: string;
  status: "pending" | "approved" | "rejected";
  submittedOn: string;
}

const ManageFaq = () => {
  const [selectedGuides, setSelectedGuides] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useFaq(page);
  const totalPages = data?.pagination?.totalPages || 1;

  const queryClient = useQueryClient();
  const [answer, setAnswer] = useState("");

  const textGuidesArray: QuestionItem[] = data?.questions || [];
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/faq`);
  };

  const createFaqMutation = useMutation({
    mutationFn: faqApi.createFaq,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("Faq created successfully");
      setQuestion("");
      setAnswer("");
    },
    onError: () => {
      toast.error("Failed to create faq");
    },
  });

  const deleteFaqMutation = useMutation({
    mutationFn: faqApi.deleteFaq,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("Faq deleted successfully");
      setQuestion("");
      setAnswer("");
    },
    onError: () => {
      toast.error("Failed to delete faq");
    },
  });

  const handleCreate = () => {
    if (!question.trim() || !answer.trim()) {
      toast.error("Please give content or title");
      return;
    }
    createFaqMutation.mutate({
      question: question,
      answers: answer,
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGuides(textGuidesArray.map((g) => g.id));
    } else {
      setSelectedGuides([]);
    }
  };

  const handleSelectGuide = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedGuides([...selectedGuides, id]);
    } else {
      setSelectedGuides(selectedGuides.filter((gid) => gid !== id));
    }
  };

  const handleBulkAction = (action: "delete") => {
    if (action === "delete") {
      deleteFaqMutation.mutate({ ids: selectedGuides });
    }
    setSelectedGuides([]);
  };

  if (isError)
    return (
      <div className="text-red-600">
        Failed to load guides. Please try again later.
      </div>
    );
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
        Manage Faq
      </h1>

      {/* Create Guide Form */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Create New Faq</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guide-question">Faq Question</Label>
            <Input
              id="guide-question"
              placeholder="Enter guide question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guide-content">Faq Answer</Label>
            <Textarea
              id="faq-answer"
              placeholder="Enter guide question..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
          </div>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            Post Faq
          </Button>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedGuides.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg border border-border">
          <span className="text-sm text-muted-foreground self-center mr-2">
            {selectedGuides.length} selected:
          </span>

          <Button
            size="sm"
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-600/10"
            onClick={() => handleBulkAction("delete")}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      )}

      {/* Guides Table */}
      <Card className="border-border bg-card overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Submitted Faq</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <CircularLoader />
          ) : (
            <div className="overflow-x-auto">
              {textGuidesArray.length === 0 ? (
                <div className="flex w-full items-center justify-center   p-6 pb-10 text-xl text-center">
                  No Faq Is There To Show
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedGuides.length === textGuidesArray.length &&
                            textGuidesArray.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Id</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Question
                      </TableHead>
                      <TableHead>Answer</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Submitted On
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {textGuidesArray.map((guide, index) => (
                      <TableRow
                        key={guide.id ?? index}
                        className="border-border"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedGuides.includes(guide.id)}
                            onCheckedChange={(checked) =>
                              handleSelectGuide(guide.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium max-w-[150px] md:max-w-none truncate">
                          {index + 1}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {guide.question}
                        </TableCell>
                        <TableCell>
                          {guide.answers
                            ? guide.answers.slice(0, 50) + "..."
                            : "No answer"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {guide.createdAt
                            ? new Date(guide.createdAt)
                                .toISOString()
                                .slice(0, 10)
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleNavigate()}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 sm:gap-4 mt-8 mb-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 sm:gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>

                  <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-medium">
                    <span className="px-2 py-1 bg-primary text-primary-foreground rounded-md min-w-[2rem] text-center">
                      {page}
                    </span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-muted-foreground">{totalPages}</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={page === totalPages}
                    className="flex items-center gap-1 sm:gap-2"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageFaq;
