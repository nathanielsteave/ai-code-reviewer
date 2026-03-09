async function review() {
    const codeInput = document.getElementById("code").value;
    const btn = document.getElementById("reviewBtn");
    const resultContainer = document.getElementById("resultContainer");
    const statusMessage = document.getElementById("statusMessage");
    const staticResult = document.getElementById("staticResult");
    const aiResult = document.getElementById("aiResult");

    // Jangan biarkan pengguna menekan tombol kosong
    if (!codeInput.trim()) {
        statusMessage.textContent = "BERHENTI! Anda belum memasukkan kode apa pun untuk di-review.";
        statusMessage.classList.add("text-red-500");
        resultContainer.classList.add("hidden");
        return;
    }

    // Ubah state UI ke mode Loading
    btn.disabled = true;
    btn.textContent = "Menganalisis...";
    resultContainer.classList.add("hidden");
    statusMessage.classList.remove("hidden", "text-red-500");
    statusMessage.textContent = "Mengirim data ke server dan menunggu komputasi Llama 3.1...";

    try {
        const response = await fetch("http://127.0.0.1:8000/review", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({code: codeInput})
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Server API hancur atau tidak merespons.");
        }

        const data = await response.json();

        // Render Analisis Statis
        staticResult.innerHTML = "";
        if (data.static_issues.length === 0 || data.static_issues[0].includes("Tidak ditemukan")) {
            staticResult.innerHTML = "<li class='text-green-600'>Kode bersih. Tidak ada pelanggaran statis fatal.</li>";
            staticResult.parentElement.querySelector('ul').classList.replace('bg-red-50', 'bg-green-50');
            staticResult.parentElement.querySelector('ul').classList.replace('border-red-100', 'border-green-100');
        } else {
            data.static_issues.forEach(issue => {
                const li = document.createElement("li");
                li.textContent = issue;
                staticResult.appendChild(li);
            });
            staticResult.parentElement.querySelector('ul').classList.replace('bg-green-50', 'bg-red-50');
            staticResult.parentElement.querySelector('ul').classList.replace('border-green-100', 'border-red-100');
        }

        // Parse dan Render Review AI menggunakan marked.js
        aiResult.innerHTML = marked.parse(data.ai_review);

        // Tampilkan hasil, sembunyikan loading
        statusMessage.classList.add("hidden");
        resultContainer.classList.remove("hidden");

    } catch (error) {
        statusMessage.classList.remove("hidden");
        statusMessage.textContent = `KEGAGALAN SISTEM: ${error.message}`;
        statusMessage.classList.add("text-red-600", "font-bold");
    } finally {
        // Kembalikan tombol ke state semula
        btn.disabled = false;
        btn.textContent = "Jalankan Review";
    }
}