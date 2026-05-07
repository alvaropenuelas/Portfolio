export interface Project {
  id: number
  title: string
  desc: string
  tags: string[]
  github: string
  img: string
  icon: string
  span: string
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Orca Global Distribution",
    desc: "Temporal trends of Orcinus orca — OBIS records 1950–2024. Mann-Kendall Z=9.81 p<0.001.",
    tags: ["Python", "R", "folium", "Mann-Kendall"],
    github: "https://github.com/alvaropenuelas/mediterranean-biodiversity-analysis",
    img: "/Portfolio/assets/bonsai.jpg",
    icon: "Waves",
    span: "md:col-span-2 md:row-span-3"
  },
  {
    id: 2,
    title: "Atlantic Mackerel SDM",
    desc: "Species distribution model for Scomber scombrus, NE Atlantic. Random Forest + Bio-ORACLE v3.0.",
    tags: ["R", "Random Forest", "Bio-ORACLE v3"],
    github: "https://github.com/alvaropenuelas/species-distribution-modeling",
    img: "/Portfolio/assets/camassia.jpg",
    icon: "Fish",
    span: "md:col-span-2 md:row-span-2"
  },
  {
    id: 3,
    title: "Fisheries Sustainability",
    desc: "14 commercial species, FAO Areas 21 & 27, 1990–2023. Custom depletion indices + Mann-Kendall.",
    tags: ["Python", "R", "FAO FishStat", "Mann-Kendall"],
    github: "https://github.com/alvaropenuelas/fisheries-sustainability-assessment",
    img: "/Portfolio/assets/columbine.jpg",
    icon: "Anchor",
    span: "md:col-span-1 md:row-span-3"
  },
  {
    id: 4,
    title: "Species Image Classifier",
    desc: "EfficientNet-B0, 5 Mediterranean coastal species, 98% val accuracy. iNaturalist API.",
    tags: ["PyTorch", "EfficientNet", "iNaturalist"],
    github: "https://github.com/alvaropenuelas/species-image-classifier",
    img: "/Portfolio/assets/camassia.jpg",
    icon: "Camera",
    span: "md:col-span-1 md:row-span-2"
  },
  {
    id: 5,
    title: "Real-Time Fish ID",
    desc: "YOLOv8n detection + EfficientNet-B0 classification. 33 species, live webcam or video input.",
    tags: ["PyTorch", "YOLOv8", "OpenCV", "CUDA"],
    github: "https://github.com/alvaropenuelas/real-time-fish-identification",
    img: "/Portfolio/assets/bonsai.jpg",
    icon: "Video",
    span: "md:col-span-2 md:row-span-2"
  }
]
