const thingy = document.createElement("img");

thingy.src = "https://instel12.github.io/RCUBGT/Assets/api/watermark.png";

thingy.style = "z-index:99999999999999999999;position:fixed;top:15px;right:12px;height:15px;cursor:pointer;";

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