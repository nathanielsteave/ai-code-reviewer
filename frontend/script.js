async function review() {

    const code = document.getElementById("code").value;

    const response = await fetch("http://127.0.0.1:8000/review", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({code: code})
    });

    const data = await response.json();

    document.getElementById("result").textContent =
        "Static Issues:\n" +
        data.static_issues.join("\n") +
        "\n\nAI Review:\n" +
        data.ai_review;
}