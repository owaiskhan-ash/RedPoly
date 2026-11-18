# Comics

Keep each comic in its own numbered issue folder, such as `issue-002-short-title/`. Store its metadata (`issue.json`) and production notes with the issue, and name optimized finished page art sequentially (`pages/page-01.webp`, `pages/page-02.webp`, and so on), plus a small `cover.webp` preview. Add reader-ready issue metadata to `catalog.json`. Issue 01 is the first complete six-page story; its original homepage storyboard is retained with the issue. Issue 02, CC Does a Spin, is the second six-page story and the first to tag products onto each page through a `shop` list in its manifest.

Issue 01 is kept in the repo but is not listed in `catalog.json`. The shelf lists the newest release first: Issue 03 (Sector Zero) Part 2, Issue 03 Part 1, then Issue 02. Each installment has its own catalog ID, manifest, and cover. For a multipart issue, use the same `number` and a numeric `part` on each catalog entry so the reader can label it and link to the next part.
