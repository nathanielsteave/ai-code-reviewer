async function review() {
    const codeInput = document.getElementById("code").value;
    const btn = document.getElementById("reviewBtn");
    const resultContainer = document.getElementById("resultContainer");
    const statusMessage = document.getElementById("statusMessage");
    const staticResult = document.getElementById("staticResult");
    const aiResult = document.getElementById("aiResult");

    if (!codeInput.trim()) {
        statusMessage.textContent = "ABORTED: Empty payload. Provide code to analyze.";
        statusMessage.classList.add("text-red-500");
        resultContainer.classList.add("hidden");
        return;
    }

    btn.disabled = true;
    btn.textContent = "Processing...";
    resultContainer.classList.add("hidden");
    statusMessage.classList.remove("hidden", "text-red-500");
    statusMessage.textContent = "Transmitting payload to backend and awaiting LLM computation...";

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
            throw new Error(errorData.detail || `Server returned HTTP ${response.status}`);
        }

        const data = await response.json();

        staticResult.innerHTML = "";
        if (data.static_issues.length === 0 || data.static_issues[0].includes("Tidak ditemukan") || data.static_issues[0].includes("clean")) {
            staticResult.innerHTML = "<li class='text-green-600'>No static violations detected. Code passes basic linting.</li>";
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

        aiResult.innerHTML = marked.parse(data.ai_review);

        statusMessage.classList.add("hidden");
        resultContainer.classList.remove("hidden");

    } catch (error) {
        statusMessage.classList.remove("hidden");
        statusMessage.textContent = `SYSTEM FAILURE: ${error.message}`;
        statusMessage.classList.add("text-red-600", "font-bold");
    } finally {
        btn.disabled = false;
        btn.textContent = "Run Analysis";
    }
}