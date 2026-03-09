async function review() {
    const codeInput = document.getElementById("code").value;
    const resultElement = document.getElementById("result");
    const button = document.querySelector("button");

    if (!codeInput.trim()) {
        resultElement.textContent = "Error: Masukkan kode terlebih dahulu.";
        return;
    }

    // Kunci UI saat memproses
    button.disabled = true;
    button.textContent = "Sedang Mereview...";
    resultElement.textContent = "Mengirim kode ke server. Harap tunggu...";

    try {
        const response = await fetch("http://127.0.0.1:8000/review", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({code: codeInput})
        });

        // Tangkap error HTTP (seperti 400 atau 500)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Server merespons dengan status: ${response.status}`);
        }

        const data = await response.json();

        // Tampilkan hasil
        resultElement.textContent =
            "--- HASIL ANALISIS STATIS ---\n" +
            data.static_issues.join("\n") +
            "\n\n--- REVIEW AI ---\n" +
            data.ai_review;

    } catch (error) {
        // Tampilkan masalah jaringan atau server kepada pengguna
        resultElement.textContent = "Gagal melakukan review:\n" + error.message;
    } finally {
        // Kembalikan UI ke kondisi semula
        button.disabled = false;
        button.textContent = "Review Code";
    }
}