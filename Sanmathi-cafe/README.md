# HostelEats - Hostel Food Delivery System

A web-based food delivery system designed specifically for hostels, allowing students to order food from the hostel kitchen and get it delivered to their rooms.

## Features

- Browse menu by categories: Breakfast, Lunch, Dinner, Snacks, and Beverages
- Add items to cart with real-time updates
- Apply promo codes for discounts
- Checkout with delivery information
- Multiple payment options
- Order confirmation and tracking
- Mobile-responsive design

## Project Structure

```
hostel-food-delivery/
│
├── index.html              # Home page
├── menu.html               # Full menu page with categories
├── cart.html               # Cart and checkout page
│
├── css/
│   ├── combined.css        # Complete stylesheet
│   ├── styles.css          # Base styles
│   └── styles-add.css      # Additional styles
│
├── js/
│   ├── script.js           # Common JavaScript functionality
│   └── cart.js             # Cart and checkout functionality
│
└── images/                 # Directory for images
```

## Setup Instructions

1. Clone or download this repository
2. Open `index.html` in your web browser to view the site
3. The website uses local storage to maintain cart data between sessions

## Technologies Used

- HTML5
- CSS3 (with CSS Variables)
- JavaScript (Vanilla)
- Font Awesome for icons
- Google Fonts for typography

## Required Images

For the website to look complete, you'll need to add the following images to the `images` directory:

- Food category images: breakfast.jpg, lunch.jpg, dinner.jpg, snacks.jpg, beverages.jpg
- Dish images: sandwich.jpg, pasta.jpg, biryani.jpg, noodles.jpg, omelette.jpg, etc.
- User images for testimonials

## Customization

You can easily customize this website by:

1. Editing the HTML files to change content
2. Modifying the CSS variables in the combined.css file to change colors
3. Adding or removing menu items by editing the menu.html file
4. Changing the promo code by editing the cart.js file

## License

This project is open-source and available for personal and educational use.

## Credits

- Font Awesome for icons
- Google Fonts for typography
