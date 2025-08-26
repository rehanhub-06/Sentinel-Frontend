document.addEventListener("DOMContentLoaded", () => {
    const addGuardianBtn = document.getElementById("addGuardianBtn");
    const guardianList = document.getElementById("guardianList");
    const nameInput = document.getElementById("guardianName");
    const phoneInput = document.getElementById("guardianPhone");

    // Add guardian
    addGuardianBtn.addEventListener("click", () => {
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();

        if (!name || !phone) {
            alert("Please fill in both fields");
            return;
        }

        const li = document.createElement("li");
        li.innerHTML = `
            <span class="guardian-info">${name} - ${phone}</span>
            <button class="remove-btn">Remove</button>
        `;

        li.querySelector(".remove-btn").addEventListener("click", () => {
            li.remove();
        });

        guardianList.appendChild(li);

        nameInput.value = "";
        phoneInput.value = "";
    });

    // Remove guardian (existing ones)
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.target.closest("li").remove();
        });
    });
});