// features/products/productGenerator.ts

const names = [
  "Premium Wireless Bluetooth Headphones",
  "Ultra HD 4K Smart Television",
  "Professional DSLR Camera Kit",
  "Ergonomic Office Chair",
  "Stainless Steel Coffee Maker",
  "Portable Power Bank 20000mAh",
  "Gaming Mechanical Keyboard",
  "Fitness Tracker Smart Watch",
  "Memory Foam Mattress Queen",
  "Electric Standing Desk"
];

export function generateProduct(index, categories) {
  const category = categories[index % categories.length];
  const name = names[index % names.length];

  return {
    id: `product-${index + 1}`,
    name: `${name} - Model ${index + 1}`,
    price: 10 + (index % 500),
    category,
    rating: 3 + (index % 2),
    isNew: index % 50 === 0,
    image: `https://picsum.photos/seed/${index}/400/600`
  };
}