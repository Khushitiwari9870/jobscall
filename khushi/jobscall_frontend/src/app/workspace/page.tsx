import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Search, Trash2, Plus } from "lucide-react"
import { DataTable } from "./components/data-table"
import { columns } from "./components/columns"

type SavedSearch = {
  id: string
  name: string
  source: string
  status: "Approved" | "Pending" | "Rejected"
  screening: number
  shortlisting: number
  interviewing: number
  selected: number
  offered: number
  createdOn: string
  response: string
}

export default function WorkspacePage() {
  // Mock data
  const savedSearches: SavedSearch[] = [
    {
      id: "1",
      name: "Senior React Developer",
      source: "Internal Database",
      status: "Approved",
      screening: 24,
      shortlisting: 18,
      interviewing: 12,
      selected: 5,
      offered: 3,
      createdOn: "2023-10-01",
      response: "Good"
    },
    {
      id: "2",
      name: "Full Stack Engineer",
      source: "Job Portal",
      status: "Pending",
      screening: 15,
      shortlisting: 10,
      interviewing: 5,
      selected: 2,
      offered: 1,
      createdOn: "2023-10-05",
      response: "Average"
    },
    {
      id: "3",
      name: "DevOps Engineer",
      source: "Referral",
      status: "Rejected",
      screening: 8,
      shortlisting: 5,
      interviewing: 2,
      selected: 0,
      offered: 0,
      createdOn: "2023-09-28",
      response: "Poor"
    },
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Workspace</h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Job
          </Button>
        </div>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="saved-search">Saved Search</TabsTrigger>
          </TabsList>
          <Button variant="outline" className="gap-2 text-destructive border-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </Button>
        </div>

        <TabsContent value="jobs" className="space-y-4">
          <div className="rounded-md border">
            <DataTable columns={columns} data={savedSearches} />
          </div>
        </TabsContent>

        <TabsContent value="saved-search">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No saved searches yet</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Save your search criteria to quickly find candidates later.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="jobs" className="mt-6">
          {/* Jobs content will go here */}
          <div className="text-muted-foreground text-center py-12">
            <p>No jobs found. Create a new job posting to get started.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="saved-search" className="mt-6">
          <div className="rounded-md border">
            <DataTable columns={columns} data={savedSearches} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
