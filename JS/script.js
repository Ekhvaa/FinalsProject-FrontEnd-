document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("modalOverlay");

  const hideModal = () => {
    console.log("Hiding modal");
    overlay.classList.add("hidden");
  };

  const showModal = () => {
    console.log("Showing modal");
    overlay.classList.remove("hidden");
  };

  const registerButton = document.querySelector(".register-button");
  console.log("Register Button:", registerButton);

  if (registerButton) {
    registerButton.addEventListener("click", showModal);
  }

  const closeButton = document.getElementById("closeModal");
  if (closeButton) closeButton.addEventListener("click", hideModal);

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      console.log("Clicked on overlay");
      hideModal();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      console.log("Pressed Escape");
      hideModal();
    }
  });

  const burgerMenu = document.getElementById("burgerMenu");
  const mobileDropdown = document.getElementById("mobileDropdown");

  const toggleMobileMenu = () => {
    mobileDropdown.classList.toggle("show");
    console.log("Mobile menu toggled");
  };

  if (burgerMenu) {
    burgerMenu.addEventListener("click", toggleMobileMenu);
  }

  const mobileRegisterBtn = document.getElementById("mobileRegisterBtn");
  if (mobileRegisterBtn) {
    mobileRegisterBtn.addEventListener("click", () => {
      showModal();
      mobileDropdown.classList.remove("show");
    });
  }

  const mobileGenresLink = document.getElementById("mobileGenresLink");
  const mobileTopTracksLink = document.getElementById("mobileTopTracksLink");

  if (mobileGenresLink) {
    mobileGenresLink.addEventListener("click", () => {
      document
        .getElementsByClassName("hero-section")[0]
        .scrollIntoView({ behavior: "smooth" });
      mobileDropdown.classList.remove("show");
    });
  }

  if (mobileTopTracksLink) {
    mobileTopTracksLink.addEventListener("click", () => {
      document
        .getElementsByClassName("top-tracks-section")[0]
        .scrollIntoView({ behavior: "smooth" });
      mobileDropdown.classList.remove("show");
    });
  }

  document.addEventListener("click", (e) => {
    if (!burgerMenu.contains(e.target) && !mobileDropdown.contains(e.target)) {
      mobileDropdown.classList.remove("show");
    }
  });
});

const clientId = "0bfbf44a9cd34ab6b7a8291ce619b530";
const clientSecret = "4733c15d902d458fb84fdd5ed40bebaa";

async function getAccessToken() {
  try {
    const credentials = btoa(`${clientId}:${clientSecret}`);
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) throw new Error("Error getting access token");

    return (await response.json()).access_token;
  } catch (error) {
    console.error("ERROR: " + error);
  }
}

async function getTopTracksGlobally(playlist_id) {
  const token = await getAccessToken();
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

  const data = await response.json();
  console.log(data);
  for (let i = 1; i <= 6; i++) {
    const trackCard = document.createElement("div");
    trackCard.className = "track-card";
    trackCard.innerHTML = `
                <div class="track-image">
                    <img src=${
                      data.items[i - 1].track.album.images[0].url
                    } alt="">
                </div>
                <div class="track-description">
                    <p class="track-rank">#${i}</p>
                    <h3><span class="desc-span">Track: </span>${
                      data.items[i - 1].track.name
                    }</h3>
                    <p><span class="desc-span">Artist: </span>${
                      data.items[i - 1].track.artists[0].name
                    }</p>
                    <p><span class="desc-span">Album: </span>${
                      data.items[i - 1].track.album.name
                    }</p>
                </div>`;

    const tracksContainer = document.getElementById("tracksContainer");
    tracksContainer.appendChild(trackCard);
  }
}

function validateForm() {
  const form = document.getElementById("registrationForm");
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const errorMessage = document.getElementById("errorMessage");

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~-])[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~-]{8,}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errorMessage.innerText = "";

    if (
      !username.value.trim() ||
      !email.value.trim() ||
      !password.value.trim() ||
      !confirmPassword.value.trim()
    ) {
      errorMessage.innerText = "Please fill out all the fields.";
      return;
    }

    if (emailRegex.test(email.value)) {
      errorMessage.innerText = "Invalid email format.";
      return;
    }

    if (!strongPasswordRegex.test(password.value)) {
      errorMessage.innerText =
        "Password must be 8+ characters with uppercase, lowercase, number, and special character.";
      return;
    }

    if (password.value !== confirmPassword.value) {
      errorMessage.innerText = "Passwords do not match.";
      return;
    }

    errorMessage.innerText = "";
    alert("Registration successful!");
    form.reset();
  });

  document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(targetId);

      if (input.type === "password") {
        input.type = "text";
        this.textContent = "Hide";
      } else {
        input.type = "password";
        this.textContent = "Show";
      }
    });
  });
}

let scrollToSection = (linkId, section) =>
  document
    .getElementById(linkId)
    .addEventListener("click", () =>
      document
        .getElementsByClassName(section)[0]
        .scrollIntoView({ behavior: "smooth" })
    );

scrollToSection("topTracksLink", "top-tracks-section");
scrollToSection("genresLink", "hero-section");
getTopTracksGlobally("6UeSakyzhiEt4NB3UAd6NQ");
validateForm();
