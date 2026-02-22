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
  const price = parseFloat((Math.random() * 500 + 10)?.toFixed(2));
  const rating = parseFloat((Math.random() * 2 + 3)?.toFixed(1));
  
  return {
    id: `product-${index + 1}`,
    name: `${name} - Model ${index + 1}`,
    price,
    category,
    rating,
    isNew: index % 50 === 0,
    image: `https://picsum.photos/seed/${index+1}/400/600`,
    imageAlt: `Professional product photography of ${name} in ${category} category with modern studio lighting and clean white background`
  };
}