const typeahead = {
    init: function() {
        this.input = document.getElementById("statesbar");
        if (!this.input) return;
        this.input.addEventListener("input", this.handleInput.bind(this));
        this.matches = document.getElementById("matches");
        fetch("/states")
            .then(response => response.json())
            .then(data => {
                this.states = data.states;
                for (const state of this.states) {
                    const item = document.createElement("li");
                    item.innerHTML = state;
                    this.matches.appendChild(item);
                }
            });
    },
    handleInput: function() {

        return;
    }
};

typeahead.init();