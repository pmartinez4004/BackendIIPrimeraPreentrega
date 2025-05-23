const login = async () => {
  try {
    const data = {
      email: document.querySelector("#email").value,
      password: document.querySelector("#password").value,
    };
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    
    const url = "/api/auth/login";
    let response = await fetch(url, opts);
    response = await response.json();
       if (response.error) {
      alert(response.error);
    } else {
      localStorage.setItem("logged", response.response) // se guarda estado de login
      const data1 = {};
      const opts1 = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
      
      const url1 = "/api/carts/";           // se crea unuevo carrito para cargar selecciones del usuario
      let response1 = await fetch(url1, opts1);
      response = await response1.json();
      localStorage.setItem("active_cart", response.response._id) // se guarda id del carrito
      if (response1.error) {
        alert(response1.error);
      } else {
        location.replace("/")
      }
    }
  }
  catch (error) {
    alert(error.message);
  }
};


document.querySelector("#login").addEventListener("click", login);
