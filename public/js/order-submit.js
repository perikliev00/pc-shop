document.addEventListener("DOMContentLoaded", () => {
    const orderForm = document.getElementById("orderForm");

    orderForm.addEventListener("submit", (event) => {

        // Show a success message
        alert("Order created successfully!");

        // Optionally, you can submit the form programmatically after showing the alert
        // orderForm.submit();
    });
});