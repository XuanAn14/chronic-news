CREATE INDEX IF NOT EXISTS "Article_search_fts_idx"
ON "Article"
USING GIN (
  to_tsvector(
    'english',
    coalesce("title", '') || ' ' ||
    coalesce("excerpt", '') || ' ' ||
    coalesce("content", '') || ' ' ||
    coalesce("author", '')
  )
);
