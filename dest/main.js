//============== GET DATA FORM PRODUCTS.JSON ==============
let products = null;
fetch('https://650f9b0d54d18aabfe9a203b.mockapi.io/api/v1/capstonejs')
  .then((response) => response.json())
  .then((data) => {
    products = data;
    addDatatoHTML();
    // console.log(products);
  });
let listCart = [];
// De sau khi call api ve
function checkCart() {
  var cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith('listCart='));
  if (cookieValue) {
    // Sử dụng toàn bộ cookieValue làm dữ liệu JSON
    listCart = JSON.parse(cookieValue.replace('listCart=', ''));
  }
}
checkCart();
// add data product to HTML
const addDatatoHTML = () => {
  //remove datat defautl in html
  let listProductHTML = document.querySelector('.scproducts__list');
  listProductHTML.innerHTML = '';
  // add new data
  if (products != null) {
    products.forEach((product) => {
      let newProduct = document.createElement('a');
      // id cua moi san pham
      newProduct.href = '/detail.html?id=' + product.id;
      newProduct.classList.add('item');
      newProduct.innerHTML = `
        <div class="img">
        <img src="${product.img}" alt="" />
        <div class="label">
          <span class="label__discount">-30%</span>
          <span class="label__tag">NEW</span>
        </div>
      </div>
      <div class="content">
        <span class="des">CATEGORY</span>
        <h3 class="title">${product.name}</h3>
        <div class="prices">
          <span class="prices__new">$${formatPrice(product.price)}</span>
          <span class="prices__old">$1,959</span>
        </div>
        <div class="rating">
          <i class="fa-solid fa-star icon"></i>
          <i class="fa-solid fa-star icon"></i>
          <i class="fa-solid fa-star icon"></i>
          <i class="fa-solid fa-star icon"></i>
          <i class="fa-solid fa-star icon"></i>
        </div>
        <div class="btns">
          <div class="btns__icon">
            <i class="fa-regular fa-heart icon"></i>
          </div>
          <div class="btns__icon">
            <i class="fa-solid fa-arrow-right-arrow-left icon"></i>
          </div>
          <div class="btns__icon">
            <i class="fa-solid fa-eye icon"></i>
          </div>
        </div>
      </div>
      <div class="cart">
        <button class="cart__btn" onclick="addCart(${product.id}, event)">
          <i class="fa-solid fa-cart-shopping icon"></i>
          <span>ADD TO CART</span>
        </button>
      </div>
        `;
      listProductHTML.appendChild(newProduct);
    });
  }
  // Phan trang
  handlePage();
};
//======== END  GET DATA FORM PRODUCTS.JSON ========
function checkRole() {
  var type = localStorage.getItem('userType');
  if (type != null) {
    if (type === 'admin') window.location.href = '../AdminPort/index.html';
    document.querySelector('.header__admin-btn').style.display = 'block';
    alert('You dont have permisison to access this site');
    // else alert("You dont have permisison to access this site");
  } else alert('You dont have permisison to access this site');
}
//===== Xu ly gio hang Cart =========
function addCart($idProduct, event) {
  event.preventDefault();
  let productCopy = JSON.parse(JSON.stringify(products));
  //if this product is not in cart
  if (!listCart[$idProduct]) {
    let dataProduct = productCopy.filter(
      (product) => product.id == $idProduct
    )[0];
    //add data product in cart
    listCart[$idProduct] = dataProduct;
    listCart[$idProduct].quantity = 1;
  } else {
    //if this product is already in the cart
    // i just increased the quantity
    listCart[$idProduct].quantity++;
  }
  // i wiwll save datas cart in cookie
  // to save yhis datas cart when i turn of the computer
  let timeSave = 'expries=Thu, 31 Dec 2025 23:59:59 UTC';
  document.cookie =
    'listCart=' + JSON.stringify(listCart) + '; ' + timeSave + '; path=/';
  addCarttoHTML();
}

function addCarttoHTML() {
  //clear data default;
  let listCartHTML = document.querySelector('.listCart');
  listCartHTML.innerHTML = '';

  let totalHTML = document.querySelector('.totalQuantity');
  let totalQuantity = 0;

  if (listCart) {
    listCart.forEach((product) => {
      if (product) {
        let newCart = document.createElement('div');
        newCart.classList.add('item');
        newCart.innerHTML = `
        <div class="img">
        <img src="${product.img}" alt="" />
      </div>
          <div class="content">
            <div class="name">${product.name}</div>
            <div class="price">$${formatPrice(product.price)} </div>
          </div>
          <div class="quantity">
            <button class="oper" onclick="changeQuantity(${
              product.id
            },'-')">-</button>
            <span class="value">${product.quantity}</span>
            <button class="oper" onclick="changeQuantity(${
              product.id
            },'+')">+</button>
          </div>`;
        listCartHTML.appendChild(newCart);
        totalQuantity = totalQuantity + product.quantity;
      }
    });
  }

  totalHTML.innerText = totalQuantity;
}
addCarttoHTML();

function changeQuantity($idProduct, $type) {
  switch ($type) {
    case '+':
      listCart[$idProduct].quantity++;
      break;
    case '-':
      listCart[$idProduct].quantity--;
      if (listCart[$idProduct].quantity <= 0) {
        delete listCart[$idProduct];
      }
      break;
    default:
      break;
  }
  //save new cookie
  let timeSave = 'expries=Thu, 31 Dec 2025 23:59:59 UTC';
  document.cookie =
    'listCart=' + JSON.stringify(listCart) + '; ' + timeSave + '; path=/';
  //reload
  addCarttoHTML();
}
// ======== Ket thuc Xu ly gio hang Cart ========

// ======== *HAM XU LY PHAN TRANG =======
// Khai bao global
let thisPage = 1;
let limit = 4;

function handlePage() {
  let list = document.querySelectorAll('.scproducts__list .item');
  // Hien thi so luong item da cai dat
  function loadItem() {
    let beginGet = limit * (thisPage - 1);
    let endGet = limit * thisPage - 1;
    list.forEach((item, key) => {
      if (key >= beginGet && key <= endGet) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
    listPage();
  }
  loadItem();

  // Hien thi tong so trang
  function listPage() {
    let count = Math.ceil(list.length / limit);
    let listPageContainer = document.querySelector('.listPage');
    listPageContainer.innerHTML = '';

    // Nut prev
    if (thisPage > 1) {
      let prev = document.createElement('li');
      let icon = document.createElement('i');
      prev.classList.add('fa-solid', 'fa-arrow-left');
      prev.appendChild(icon);
      prev.addEventListener('click', function () {
        changePage(thisPage - 1);
      });
      listPageContainer.appendChild(prev);
    }

    // Hien thi so nut
    for (let i = 1; i <= count; i++) {
      let newPage = createPageElement(i);
      listPageContainer.appendChild(newPage);
    }

    // Nut next
    if (thisPage < count) {
      let next = document.createElement('li');
      let icon = document.createElement('i');
      icon.classList.add('fa-solid', 'fa-arrow-right');
      next.appendChild(icon);
      next.addEventListener('click', function () {
        changePage(thisPage + 1);
      });
      listPageContainer.appendChild(next);
    }
  }

  function createPageElement(i) {
    let newPage = document.createElement('li');
    newPage.innerText = i;
    if (i === thisPage) {
      newPage.classList.add('--is-active');
    }
    // Sử dụng hàm `changePage` để xử lý sự kiện click
    newPage.addEventListener('click', function () {
      changePage(i);
    });
    return newPage;
  }

  function changePage(i) {
    if (i >= 1 && i <= Math.ceil(list.length / limit)) {
      thisPage = i;
      loadItem();
    }
  }
}
handlePage();
//  ======== Ket thuc XU LY PHAN TRANG =======

//==== Bo loc ====
let list = document.querySelector('.scproducts__list');
let filter = document.querySelector('.filter');
let count = document.getElementById('count');
let productFilter = [];
let listProducts = [];

fetch('https://650f9b0d54d18aabfe9a203b.mockapi.io/api/v1/capstonejs')
  .then((response) => response.json())
  .then((data) => {
    listProducts = data;
    productFilter = data;
    showProduct(productFilter);
  });

// Ham dat trong fecth de lay api ve
function showProduct(productFilter) {
  count.innerText = productFilter.length;
  list.innerHTML = '';
  productFilter.forEach((product) => {
    let newProduct = document.createElement('a');
    // id cua moi san pham
    newProduct.href = '/detail.html?id=' + product.id;
    newProduct.classList.add('item');
    newProduct.innerHTML = `
        <div class="img">
        <img src="${product.img}" alt="" />
        <div class="label">
          <span class="label__discount">-30%</span>
          <span class="label__tag">NEW</span>
        </div>
      </div>
      <div class="content">
        <span class="des">CATEGORY</span>
        <h3 class="title">${product.name}</h3>
        <div class="prices">
          <span class="prices__new">$${formatPrice(product.price)}</span>
          <span class="prices__old">$${formatPrice(
            formatOldPrice(product.price)
          )}</span>
        </div>
        <div class="rating">
          <i class="fa-solid fa-star icon"></i>
          <i class="fa-solid fa-star icon"></i>
          <i class="fa-solid fa-star icon"></i>
          <i class="fa-solid fa-star icon"></i>
          <i class="fa-solid fa-star icon"></i>
        </div>
        <div class="btns">
          <div class="btns__icon">
            <i class="fa-regular fa-heart icon"></i>
          </div>
          <div class="btns__icon">
            <i class="fa-solid fa-arrow-right-arrow-left icon"></i>
          </div>
          <div class="btns__icon">
            <i class="fa-solid fa-eye icon"></i>
          </div>
        </div>
      </div>
      <div class="cart">
        <button class="cart__btn" onclick="addCart(${product.id}, event)">
          <i class="fa-solid fa-cart-shopping icon"></i>
          <span>ADD TO CART</span>
        </button>
      </div>
        `;
    list.appendChild(newProduct);
  });
  handlePage();
}

filter.addEventListener('submit', function (event) {
  event.preventDefault();
  let valueFilter = event.target.elements;
  productFilter = listProducts.filter((item) => {
    if (valueFilter.category.value != '') {
      if (item.type != valueFilter.category.value) {
        return false;
      }
    }
    if (valueFilter.name.value != '') {
      if (
        !item.name.toLowerCase().includes(valueFilter.name.value.toLowerCase())
      ) {
        return false;
      }
    }
    if (valueFilter.minPrice.value != '') {
      if (parseInt(item.price) < parseInt(valueFilter.minPrice.value)) {
        return false;
      }
    }
    if (valueFilter.maxPrice.value != '') {
      if (parseInt(item.price) > parseInt(valueFilter.maxPrice.value)) {
        return false;
      }
    }

    return true;
  });
  valueFilter.category.value = '';
  valueFilter.name.value = '';
  valueFilter.minPrice.value = '';
  valueFilter.maxPrice.value = '';

  showProduct(productFilter);
});
//==== End Bo loc ====

// Hienn thi logged
document.addEventListener('DOMContentLoaded', function () {
  var headerAdminText = document.querySelector('.header__admin-text');
  var headerAdminOut = document.querySelector('.header__admin-out');

  headerAdminOut.addEventListener('click', function () {
    // Xóa thông tin đăng nhập khỏi localStorage
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userType');

    // Ẩn phần tử headerAdminOut và hiển thị phần tử mặc định
    headerAdminOut.style.display = 'none';
    headerAdminText.innerHTML = `<a style="color: #fff; cursor: pointer;" href="/login.html">Login</a>`; // Hoặc đặt giá trị mặc định khác
    alert('Đăng xuất thành công');
    // Thông báo đăng xuất thành công
  });

  var loggedInUsername = localStorage.getItem('loggedInUser');
  if (loggedInUsername) {
    headerAdminText.textContent = 'Xin chào, ' + loggedInUsername;
    headerAdminOut.style.display = 'block';
  } else {
    headerAdminOut.style.display = 'none';
  }
});

function formatPrice(number) {
  return new Intl.NumberFormat('en-US').format(number);
}

function formatOldPrice(number) {
  // Chuyển đổi chuỗi thành số và thực hiện phép cộng
  const result = Number(number) + 959;

  // Kiểm tra xem kết quả có phải là một số hợp lệ không
  if (isNaN(result)) {
    return 'Không phải là một số hợp lệ';
  }

  return result;
}
