# Timer Manager

A React.js application for managing multiple customizable timers with categories, progress visualization, and history tracking.

## Features

- Create and manage multiple timers
- Categorize timers (Workout, Study, Break, Other)
- Visual progress tracking with progress bars
- Timer controls (Start, Pause, Reset)
- Group timers by categories
- History tracking of completed timers
- Local storage persistence
- Clean and modern UI using Material-UI

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd timer-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── context/       # Context providers
  ├── pages/         # Page components
  ├── App.js         # Main application component
  └── index.js       # Application entry point
```

## Assumptions and Design Decisions

1. **Timer Duration**: Timers are stored in seconds for precise control and easy conversion to minutes/hours.
2. **Categories**: Predefined categories (Workout, Study, Break, Other) for better organization.
3. **State Management**: Using React Context for state management to avoid prop drilling.
4. **Persistence**: Using localStorage for data persistence between sessions.
5. **UI Framework**: Material-UI for consistent and responsive design.
6. **Timer Accuracy**: Using setInterval for timer functionality, with potential drift over long periods.
7. **Mobile Responsiveness**: The UI is designed to be responsive and work well on both desktop and mobile devices.

## Future Improvements

1. Add sound notifications for timer completion
2. Implement custom categories
3. Add timer templates
4. Implement timer statistics and analytics
5. Add dark mode support
6. Implement timer sharing functionality
7. Add export/import functionality for timer configurations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
