# locmeter

`locmeter` is a dependency-free Node CLI that scans your locally cloned GitHub contribution repos, aggregates added and deleted lines by day, week, or month, and renders a PNG chart.

Repository: `jojopirker/locmeter`

## Requirements

- Node.js 18+
- `gh` CLI authenticated
- network access for `gh api`
- local clones of the repos you want included
- `git`

## Usage

```bash
locmeter
```

## Install

```bash
npm install -g locmeter
```

Common options:

- default bucket: `week`
- default `--to`: today
- default `--from`: one year before `--to`
- default author identity: auto-detected from your current `gh` login
- `--from YYYY-MM-DD`
- `--to YYYY-MM-DD`
- `--days N`
- `--bucket day|week|month`
- `--root /path/to/repos`
- `--author-email you@example.com`
- `--author-name yourname`
- `--output chart.png`
- `--json-output data.json`

Example:

```bash
locmeter \
  --from 2025-01-01 \
  --to 2025-12-31 \
  --bucket week
```

Real example generated from your usage:

```bash
locmeter \
  --root ~/Developer \
  --output examples/jojo-weekly.png \
  --json-output examples/jojo-weekly.json
```

That example produced:

- `examples/jojo-weekly.png`
- `examples/jojo-weekly.json`
- date range: `2025-03-13` to `2026-03-13`
- bucket: `week`
- total lines changed: `1,059,347`
- peak week: `207,431`

The CLI prints the generated PNG path and JSON path on success.

## Notes

- `locmeter` is intended for global CLI usage.
- The npm package metadata is set to `MIT`; add the full MIT license text in a `LICENSE` file before publishing.
- The published package only ships the example PNG, not the example JSON.
