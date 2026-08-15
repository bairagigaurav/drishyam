import type { CartItem } from "@/context/AppContext";

const WHATSAPP_NUMBER = "917999965453"; // Store WhatsApp number in international format without +

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

export function makeWhatsAppUrl(cart: CartItem[]) {
  const baseUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`;

  if (cart.length === 0) {
    return `${baseUrl}&text=${encodeMessage("Hello Drishyam Optical, I would like to place an order.")}`;
  }

  const lines: string[] = [
    "Hello Drishyam Optical,",
    "I would like to place an order from your offline store:",
    "",
  ];

  cart.forEach((item, index) => {
    const itemLines = [
      `${index + 1}. ${item.product.name}`,
      `   Color: ${item.selectedColor}`,
      item.selectedLens ? `   Lens: ${item.selectedLens}` : "",
      `   Quantity: ${item.quantity}`,
      `   Price: $${item.product.price * item.quantity}`,
    ];
    lines.push(...itemLines.filter(Boolean));
  });

  lines.push("", `Subtotal: $${cart.reduce((total, item) => total + item.product.price * item.quantity, 0)}`);
  lines.push("", "Please let me know when I can collect this order from the store.");

  return `${baseUrl}&text=${encodeMessage(lines.join("\n"))}`;
}
