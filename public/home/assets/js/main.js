gsap.registerPlugin(ScrollTrigger);

// header settings

const sections = document.querySelectorAll(".section");

const navHighlighter = () => {
    let headerArea = document.querySelector(".header-area");
    let headerTopSet = window.pageYOffset;

    if (headerTopSet > 50) {
        headerArea.style.borderBottom = "1px solid rgba(192, 192, 192, 0.3)";
    } else {
        headerArea.style.borderBottom = "none";
    }

    let scrollY = window.pageYOffset;

    sections.forEach(item => {
        const sectionHeight = item.offsetHeight;
        const sectionTop = item.offsetTop - 100;
        let sectionId = item.getAttribute("id");

        if (scrollY == 0) {
            document.querySelector(`nav a[href*=home]`).classList.add("active-lnk");
        }

        if (scrollY > sectionTop && scrollY <= sectionHeight + sectionTop) {
            document.querySelector(`nav a[href*=${sectionId}]`).classList.add("active-lnk");
        } else {
            document.querySelector(`nav a[href*=${sectionId}]`).classList.remove("active-lnk");
        }
    })
}

window.addEventListener("scroll", navHighlighter);


// section about brand logo slider
$(document).ready(function () {
    $('.brands-slider').slick({
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: false,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                }
            },
            {
                breakpoint: 1260,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 1440,
                settings: {
                    slidesToShow: 4,
                }
            },
        ]
    });
})

//portfolio images
Fancybox.bind('[data-fancybox="gallery-portfolio"]', {});

//customer slider

$(document).ready(function () {
    $('.customer-slider').slick({
        arrows: false,
        dots: true,
    });
})


// gsap settings

gsap.from(".open-animate .first", {
    left: "-100%",
    duration: 1.5,
    ease: Expo.easeInOut
})
gsap.from(".open-animate .second", {
    left: "-100%",
    duration: 1.5,
    delay: .5,
    ease: Expo.easeInOut
})


var t1 = gsap.timeline();
let mediaQuery = matchMedia("(max-width: 767px)").matches ? true : false;

t1.to(".open-animate", {
    visibility: "hidden",
    opacity: 0,
    delay: 1,
    onComplete: () => {
        ScrollTrigger.refresh()
    }
})

t1.from(".section-img", {
    opacity: 0
})
t1.from("header .logo", {
    opacity: 0,
    y: 0,
})
if (mediaQuery) {
    t1.from(".m-menu", {
        opacity: 0,
        y: 0
    })
}
else {
    t1.from("nav li", {
        opacity: 0,
        y: 0,
        stagger: 0.2,
    })
}
t1.from(".content .desc", {
    opacity: 0,
    x: -250,
})
t1.from(".info .title span", {
    opacity: 0,
    y: 0,
    stagger: 0.1,
})
t1.from(".info-item .item", {
    opacity: 0,
    y: 0,
    stagger: 0.3,
})
t1.from(".swipe-down", {
    opacity: 0,
    y: 0,
})

// section animations

gsap.from(".about .img-content", {
    scrollTrigger: {
        trigger: "#about",
        start: matchMedia("(max-width: 1024px)").matches ? "top center" : "center bottom"
    },
    x: -100,
    opacity: 0
})
gsap.from(".about .txt-content", {
    scrollTrigger: {
        trigger: "#about",
        start: matchMedia("(max-width: 1024px)").matches ? "top center" : "center bottom"
    },
    x: 100,
    opacity: 0
})
gsap.from(".about .brands-area", {
    scrollTrigger: {
        trigger: "#about",
        start: matchMedia("(max-width: 1024px)").matches ? "top center" : "center bottom"
    },
    opacity: 0
})
gsap.from("#services .section-title", {
    scrollTrigger: {
        trigger: "#services",
        start: matchMedia("(max-width: 1024px)").matches ? "top center" : "center bottom",
    },
    opacity: 0,
    y: -25
})
gsap.from("#services .section-text", {
    scrollTrigger: {
        trigger: "#services",
        start: matchMedia("(max-width: 1024px)").matches ? "top center" : "center bottom"
    },
    opacity: 0,
    y: -25
})
gsap.from("#services .item-list .item", {
    scrollTrigger: {
        trigger: "#services",
        start: matchMedia("(max-width: 1024px)").matches ? "top center" : "center bottom"
    },
    y: -50,
    opacity: 0,
    stagger: 0.3
})
gsap.from("#portfolio .section-title", {
    scrollTrigger: {
        trigger: "#portfolio",
        start: "top+=100 center",
    },
    opacity: 0,
    y: -25
})
gsap.from("#portfolio .section-text", {
    scrollTrigger: {
        trigger: "#portfolio",
        start: "top+=100 center"
    },
    opacity: 0,
    y: -25
})
gsap.from("#portfolio .item-wrapper .item", {
    scrollTrigger: {
        trigger: "#portfolio",
        start: "top+=100 center"
    },
    y: -10,
    opacity: 0,
    stagger: 0.3
})
gsap.from("#customers .left", {
    scrollTrigger: {
        trigger: "#customers",
        start: "top+=100 center"
    },
    x: -50,
    opacity: 0
})
gsap.from("#customers .right", {
    scrollTrigger: {
        trigger: "#customers",
        start: "top+=100 center"
    },
    x: 50,
    opacity: 0
})
gsap.from("#customers .contact", {
    scrollTrigger: {
        trigger: "#customers",
        start: "top+=100 center"
    },
    delay: 0.5,
    opacity: 0
})
gsap.from(".footer-line", {
    scrollTrigger: {
        trigger: "footer",
        start: "top bottom",
    },
    width: "0",
    duration: 1.5
})
gsap.from("footer .logo", {
    scrollTrigger: {
        trigger: "footer",
        start: "top bottom",
    },
    opacity: 0,
    y: -50
})
gsap.from(".footer-nav li", {
    scrollTrigger: {
        trigger: "footer",
        start: "top bottom",
    },
    opacity: 0,
    y: -50,
    stagger: 0.3
})
gsap.from(".social .title", {
    scrollTrigger: {
        trigger: "footer",
        start: "top bottom",
    },
    opacity: 0,
    y: -50
})
gsap.from(".social li", {
    scrollTrigger: {
        trigger: "footer",
        start: "top bottom",
    },
    opacity: 0,
    y: -10,
    stagger: 0.3
})
gsap.from(".copyright", {
    scrollTrigger: {
        trigger: "footer",
        start: "top bottom",
    },
    opacity: 0,
    delay: 1
})

// mobile menu

const openMenu = document.querySelector(".m-menu");
const menuWrapper = document.querySelector(".m-menu-wrapper");
const closeMenu = document.querySelector(".close");
const itemBody = document.getElementsByTagName("body")[0];
const menuLnk = document.querySelectorAll(".m-lnk");

openMenu.addEventListener("click", () => {
    menuWrapper.style.left = "0";
    itemBody.style.overflowY = "hidden";
})

closeMenu.addEventListener("click", () => {
    menuWrapper.style.left = "-100%";
    itemBody.style.overflowY = "scroll";
})

menuLnk.forEach(item => {
    item.addEventListener("click", () => {
        menuWrapper.style.left = "-100%";
        itemBody.style.overflowY = "scroll";
    })
})