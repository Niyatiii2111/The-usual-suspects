
# THE USUAL SUSPECTS – Accessibility Layer for Any Website

## Overview

**THE USUAL SUSPECTS** is a web accessibility solution developed to improve the browsing experience for individuals with reading difficulties, dyslexia, visual impairments, motor impairments, and users who prefer customized visual environments.

Traditional websites often provide limited flexibility in terms of readability, visual comfort, and hands-free navigation. This project addresses these challenges through a lightweight Chrome extension that integrates visual customization, dyslexia-friendly typography, text transformation, speech assistance, voice-based navigation, and an accessibility score audit.

The extension allows users to personalize webpages according to their reading and accessibility preferences without permanently modifying the original website or its source code.

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

We provide an integrated accessibility toolkit that transforms the way users interact with webpages.

It combines customizable VIBGYOR themes, special visual modes, dyslexia-friendly fonts, Bionic Reading, a reading ruler, focus rings, contrast boosting, selected text-to-speech, voice-controlled navigation, and a website accessibility audit into a single browser extension.



## Key Features

### 1. VIBGYOR Color Themes

- Provides seven color themes: Violet, Indigo, Blue, Green, Yellow, Orange, and Red.
- Applies the selected color theme to the webpage for a comfortable visual environment.
- Uses the Lexend font to improve reading comfort.
- Allows users to customize the visual appearance of webpages.

### 2. Special Modes

- **Black Mode:** A high-contrast black background mode.
- **White Mode:** A clean, bright white background mode.
- **Dark Mode:** A dark theme for comfortable reading in low-light environments.
- **Night Mode:** A warm, low-light theme for nighttime browsing.
- **Reset Original:** A one-click option that restores the website's original styling.

### 3. Dyslexia Support

- Provides an **Enable Dyslexia Font** option that applies the OpenDyslexic typeface to webpages.
- OpenDyslexic is designed for readers with dyslexia and uses distinctive letter shapes with heavier bottom portions.
- Supports Regular and Bold font weights for clearer text presentation.
- Applies dyslexia-friendly spacing through increased word spacing, letter spacing, and line height.

### 4. Website Accessibility Score

The **Audit Website Score** button scans the current webpage and provides an accessibility score out of 100.

It checks key accessibility elements such as:

- Image alternative text (alt attributes).
- Heading structure and page landmarks.
- Form labels and button names.
- Zoom restrictions.
- HTML page language attribute.

It helps users and website developers identify potential accessibility issues and understand areas that may need improvement.

### 5. Motor and Visual Assistance

- **Reading Ruler (Alt + R):** A tinted guide that follows the cursor to help users maintain their reading position and avoid skipping lines.
- **Focus Rings (Alt + K):** Highly visible focus indicators that make keyboard navigation easier for users who cannot rely on a mouse.
- **Auto-Boost Contrast (Alt + C):** Automatically improves the contrast of low-contrast text and webpage elements.

### 6. Bionic Reading

- Identifies individual words across webpage text.
- Highlights the initial characters of words using bold formatting.
- Helps users visually scan text more efficiently.
- Dynamically transforms webpage text using the **Toggle Bionic** button.

### 7. Selected Text-to-Speech

- Allows users to select any text on a webpage.
- Displays a floating **Read** button near the selected text.
- Converts the selected content into speech.
- Uses the browser's built-in Speech Synthesis API.
- The **Stop Audio** button ends playback at any time.

### 8. Voice-Controlled Navigation

- Enables hands-free webpage navigation using the **Start Voice Command** button.
- Recognizes spoken commands through the Web Speech API.
- Supports voice commands.
- Identifies matching webpage elements.
- Automatically scrolls to and clicks the matched element.

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Alt + R` | Toggle Reading Ruler |
| `Alt + K` | Toggle Focus Rings |
| `Alt + C` | Auto-Boost Contrast |

## How It Works

The extension follows a simple interaction-based workflow:

1. The user installs and opens the Chrome extension.
2. The extension popup provides different accessibility options.
3. The user selects the desired feature.
4. JavaScript processes the selected action.
5. The extension interacts with the webpage DOM.
6. The selected accessibility transformation is applied.
7. The user experiences a personalized and accessible browsing environment.

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

Follow these steps to run the project locally.

### Prerequisites

- Google Chrome browser.
- Git installed on your system.
- Basic knowledge of Chrome extensions.

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### Step 2: Navigate to the Project Directory

```bash
cd YOUR_PROJECT_FOLDER
```

### Step 3: Open Chrome Extensions

Open the following URL in Google Chrome:

```text
chrome://extensions/
```

### Step 4: Enable Developer Mode

1. Enable **Developer Mode** from the top-right corner.
2. Click on **Load unpacked**.
3. Select the cloned project folder containing `manifest.json`.

### Step 5: Start Using the Extension

1. Open any supported webpage.
2. Click the extension icon.
3. Select your preferred accessibility feature.
4. Explore customized reading, audio assistance, and voice navigation.

## Testing

The extension can be tested using different webpages and interaction scenarios.

| Feature | Testing Scenario |
|---|---|
| VIBGYOR Themes | Click each color and check the webpage changes. |
| Special Modes | Switch between Black, White, Dark, and Night modes. |
| Reset Original | Click Reset Original and check that the site returns to its default appearance. |
| Lexend Font | Apply the reading font to a webpage. |
| Dyslexia Font | Enable Dyslexia Font and check that OpenDyslexic is applied. |
| Accessibility Score | Click Audit Website Score and check the displayed score. |
| Reading Ruler | Press Alt + R and move the cursor over text. |
| Focus Rings | Press Alt + K and navigate using the Tab key. |
| Auto-Boost Contrast | Press Alt + C on a low-contrast webpage. |
| Bionic Reading | Click Toggle Bionic and check that word beginnings are bold. |
| Text-to-Speech | Select text, click Read, and then use Stop Audio. |
| Voice Navigation | Click Start Voice Command and say "Open About Us". |

**Note:** Voice recognition availability depends on browser support and microphone permissions. The current voice recognition configuration uses English (US).

## Impact & Benefits

The project aims to make everyday web browsing more inclusive and user-friendly.

- **Improved Readability:** Personalized typography, visual themes, and special modes.
- **Dyslexia Support:** OpenDyslexic font and customized spacing provide an alternative reading experience.
- **Motor Accessibility:** Focus rings and keyboard shortcuts reduce dependence on mouse-based interaction.
- **Audio Accessibility:** Converts selected webpage text into speech.
- **Hands-Free Interaction:** Enables voice-based webpage navigation.
- **Accessibility Insight:** An automated audit score helps identify potential accessibility issues.
- **User Customization:** Provides multiple visual environments with a one-click reset option.
- **Inclusive Browsing:** Supports different reading and interaction preferences.

## Future Enhancements

Potential improvements to make the extension more powerful include:

- AI-powered webpage summarization.
- Multilingual text-to-speech support.
- Voice-controlled scrolling and additional browser actions.
- Personalized accessibility profiles.
- Advanced contrast and font customization.
- Improved compatibility with dynamic webpages.
- Reading assistance with intelligent content simplification.

## Project Demonstration

A demonstration video is available.
