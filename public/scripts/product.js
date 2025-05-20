//const user_id = localStorage.getItem("user_id");
document
    .querySelector(".addToCart")

    .addEventListener("click", async (event) => {
        try {
            
            const ultCart = localStorage.getItem("active_cart");
            console.log("ultCart ", ultCart)
            
            const data = {
                product_id: event.target.id,
            };
            console.log("data ", data.product_id)
            dest_fetch = "../api/carts/" + ultCart + "/" + data.product_id
            console.log("dest_fetch: ", dest_fetch)
            const opts = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            };
            console.log("opts ", opts)

            let response = await fetch(dest_fetch, opts);
            response = await response.json();
            console.log("response ", response)
            if (response.error) {
                alert(response.error);
            } else {
                alert("ADDED TO CART!");
            }
        } catch (error) {
            alert(error.error);
        }
    });
