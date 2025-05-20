//console.log("navbar");

const logged_user = localStorage.getItem("logged");
const cartCurrentUser= localStorage.getItem("active_cart");
const menu = document.querySelector("#opts");


if (logged_user) {
  menu.innerHTML = `
   
    <a class="btn btn-warning py-2 px-3 m-2" href="/carts/${cartCurrentUser}">Cart</a>
    <button class="btn btn-danger py-2 px-3 m-2" id="signout">Sign out</button>
  `;
  document.querySelector("#signout").addEventListener("click", () => {
    localStorage.removeItem("logged");
    location.replace("/");
  });
} else {
  menu.innerHTML = `
    <a class="btn btn-warning py-2 px-3 m-2" href="/register">Register</a>
    <a class="btn btn-outline-info py-2 px-3 m-2" href="/login">Login</a>
  `;
}

