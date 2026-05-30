This folder should contain the images referenced by `ngdxh-system-architecture.md`.

Place the nine screenshots/diagrams here with the filenames:

- architecture-overview.png
- deployment-topology.png
- devtools-network.png
- landing-mobile-1.png
- validate-screen.png
- roles-artifact.png
- dashboard-desktop.png
- dashboard-mobile.png
- other-screenshot.png

After copying the images into this folder, run the conversion script at the repo root:

Windows PowerShell:
```
.
\scripts\convert_md_to_docx.ps1
```

Or run Pandoc manually:
```
pandoc docs/ngdxh-system-architecture.md -o NGDXH_System_Architecture.docx --resource-path=docs
```
