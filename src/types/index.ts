export interface CarouselItem {
  id: string | number;
  url: string;
  name: string;
  author: string;
  Format?: string;
  Pages?: number;
  Year?: number;
  link?: string;
}

export interface CarouselProps {
  data: CarouselItem[];
}