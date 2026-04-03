const thingy = document.createElement("img");

thingy.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHUAAABjCAYAAACli086AAAD3klEQVR4Xu3ZX4gVdRjGcU0zleyfkRRkG0ViYgkmBoVrRFEQkmlEYAoJUZE33ihknUBFqAgUISKomy6CoqCCTIMiousy7/pjYEFaF1pZadHb+555fjvvjLOrYUTr+X7g4TDv7505u+c9c3bO7IQJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8v5jZzZ4POvK2Z71nesc+8zxveH6xys+eNz3Xtfpe07HW5brW3tXaam0/ru2u7PTM7TjGFZ4XPQetEj/PW55rW31P6zhj5cm8z7jmv8zdNrZ9ngtS/2KrhtglXtSFqfdb1beXWlorb4gntP2Ktkfzq+fGtP/VnkOtniJ+vkWpd1e7ocOrpX/cs+ZQd3h6nuc8n6b6ZvVO9OxVLV64hzzDnketetHDx+nY/2So93jeUS1s8Wy26hPhD9XeT/uXQcVanInxe2z0HFH9s9S7yqrfK/Ky1sMLqb6y9I971hzqNak+xfOl6ntUm1+32iP1UfprT6n+l2emaqc8VNUeVi1MS/VnVfte25dY9TxhS+nT2oOqh8bHsNaH0/oN7fUzgo0yVK29p/pubd+XeodavXemtQWq/VtD3araPm0vSX03lT6txcfyfuWWvKb14XrXARqqP57nWeb5TfXHVF870ml2Ues453iGlCmqnc5Q4+O353neqo/2454V6rsj9Z1wNo7FBnCoXXqeieoddahd7PSGmn3jmZf6GkP1XOZZ05HZZZ+073DsJAM71Pjqcb56/8uhxiD3e37Udly4DamvPdTb03a2fOQJxQZwqHGVuFSJ743FWvU+kGqXto6zwOrvfHNUO6DeHblXa0e1tinVTvib6o+TrfoOHHapdlvd1n9ehppZx99U1c9O9f7NA3+8NdWWjhykWluT1q5S7XNtv97qvdDqq9eRGxPWMVTVN6h2UNv5Krx/8yL15osohmrNocYZUpShnmv1jYfdVp9NMzyfqB43BM5S/SXVfvcsSceNO0TFYtUvtuanwxyrLrru8nyhWrn6nWT1XaSvTHeb/HGm50PVA0O1kwxV9V6q/+T52pp3mDak3us9x9Lad1bfHAgfpd6T3VEK61P/utbaYT3GmyqulANDtVMbapwl26w5rBAv5DOmszT1L/f80GztizNqVuoba6jxRuiZrsLVH3e34k7Sn6kvfoa4iCoXVwM71OlWf7+c3For9Rm5rrVZnnut+lu6MrbbPYWvTbPqxY7eyPyOnvj4Lc/XTuONkvnabM/9Ou6Vql2u/br+GTE1Hbf/fRoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzgx/A915H8y7iDAUAAAAAElFTkSuQmCC";

thingy.style = "z-index:99999999999999999999;position:fixed;top:0;right:0;cursor:pointer;";

thingy.onclick = function () {
    window.open("https://github.com/Instel12/RCUBGT", "_blank");
    this.remove();
};

let authObject = null;

try {
    if (window.parent && window.parent !== window) {
        authObject = window.parent.document.getElementById("auth");
    } else {
        authObject = document.getElementById("auth");
    }
} catch (e) {
    authObject = null;
}

if (!authObject || authObject.innerHTML !== "yep, authenticated") {
    document.body.appendChild(thingy);
}