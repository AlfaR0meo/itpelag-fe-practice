# Веб-приложение для сканирования QR-кодов
## GitHub Pages app demo
https://alfar0meo.github.io/itpelag-fe-practice/

## Goals
Create Web application that will allow users to read QR codes via camera or local image upload

## Requirements

### Reading QR codes
- Using camera
- Using file storage of device

### Processing
- Displaying content of QR code
- Text: in accessible form
- Link: allow user to follow a link

### Interface
- User-friendly interface
- Buttons for reading from camera and file storage
- Boundaries for QR code reading area
- After reading QR code user should be able to scan another QR code or return to home screen of an app

## Technology stack
- TypeScript
- React.js
- ZXing.js ([zxing-wasm](https://duckduckgo.com))
- CSS (SCSS)
- Web API:
  - Media Capture and Streams API
  - File API
