document
    .querySelector(".addToCart")

    .addEventListener("click", async (event) => {
        try {
            
            const ultCart = localStorage.getItem("active_cart");
          
            const data = {
                product_id: event.target.id,
            };
            dest_fetch = "../api/carts/" + ultCart + "/" + data.product_id
            const opts = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            };
            let response = await fetch(dest_fetch, opts);
            response = await response.json();
            if (response.error) {
                alert(response.error);
            } else {
                alert("ADDED TO CART!");
            }
        } catch (error) {
            alert(error.error);
        }
    });
