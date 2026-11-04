import type { ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { notes } from "@/lib/content/notes";
import {
  Devices,
  flagship,
  Icon,
  PortfolioPage,
} from "@/components/portfolio/shared";

export const dynamicParams = false;
export function generateStaticParams() {
  return notes.map(({ slug }) => ({ slug }));
}
type Props = { params: Promise<{ slug: string }> };

async function loadNote({ params }: Props) {
  const { slug } = await params;
  return notes.find((note) => note.slug === slug) ?? notFound();
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata) {
  const note = await loadNote(props);
  const url = `/notes/${note.slug}`;
  return {
    title: note.title,
    description: note.intro,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      images: (await parent).openGraph?.images,
      title: note.title,
      description: note.intro,
      url,
    },
  };
}

export default async function NotePage(props: Props) {
  const note = await loadNote(props);
  const isCse = note.slug === "inside-cse-exam-review";
  return (
    <PortfolioPage>
      <article className="pf-article">
        <Link href="/#notes" className="pf-back">
          <Icon glyph={ArrowLeft} />
          Back to notes
        </Link>
        <span className="pf-kicker">{note.category}</span>
        <h1>{note.title}</h1>
        <div className="pf-byline">
          <Image src="/portfolio/avatar.webp" width={34} height={34} alt="" />
          Selwyn Uy · Founder & developer
        </div>
        {isCse && <Devices id="cse" name="CSE Exam Review" />}
        {note.paragraphs.map(({ body, heading }) => (
          <div key={body}>
            {heading && <h2>{heading}</h2>}
            <p>{body}</p>
          </div>
        ))}
        {isCse && (
          <p>
            <a href={flagship} className="pf-text-link">
              Visit CSE Exam Review ↗
            </a>
          </p>
        )}
      </article>
    </PortfolioPage>
  );
}
