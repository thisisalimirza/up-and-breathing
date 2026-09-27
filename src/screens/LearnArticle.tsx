import { Link, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { PageHeader } from "../components/PageHeader";
import { ARTICLE_SLUGS, type ArticleSlug } from "../data/types";
import { useCopy } from "../state/store";

function isSlug(value: string | undefined): value is ArticleSlug {
  return ARTICLE_SLUGS.includes(value as ArticleSlug);
}

export function LearnArticle({ slug: forced }: { slug?: ArticleSlug }) {
  const params = useParams();
  const copy = useCopy();
  const slug = forced ?? (isSlug(params.slug) ? params.slug : undefined);
  if (!slug) {
    return (
      <div className="stack">
        <PageHeader title={copy.learn.missingTitle} sub={copy.learn.missingBody} />
        <Button to="/learn">{copy.back}</Button>
      </div>
    );
  }
  const article = copy.learn.articles[slug];
  return (
    <article className="stack">
      <PageHeader title={article.title} sub={article.blurb} />
      {article.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="body">
          {paragraph}
        </p>
      ))}
      <Button to="/breathe">{copy.learn.practice}</Button>
      <Link className="btn btn-secondary" to="/learn">
        {copy.back}
      </Link>
    </article>
  );
}
