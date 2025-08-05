# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a simple, self-contained static web application for organizing a Korean travel itinerary. The entire application is contained within a single `index.html` file with embedded CSS and JavaScript.

## Project Structure

```
soul-trip/
├── index.html        # Main application file (HTML + embedded CSS/JS)
├── .vscode/          # VS Code workspace configuration
└── .claude/          # Claude Code permissions configuration
```

## Development Commands

This is a static HTML application with no build process or dependencies:

- **Run locally**: Open `index.html` directly in a web browser
- **Deploy**: Upload `index.html` to any static web hosting service
- **No build, test, or lint commands required**

## Architecture

The application follows a single-file architecture where all code is embedded within `index.html`:

1. **CSS (lines 7-258)**: Modern CSS with flexbox, grid, transitions, and responsive design
2. **HTML (lines 260-558)**: Semantic markup organized into clear sections
3. **JavaScript (lines 560-576)**: Minimal interactivity for checkbox state management

Key architectural decisions:
- No external dependencies or frameworks
- All styles and scripts embedded for portability
- Responsive design with mobile breakpoint at 1200px
- Color-coded sections for different activity types (Person X, Person Y, Shared)

## Application Features

- Interactive wishlist with persistent checkbox states (using localStorage)
- Time-based schedule for August 9-11, 2025
- Flight information display
- Person-specific and shared activity tracking
- Mobile-responsive design

## Code Conventions

When modifying this application:
- Maintain the single-file structure unless absolutely necessary
- Keep JavaScript minimal and focused on essential interactivity
- Use semantic HTML elements
- Follow the existing CSS organization and naming patterns
- Preserve the color-coding system for different activity types