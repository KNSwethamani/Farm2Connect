const params = new URLSearchParams(window.location.search);
const farmerId = params.get("id");

const farmerName = document.getElementById("farmerName");
const farmerRole = document.getElementById("farmerRole");
const farmerPhone = document.getElementById("farmerPhone");
const farmerEmail = document.getElementById("farmerEmail");
const farmerProducts = document.getElementById("farmerProducts");
const contactFarmerBtn = document.getElementById("contactFarmerBtn");

async function loadFarmerDetails() {
    if (!farmerId) {
        farmerName.textContent = "Farmer not found";
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:5000/api/farmers/${farmerId}`
        );

        const data = await response.json();

        if (!response.ok) {
            farmerName.textContent = data.message || "Farmer not found";
            return;
        }

        const farmer = data.farmer;

        farmerName.textContent = farmer.full_name;
        farmerRole.textContent = farmer.role;
        farmerPhone.textContent = farmer.phone;
        farmerEmail.textContent = farmer.email;

        if (!data.products || data.products.length === 0) {
            farmerProducts.textContent = "No products available.";
            return;
        }

        farmerProducts.innerHTML = "";

        data.products.forEach(product => {
            const productDiv = document.createElement("div");

            productDiv.innerHTML = `
                <p><strong>Product:</strong> ${product.product_name}</p>
                <p><strong>Available:</strong> ${product.quantity} ${product.unit}</p>
                <p><strong>Price:</strong> ₹${product.price_per_unit} / ${product.unit}</p>
                <p><strong>Description:</strong> ${product.description || "Not available"}</p>
                <hr>
            `;

            farmerProducts.appendChild(productDiv);
        });

    } catch (error) {
        console.error(error);
        farmerName.textContent = "Unable to connect to server.";
    }
}

contactFarmerBtn.addEventListener("click", () => {
    if (farmerPhone.textContent !== "Loading...") {
        window.location.href = `tel:${farmerPhone.textContent}`;
    }
});

loadFarmerDetails();


