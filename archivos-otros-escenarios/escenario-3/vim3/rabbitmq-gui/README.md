# RabbitMQ GUI

This project is a web application designed to provide a graphical user interface for displaying sent and received messages using RabbitMQ. The application leverages React and TypeScript to create a responsive and interactive user experience.

## Project Structure

- **src/**: Contains all the source code for the application.
  - **components/**: Contains React components for the application.
    - **MessageList.tsx**: Displays a list of messages.
    - **MessageItem.tsx**: Represents a single message.
    - **Dashboard.tsx**: Main interface that includes the message list.
  - **services/**: Contains functions for interacting with the backend API.
    - **api.ts**: Methods for fetching sent and received messages.
  - **types/**: Contains TypeScript interfaces.
    - **message.ts**: Defines the structure of a message object.
  - **utils/**: Contains utility functions.
    - **websocket.ts**: Functions for managing WebSocket connections.
  - **App.tsx**: Main application component that sets up routing.
  - **index.tsx**: Entry point of the application.

- **public/**: Contains public assets.
  - **index.html**: Main HTML file for the application.

- **package.json**: Configuration file for npm, listing dependencies and scripts.

- **tsconfig.json**: TypeScript configuration file specifying compiler options.

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd rabbitmq-gui
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

## Features

- Real-time display of sent and received messages.
- User-friendly interface for managing messages.
- WebSocket integration for live updates.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.