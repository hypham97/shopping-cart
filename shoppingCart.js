import items from "./items.json"
import formatCurrency from "./util/formatCurrency.js"
import addGlobalListener from "./util/addGlobalListener.js"

const cartButton = document.querySelector("[data-cart-button]")
const cartItemWrapper = document.querySelector("[data-cart-item-wrapper]")
let shoppingCart = []
const IMAGE_URL = "https://dummyimage.com/210x130"
const cartItemTemplate = document.querySelector("#cart-item-template")
const cartItemContainer = document.querySelector("[data-cart-items]")
const cartQuantity = document.querySelector("[data-cart-quantity]")
const cartTotal = document.querySelector("[data-cart-total]")
const cart = document.querySelector("[data-cart]")
const SESSION_STORAGE_KEY = "SHOPPING_CART-cart"

export function setupShoppingCart() {
  // Remove from cart
  addGlobalListener("click", "[data-remove-from-cart-button]", (e) => {
    const id = parseInt(e.target.closest("[data-item]").dataset.itemId)
    removeFromCart(id)
  })
  shoppingCart = loadCart()
  renderCart()
}

function saveCart() {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(shoppingCart))
}

function loadCart() {
  const cart = sessionStorage.getItem(SESSION_STORAGE_KEY)
  return JSON.parse(cart) || []
}

// Show/Hide the cart when clicked
cartButton.addEventListener("click", () => {
  cartItemWrapper.classList.toggle("invisible")
})

// Add items to cart
// Calculate an accurate total
// Handle multiple of the same item in the cart
export function addToCart(id) {
  const existingItem = shoppingCart.find((entry) => entry.id === id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    shoppingCart.push({ id: id, quantity: 1 })
  }
  renderCart()
  saveCart()
}

// Show/Hide the cart button when it has no item or when it goes from 0 to 1 item

function renderCart() {
  if (shoppingCart.length === 0) {
    hideCart()
  } else {
    showCart()
    renderCartItems()
  }
}

function hideCart() {
  cart.classList.add("invisible")
  cartItemWrapper.classList.add("invisible")
}

function showCart() {
  cart.classList.remove("invisible")
}

function renderCartItems() {
  cartQuantity.innerText = shoppingCart.reduce((sum, entry) => {
    return sum + entry.quantity
  }, 0)

  const totalCents = shoppingCart.reduce((sum, entry) => {
    const item = items.find((i) => entry.id === i.id)
    return sum + item.priceCents * entry.quantity
  }, 0)
  cartTotal.innerText = formatCurrency(totalCents / 100)

  cartItemContainer.innerHTML = ""

  shoppingCart.forEach((entry) => {
    const item = items.find((i) => entry.id === i.id)
    const cartItem = cartItemTemplate.content.cloneNode(true)

    const container = cartItem.querySelector("[data-item]")
    container.dataset.itemId = item.id

    const name = cartItem.querySelector("[data-name]")
    name.innerText = item.name

    const image = cartItem.querySelector("[data-image]")
    image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`

    if (entry.quantity > 1) {
      const quantity = cartItem.querySelector("[data-quantity]")
      quantity.innerText = `x${entry.quantity}`
    }

    const price = cartItem.querySelector("[data-price]")

    price.innerText = formatCurrency((item.priceCents * entry.quantity) / 100)

    cartItemContainer.appendChild(cartItem)
  })
}

// Remove items from cart
function removeFromCart(id) {
  const existingItem = shoppingCart.find((entry) => entry.id === id)
  if (existingItem == null) return
  shoppingCart = shoppingCart.filter((entry) => entry.id !== id)
  renderCart()
  saveCart()
}
