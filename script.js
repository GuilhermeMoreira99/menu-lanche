const menu = document.getElementById("main-menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartPrice = document.getElementById("cart-price")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const btnAdd = document.getElementById("add-cart-btn")
const addressInput = document.getElementById("address")
const warnParag = document.getElementById("warn")
const warnCart = document.getElementById("warn-cart")
const hourInfo = document.getElementById("hour-check")


let cart = [];

cartBtn.addEventListener("click" , function(){
    updateCartModal;
    cartModal.style.display = "flex"
})

cartModal.addEventListener("click" , function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click" , function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click" , function(event){
    let parentBtn = event.target.closest("#add-cart-btn")

    if(parentBtn){
        const name = parentBtn.getAttribute("data-name")
        const price = parseFloat(parentBtn.getAttribute("data-price"))
        addToCart(name , price)

    }
})

btnAdd.addEventListener("click", function(){
    cartBtn.className("cartMenu")
})


function addToCart(name , price){
    const verifyItem = cart.find(item => item.name === name)

    if(verifyItem){
        verifyItem.quantidade += 1;
    }
    else{
        cart.push({
            name,
            price,
            quantidade: 1,
        })
    }
    updateCartModal()
}

function updateCartModal (){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <p class="font-bold">${item.name}</p>                
                    <p>Quantidade: ${item.quantidade}</p>                
                    <p class="font-bold">R$ ${item.price}</p>               
                </div>

                <div>
                    <button class="btn-remove-item" data-name="${item.name}">
                        Remover
                    </button>
                </div>
            </div>
        
        `

        total += item.price * item.quantidade;


        cartItemsContainer.appendChild(cartItemElement)

    })

    // cartPrice.innerHTML = "Total R$: " + total.toFixed(2).replace(".",",");
    cartPrice.textContent = total.toLocaleString("pt-BR",{
        style:"currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length

}

cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("btn-remove-item")){
        const name = event.target.getAttribute("data-name")

        console.log(name)

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantidade > 1){
            item.quantidade -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        warnParag.classList.add("hidden") 
    }
})

function checkHour(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora <= 23;
}

const isOpen = checkHour()

if(isOpen){
    hourInfo.textContent = ("Loja aberta: 18:00 às 23:00");
    hourInfo.classList.remove("bg-red-500");
    hourInfo.classList.add("bg-green-600")
}else{
    warnCart.classList.remove("hidden")
    hourInfo.textContent = ("Loja fechada");
    hourInfo.classList.remove("bg-green-600");
    hourInfo.classList.add("bg-red-500");
}

checkoutBtn.addEventListener("click", function(){
    const isOpen = checkHour();
    if(!isOpen){

        Toastify({
            text: "Loja fechada",
            duration: 2000,
            destination: "https://github.com/apvarun/toastify-js",
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: false, // Prevents dismissing of toast on hover
            style: {
            background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0)return;
    if(addressInput.value === ""){
        warnParag.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    const cartItems = cart.map((item)=> {
        return (
            `${item.name} Quantidade: (${item.quantidade}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "+55041992199541"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
})






