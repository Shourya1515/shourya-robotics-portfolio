# Shourya Vuddemarri — Robotics Portfolio

Source for my portfolio site: **https://shourya1515.github.io/shourya-robotics-portfolio/**

Robotics engineer (M.S. Robotics, Northeastern University) working on SLAM and state estimation,
perception, sensor fusion and autonomous navigation — in simulation and on real robots.

## Projects

| Project | Area |
|---|---|
| [Visual-Inertial SLAM with ORB-SLAM3](https://shourya1515.github.io/shourya-robotics-portfolio/project-orb-slam3.html) | SLAM · ROS 2 |
| [C.A.N.D.I. Delivery Robot — SLAM & Nav2](https://shourya1515.github.io/shourya-robotics-portfolio/project-4wheel-slam.html) | Navigation · ROS 2 |
| [Multi-Object Tracking with Cross-Camera Re-ID](https://shourya1515.github.io/shourya-robotics-portfolio/project-multi-object-tracking.html) | Computer vision |
| [Bio-Inspired Omnidirectional Robot (IEEE ICRA 2024 poster)](https://shourya1515.github.io/shourya-robotics-portfolio/project-omni.html) | Robot design |
| [Combat Robotics Series (25 / 15 / 8 kg)](https://shourya1515.github.io/shourya-robotics-portfolio/project-combat.html) | Hardware |
| [Real-Time ASL Fingerspelling](https://shourya1515.github.io/shourya-robotics-portfolio/project-asl-fingerspelling.html) | Computer vision |
| [NUance IMU + GPS Navigation Study](https://shourya1515.github.io/shourya-robotics-portfolio/project-nu-nance.html) | Sensor fusion |
| [Block-Map LiDAR Localization](https://shourya1515.github.io/shourya-robotics-portfolio/project-block-map-localization.html) | Localization |
| [Pesticide Spraying Robot](https://shourya1515.github.io/shourya-robotics-portfolio/project-pesticide.html) | Hardware |

## Structure

- `index.html` — home page: skills, about, experience, projects, contact. Self-contained: its styles and
  scripts are inline, and the 3D robot is drawn with three.js (loaded from jsDelivr). Without WebGL, or
  with reduced motion turned on, it falls back to a static layout.
- `project-*.html` — one page per project
- `style.css`, `main.js` — styles and scripts shared by the project pages (plain HTML/CSS/JS, no build step)
- `images/<project>/` — original photos, figures and videos
- `images/thumbs/` — resized copies used on cards and galleries; the lightbox opens the originals

Served by GitHub Pages from the `main` branch. The previous design is kept on the `old-portfolio-2026-10`
branch (tag `v1-before-redesign`).
