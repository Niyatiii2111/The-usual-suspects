# THE USUAL SUSPECTS – Accessibility Layer for Any Website

## Overview

It is a web accessibility solution developed to improve the browsing experience for individuals with reading difficulties, dyslexia, visual impairments, motor impairments, and users who prefer customized visual environments.

Traditional websites often provide limited flexibility in terms of readability, visual comfort, and hands-free navigation. It addresses these challenges through a lightweight Chrome extension that integrates visual customization, dyslexia-friendly typography, text transformation, speech assistance, voice-based navigation, and an accessibility score audit.

The extension allows users to personalize webpages according to their reading and accessibility preferences without modifying the original website.

## Problem Statement

Many websites are not designed to accommodate different accessibility requirements.

Users may experience difficulties due to:

- Poor color contrast and uncomfortable visual layouts.
- Reading difficulties caused by complex text presentation, especially for dyslexic users.
- Limited access to audio-based reading assistance.
- Dependence on mouse-based navigation.
- Lack of personalized reading environments.
- No easy way to measure how accessible a website is.

## Our Solution

It provides an integrated accessibility toolkit that transforms the way users interact with webpages.

It combines customizable VIBGYOR themes, special visual modes, a dyslexia-friendly font, Bionic Reading, a reading ruler, focus rings, contrast boosting, selected text-to-speech, voice-controlled navigation, and a website accessibility audit into a single browser extension.

## Key Features

### 1. VIBGYOR Color Themes

- Provides seven color themes: Violet, Indigo, Blue, Green, Yellow, Orange, and Red.
- Applies the selected color to the webpage for a comfortable visual environment.
- Applies the Lexend font to improve reading comfort.
- Allows users to customize the visual appearance of webpages.

### 2. Special Modes

- **Black:** a high-contrast black background mode.
- **White:** a clean, bright white background mode.
- **Dark Mode:** a low-strain dark theme for comfortable reading.
- **Night Mode:** a warm, low-light theme for night-time browsing.
- **Reset Original:** one-click button that restores the website's original styling.

### 3. Dyslexia Support

- Provides an **Enable Dyslexia Font** option that applies the OpenDyslexic typeface to any webpage.
- OpenDyslexic uses heavier letter bottoms, which helps anchor letters and reduces flipping and rotation of characters.
- Supports Regular and Bold weights for clear emphasis without blurry faux-bold rendering.
- Applies dyslexia-friendly spacing with increased word-spacing, letter-spacing, and line-height.

### 4. Accessibility and Efficiency Score

- The **Audit Website Score** button scans the current webpage and gives it an accessibility score out of 100.
- Checks key areas such as image alt text, headings and landmarks, form labels and button names, zoom restrictions, and the page language attribute.
- Helps users and site owners quickly understand how accessible a website is.

### 5. Motor and Visual Assistance

- **Reading Ruler (Alt+R):** a tinted guide that follows the cursor to help users keep their place and avoid skipping lines.
- **Focus Rings (Alt+K):** highly visible focus indicators that make keyboard navigation easier for users who cannot use a mouse.
- **Auto-Boost Contrast (Alt+C):** automatically improves the contrast of low-contrast text and elements.

### 6. Bionic Reading

- Identifies individual words across webpage text.
- Highlights the initial characters of words using bold formatting.
- Helps users visually scan text more efficiently.
- Dynamically transforms webpage text with the **Toggle Bionic** button.

### 7. Selected Text-to-Speech

- Allows users to select any text on a webpage.
- Displays a floating Read button near the selected text.
- Converts the selected content into speech.
- Uses the browser's built-in Speech Synthesis API.
- The **Stop Audio** button ends playback at any time.

### 8. Voice-Controlled Navigation

- Enables hands-free webpage navigation with the **Start Voice Command** button.
- Recognizes spoken commands using the Web Speech API.
- Supports commands such as:
  - "Open About Us"
  - "Click Contact"
  - "Open Home"
- Identifies matching webpage elements.
- Automatically scrolls to and clicks the matched element.

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| Alt + R | Toggle Reading Ruler |
| Alt + K | Toggle Focus Rings |
| Alt + C | Auto-Boost Contrast |

## How It Works

It follows a simple interaction-based workflow:

1. The user installs and opens the Chrome extension.
2. The extension popup provides different accessibility options.
3. The user selects the desired feature.
4. JavaScript processes the selected action.
5. The extension interacts with the webpage DOM.
6. The selected accessibility transformation is applied.

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Extension popup structure |
| CSS3 | Styling and visual customization |
| JavaScript (ES6) | Core functionality and DOM manipulation |
| Chrome Extension Manifest V3 | Extension configuration |
| Chrome Scripting API | Dynamic webpage styling and script execution |
| Chrome Runtime API | Communication between extension components |
| Web Speech API | Speech recognition and text-to-speech |
| DOM API | Text processing and webpage interaction |
| Lexend Font | Reading-friendly typography |
| OpenDyslexic Font | Dyslexia-friendly typography |

## Installation & Setup

Follow these steps to run locally.

### Prerequisites

- Google Chrome browser.
- Git installed on your system.
- Basic knowledge of Chrome extensions.

### Step 1: Clone the Repository

### Step 2: Navigate to the Project Directory

### Step 3: Open Chrome Extensions

Open the following URL in Google Chrome:

```text
chrome://extensions/
```

### Step 4: Enable Developer Mode

- Enable **Developer mode** from the top-right corner.
- Click on **Load unpacked**.
- Select the cloned project folder containing `manifest.json`.

### Step 5: Start Using Extension

- Open any supported webpage.
- Click the extension icon.
- Select your preferred accessibility feature.
- Explore customized reading, audio assistance, and voice navigation.

## Testing

The extension can be tested using different webpages and interaction scenarios.

| Feature | Testing Scenario |
|---|---|
| VIBGYOR Themes | Click each color and check the webpage changes |
| Special Modes | Switch between Black, White, Dark, and Night modes |
| Reset Original | Click Reset Original and check the site returns to its default look |
| Lexend Font | Apply the reading font to a webpage |
| Dyslexia Font | Click Enable Dyslexia Font and check that OpenDyslexic is applied |
| Audit Website Score | Click Audit Website Score and check the score shown |
| Reading Ruler | Press Alt+R and move the cursor over text |
| Focus Rings | Press Alt+K and navigate with the Tab key |
| Auto-Boost Contrast | Press Alt+C on a low-contrast page |
| Bionic Reading | Click Toggle Bionic and check that word beginnings are bold |
| Text-to-Speech | Select text, click Read, then use Stop Audio |
| Voice Navigation | Click Start Voice Command and say "Open About Us" |

**Note:** Voice recognition availability depends on browser support and microphone permissions. The current voice recognition configuration uses English (US).

## Impact & Benefits

It aims to make everyday web browsing more inclusive and user-friendly.

- **Improved Readability:** Personalized typography, visual themes, and special modes.
- **Dyslexia Support:** OpenDyslexic font and spacing make text easier to read.
- **Motor Accessibility:** Focus rings and keyboard shortcuts reduce dependence on a mouse.
- **Audio Accessibility:** Converts selected webpage text into speech.
- **Hands-Free Interaction:** Enables voice-based webpage navigation.
- **Accessibility Insight:** Audit score shows how accessible a page is.
- **User Customization:** Provides multiple visual environments with one-click reset.
- **Inclusive Browsing:** Supports different reading and interaction preferences.

## Future Enhancements

Potential improvements to make it more powerful include:

- AI-powered webpage summarization.
- Multilingual text-to-speech support.
- Voice-controlled scrolling and additional browser actions.
- Personalized accessibility profiles.
- Advanced contrast and font customization.
- Improved compatibility with dynamic webpages.
- Reading assistance with intelligent content simplification.

## Project Demonstration

A demonstration video is available in the repository.
