document.addEventListener("DOMContentLoaded", function() {
    console.log("Abaqus Python Integration Page Loaded");

    // Smooth scrolling for navigation
    document.querySelectorAll("a[href^='#']").forEach(anchor => {
        anchor.addEventListener("click", function(event) {
            event.preventDefault();
            document.querySelector(this.getAttribute("href")).scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    // Highlight Python code blocks
    document.querySelectorAll("pre code").forEach(block => {
        block.classList.add("language-python");
    });
});
