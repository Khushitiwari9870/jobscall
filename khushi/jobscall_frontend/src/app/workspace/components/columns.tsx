"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { ExternalLink, XCircle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export type SavedSearch = {
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

export const columns: ColumnDef<SavedSearch>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.name}
        <a href="#" className="ml-2 text-blue-500 hover:underline">
          <ExternalLink className="inline h-4 w-4" />
        </a>
      </div>
    ),
  },
  {
    accessorKey: "source",
    header: "Candidate's Source",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge
          variant={
            status === "Approved"
              ? "default"
              : status === "Pending"
              ? "secondary"
              : "destructive"
          }
          className="capitalize"
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "screening",
    header: "Screening",
  },
  {
    accessorKey: "shortlisting",
    header: "Shortlisting",
  },
  {
    accessorKey: "interviewing",
    header: "Interviewing",
  },
  {
    accessorKey: "selected",
    header: "Selected",
  },
  {
    accessorKey: "offered",
    header: "Offered",
  },
  {
    accessorKey: "createdOn",
    header: "Created On",
    cell: ({ row }) => {
      const date = new Date(row.original.createdOn)
      return date.toLocaleDateString()
    },
  },
  {
    accessorKey: "response",
    header: "Response",
    cell: ({ row }) => (
      <div className="flex items-center">
        {row.original.response === "Good" ? (
          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <XCircle className="h-4 w-4 text-amber-500 mr-1" />
        )}
        {row.original.response}
      </div>
    ),
  },
]
