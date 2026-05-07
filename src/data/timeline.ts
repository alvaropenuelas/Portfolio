import { GraduationCap, BookOpen, Waves, Fish, FileText, Globe } from "lucide-react"

export const timelineData = [
  {
    id: 1,
    title: "MSc Marine Science",
    date: "2023–2025",
    content: "Inter-university programme VUB/UGhent/UAntwerp. Cum Laude. Thesis: mitochondrial phylogeography of Cypridopsis vidua across continents.",
    category: "Education",
    icon: GraduationCap,
    relatedIds: [2, 5],
    status: "completed" as const,
    energy: 100
  },
  {
    id: 2,
    title: "BSc Biology",
    date: "2020–2023",
    content: "Universidad de Navarra. EIA mention. Exchange year Nottingham Trent University 2022–2023.",
    category: "Education",
    icon: BookOpen,
    relatedIds: [1],
    status: "completed" as const,
    energy: 90
  },
  {
    id: 3,
    title: "Vietnam Fieldwork",
    date: "2024",
    content: "Aquaculture & sustainable practices assessment. Cat Ba small-scale systems. Field interviews and productivity research.",
    category: "Field",
    icon: Waves,
    relatedIds: [4, 6],
    status: "completed" as const,
    energy: 80
  },
  {
    id: 4,
    title: "Tenerife Survey",
    date: "2024",
    content: "Coastal ecosystem monitoring. Seagrass transects and hard-bottom photographic analysis. Marine Reserve of Abades.",
    category: "Field",
    icon: Fish,
    relatedIds: [3, 6],
    status: "completed" as const,
    energy: 75
  },
  {
    id: 5,
    title: "Publication in Prep",
    date: "2025",
    content: "Cypridopsis vidua reproductive modes and cryptic diversification. Submitted to Hydrobiologia Special Issue.",
    category: "Research",
    icon: FileText,
    relatedIds: [1],
    status: "in-progress" as const,
    energy: 60
  },
  {
    id: 6,
    title: "Cabo Verde",
    date: "2022–2023",
    content: "Marine turtle conservation & monitoring. BIOS organisation. Nesting site monitoring, hatchery management, volunteer training.",
    category: "Field",
    icon: Globe,
    relatedIds: [3, 4],
    status: "completed" as const,
    energy: 85
  }
]

export type TimelineEntry = typeof timelineData[number]
