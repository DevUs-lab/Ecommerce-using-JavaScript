import "bootstrap/dist/js/bootstrap.bundle.min.js";

const $ = document.querySelectorAll("#mainNav .nav-link");
console.log('$', $)
window.addEventListener("load", () => {

    $.forEach(link => {
        link.addEventListener("click", e => {
            $.forEach(item => item.classList.remove('active'));

            // add active to clicked one
            link.classList.add('active');
        })
    });

});

