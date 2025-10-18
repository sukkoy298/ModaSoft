# Sales Page Project

## Overview
This project is a web application for a sales page that allows users to view products, register if they are unregistered, and manage user interactions. 

## Project Structure
```
sales-page
├── public
│   ├── index.html          # Main entry point for the sales page
│   ├── register.html       # Registration form for unregistered users
│   └── products.html       # Displays the list of products
├── src
│   ├── css
│   │   └── styles.css      # Styles for the sales page, registration page, and products page
│   └── js
│       ├── script.js       # Handles user interactions and redirects
│       └── products.js     # Contains product data and functions to display products
├── package.json            # Configuration file for npm
├── .gitignore              # Specifies files to be ignored by version control
└── README.md               # Documentation for the project
```

## Features
- User registration for unregistered users.
- Display of products retrieved from a predefined array.
- User-friendly interface with forms for input and product display.

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run `npm install` to install the necessary dependencies.
4. Open `public/index.html` in your web browser to view the sales page.

## Usage Guidelines
- Users can enter their information on the sales page.
- Unregistered users will be redirected to the registration page.
- Registered users can view the list of products on the products page.

## Contributing
Feel free to submit issues or pull requests for improvements and bug fixes.