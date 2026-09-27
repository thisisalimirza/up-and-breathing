import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { ARTICLE_SLUGS } from "../data/types";
import { useCopy } from "../state/store";

export function Learn() {
  const copy = useCopy();
  return (
    <div className="stack">
      <PageHeader title={copy.learn.title} sub={copy.learn.intro} />
      <ul className="link-list">
        {ARTICLE_SLUGS.map((slug) => {
          const article = copy.learn.articles[slug];
          return (
            <li key={slug}>
              <Link to={`/learn/${slug}`}>
                <span className="choice-label">{article.title}</span>
                <span className="choice-help">{article.blurb}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
