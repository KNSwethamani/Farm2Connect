const productForm = document.getElementById("productForm");
const productMessage = document.getElementById("productMessage");
const productsList = document.getElementById("productsList");
const logoutBtn = document.getElementById("logoutBtn");

const user = JSON.parse(localStorage.getItem("farm2connectUser"));


// Check login
if (!user) {
    window.location.href = "login.html";
}


// Allow only farmers
if (user && user.role.toUpperCase() !== "FARMER") {
    alert("Only farmers can add products.");
    window.location.href = "dashboard.html";
}


// Add product
productForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const product_name =
        document.getElementById("product_name").value.trim();

    const quantity =
        document.getElementById("quantity").value;

    const unit =
        document.getElementById("unit").value;

    const price_per_unit =
        document.getElementById("price_per_unit").value;

    const description =
        document.getElementById("description").value.trim();


    productMessage.textContent = "Adding product...";


    try {

        const response = await fetch(
            "http://localhost:5000/api/products",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    farmer_id: user.user_id,
                    product_name,
                    quantity,
                    unit,
                    price_per_unit,
                    description
                })
            }
        );


        const data = await response.json();


        if (response.ok) {

            productMessage.textContent =
                "Product added successfully! 🌱";

            productForm.reset();

            loadProducts();

        } else {

            productMessage.textContent =
                data.message || "Failed to add product.";

        }

    } catch (error) {

        console.error(error);

        productMessage.textContent =
            "Unable to connect to the server.";

    }

});


// Load farmer's products
async function loadProducts() {

    try {

        const response = await fetch(
            `http://localhost:5000/api/products/farmer/${user.user_id}`
        );

        const data = await response.json();


        if (!response.ok) {
            return;
        }


        if (data.products.length === 0) {

            productsList.innerHTML =
                "<p>No products listed yet.</p>";

            return;
        }


        productsList.innerHTML = "";


        data.products.forEach((product) => {

            const productCard = document.createElement("div");

            productCard.className = "product-item";

            productCard.innerHTML = `
                <h3>${product.product_name}</h3>

                <p>
                    Quantity:
                    ${product.quantity} ${product.unit}
                </p>

                <p>
                    Price:
                    ₹${product.price_per_unit} / ${product.unit}
                </p>

                <p>
                    ${product.description || "No description"}
                </p>
            `;

            productsList.appendChild(productCard);

        });

    } catch (error) {

        console.error(error);

    }

}


// Logout
logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("farm2connectUser");

    window.location.href = "login.html";

});


// Load products when page opens
loadProducts();

