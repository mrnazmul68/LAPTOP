/*dropping animation*/
var c = document.getElementById("canvas-club");
var ctx = c.getContext("2d");
var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;
var clearColor = 'rgba(0, 0, 0, .1)';
var max = 30;
var drops = [];

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function O() { }

O.prototype = {
    init: function () {
        this.x = random(0, w);
        this.y = 0;
        this.color = 'hsl(0, 100%, 50%)'; // রঙ লাল করা হয়েছে
        this.w = 2;
        this.h = 1;
        this.vy = random(4, 5);
        this.vw = 3;
        this.vh = 1;
        this.size = 2;
        this.hit = random(h * .8, h * .9);
        this.a = 1;
        this.va = .96;
    },
    draw: function () {
        if (this.y > this.hit) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.h / 2);

            ctx.bezierCurveTo(
                this.x + this.w / 2, this.y - this.h / 2,
                this.x + this.w / 2, this.y + this.h / 2,
                this.x, this.y + this.h / 2);

            ctx.bezierCurveTo(
                this.x - this.w / 2, this.y + this.h / 2,
                this.x - this.w / 2, this.y - this.h / 2,
                this.x, this.y - this.h / 2);

            ctx.strokeStyle = 'hsla(0, 100%, 50%, ' + this.a + ')'; // রঙ লাল করা হয়েছে
            ctx.stroke();
            ctx.closePath();

        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size * 5);
        }
        this.update();
    },
    update: function () {
        if (this.y < this.hit) {
            this.y += this.vy;
        } else {
            if (this.a > .03) {
                this.w += this.vw;
                this.h += this.vh;
                if (this.w > 100) {
                    this.a *= this.va;
                    this.vw *= .98;
                    this.vh *= .98;
                }
            } else {
                this.init();
            }
        }

    }
}

function resize() {
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
}

function setup() {
    for (var i = 0; i < max; i++) {
        (function (j) {
            setTimeout(function () {
                var o = new O();
                o.init();
                drops.push(o);
            }, j * 200)
        }(i));
    }
}


function anim() {
    ctx.fillStyle = clearColor;
    ctx.fillRect(0, 0, w, h);
    for (var i in drops) {
        drops[i].draw();
    }
    requestAnimationFrame(anim);
}


window.addEventListener("resize", resize);

setup();
anim();







/*nav er element highlight*/
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav ul li a");

function setActive() {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120; // header height adjust
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute("id");
        }
    });

    // যদি শেষ section এ পৌঁছে যাই, তাহলে current এ সেট করো
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
        current = sections[sections.length - 1].getAttribute("id");
    }

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
}

// scroll হলে কাজ করবে
window.addEventListener("scroll", setActive);

// page load হলে সাথে সাথে কাজ করবে
window.addEventListener("load", setActive);









//donar filter+reg korle donar section e add hobe


document.addEventListener("DOMContentLoaded", () => {
    const donorForm = document.getElementById("donarform");
    const donorList = document.getElementById("donorlist");
    const searchForm = document.getElementById("searchForm");
    const resetBtn = document.getElementById("resetBtn");
    const noResult = document.getElementById("noResult");

    // localStorage থেকে donor load করা
    let donorsData = JSON.parse(localStorage.getItem("donors")) || [];

    // donor card বানানোর ফাংশন
    function createDonorCard(donor) {
        const donorCard = document.createElement("div");
        donorCard.classList.add("pro");
        donorCard.setAttribute("data-blood", donor.bloodGroup);
        donorCard.setAttribute("data-upojela", donor.upozila);

        donorCard.innerHTML = `
            <img src="${donor.photo}" alt="">
            <div class="des">
                <span class="inf">Donar</span>
                <h4>Name: <span class="info">${donor.name}</span></h4>
                <h4>Blood: <span class="info">${donor.bloodGroup}</span></h4>
                <h4><span class="info">${donor.age} years old</span></h4>
                <h4>Upozila: <span class="info">${donor.upozila}</span></h4>
                <h4>Address: <span class="info">${donor.address}</span></h4>
                <h4>Number: <span class="info">${donor.mobile}</span></h4>
                <a href="#"><button
                    onclick="window.open('https://wa.me/88${donor.mobile}?text=Assalamu%20alaikum%2C%20ami%20aapnar%20donation%20niye%20book%20korte%20chai.')">Book Now</button></a>
            </div>
        `;
        donorList.insertBefore(donorCard, noResult);
    }

    // localStorage থেকে সব donor load করা
    donorsData.forEach(donor => createDonorCard(donor));

    // 🔹 Donor Registration Form Submit
    donorForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const photoInput = document.getElementById("photo");
        const bloodGroup = document.getElementById("bloodGroup").value;
        const name = document.getElementById("name").value;
        const upozila = document.getElementById("upozilaReg").value;
        const age = document.getElementById("age").value;
        const address = document.getElementById("address").value;
        const mobile = document.getElementById("mobile").value;
        const email = document.getElementById("email").value; // থাকবে কিন্তু card এ দেখাবো না

        // Image Base64 convert
        const reader = new FileReader();
        reader.onload = function (event) {
            let photoURL = event.target.result;

            // donor object
            const newDonor = { photo: photoURL, bloodGroup, name, upozila, age, address, mobile, email };

            // localStorage এ save
            donorsData.push(newDonor);
            localStorage.setItem("donors", JSON.stringify(donorsData));

            // donor card তৈরি
            createDonorCard(newDonor);

            donorForm.reset();
            donorList.scrollIntoView({ behavior: "smooth", block: "start" });
        };

        if (photoInput.files && photoInput.files[0]) {
            reader.readAsDataURL(photoInput.files[0]); // Base64 save হবে
        }
    });

    // 🔹 Donor Search Form Submit
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const bloodGroup = document.getElementById("blood_group").value.trim();
        const upozila = document.getElementById("upozilaSearch").value.trim();

        const donors = donorList.querySelectorAll(".pro");
        let found = false;

        donors.forEach(donor => {
            const donorBlood = donor.getAttribute("data-blood")?.trim();
            const donorUpozila = donor.getAttribute("data-upojela")?.trim();

            const matchBlood = bloodGroup === "" || donorBlood === bloodGroup;
            const matchUpozila = upozila === "" || donorUpozila === upozila;

            if (matchBlood && matchUpozila) {
                donor.style.display = "block";
                found = true;
            } else {
                donor.style.display = "none";
            }
        });

        noResult.style.display = found ? "none" : "block";
        donorList.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // 🔹 Reset Button
    resetBtn.addEventListener("click", function () {
        document.getElementById("blood_group").value = "";
        document.getElementById("upozilaSearch").value = "";

        const donors = donorList.querySelectorAll(".pro");
        donors.forEach(donor => donor.style.display = "block");

        noResult.style.display = "none";
        donorList.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});





//sign up and profile setup

// Smooth scroll to signup form
document.getElementById("signupBtn").addEventListener("click", () => {
  document.querySelector("#donate").scrollIntoView({ behavior: "smooth" });
});

// Temporary "database"
let users = []; 
let currentUser = null;

// Handle donor registration (signup)
document.getElementById("donarform").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const name = document.querySelector("#name").value;
  const photoInput = document.querySelector("#photo");
  let photoURL = "default.jpg";

  if (photoInput.files && photoInput.files[0]) {
    photoURL = URL.createObjectURL(photoInput.files[0]);
  }

  // Save new user
  users.push({ email, password, name, photo: photoURL });
  alert("Signup successful! এখন Login করুন।");

  // Clear form
  this.reset();
});

// Handle login
document.getElementById("loginBtn").addEventListener("click", () => {
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password:");

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    currentUser = user;
    alert("Login successful!");

    // Hide login/signup
    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("signupBtn").style.display = "none";

    // Show profile menu
    document.getElementById("profileMenu").style.display = "inline-block";
    document.getElementById("navProfilePic").src = user.photo;
  } else {
    alert("Invalid email or password!");
  }
});


