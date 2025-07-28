# film-website

This project is a film download website that allows users to browse films, view details, and download them. The application features interactive cards that display film banners and flip to show additional information such as the synopsis and IMDb rating.

## Project Structure

```
film-website
├── src
│   ├── components
│   │   ├── FilmCard.js
│   │   ├── FilmDetails.js
│   │   └── DownloadButton.js
│   ├── styles
│   │   └── components.css
│   ├── services
│   │   └── filmAPI.js
│   ├── utils
│   │   └── helpers.js
│   └── App.js
├── public
│   └── index.html
├── package.json
├── .env
└── README.md
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd film-website
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the development server:
   ```bash
   npm start
   ```
2. Open your browser and go to `http://localhost:3000` to view the application.

## Features

- Interactive film cards that display banners and flip to show details.
- Download button for each film that links to the download source.
- Responsive design for a seamless user experience.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.