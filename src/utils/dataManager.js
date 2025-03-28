// Initialize local storage with some sample data if it doesn't exist
const initializeData = () => {
  if (!localStorage.getItem("products")) {
    localStorage.setItem(
      "products",
      JSON.stringify([
        {
          id: 1,
          name: "Classic Black Cover",
          price: 599,
          description: "Sleek black cover for all phone models",
          imageUrl: "/images/black-cover.jpg",
        },
        {
          id: 2,
          name: "Floral Pattern Cover",
          price: 699,
          description: "Beautiful floral pattern cover",
          imageUrl: "/images/floral-cover.jpg",
        },
      ])
    );
  }
  if (!localStorage.getItem("users")) {
    localStorage.setItem(
      "users",
      JSON.stringify([
        {
          id: 1,
          email: "admin@example.com",
          password: "admin123",
          isAdmin: true,
        },
        {
          id: 2,
          email: "user@example.com",
          password: "user123",
          isAdmin: false,
        },
      ])
    );
  }
  if (!localStorage.getItem("purchases")) {
    localStorage.setItem(
      "purchases",
      JSON.stringify([
        {
          id: 1,
          productName: "Classic Black Cover",
          price: 599,
          discount: 0,
          finalPrice: 599,
          userId: 2,
          createdAt: "2023-06-01T10:00:00Z",
        },
        {
          id: 2,
          productName: "Floral Pattern Cover",
          price: 699,
          discount: 50,
          finalPrice: 649,
          userId: 2,
          createdAt: "2023-06-02T14:30:00Z",
        },
      ])
    );
  }
};

// Get data from local storage
const getData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Save data to local storage
const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Generate a unique ID
const generateId = () => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

export { initializeData, getData, saveData, generateId };
