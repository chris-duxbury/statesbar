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
        this.clearResults();
        let { value } = this.input;
        if (value.length < 1) value = ".*";
        const starts = new RegExp("^" + value, "i");
        const match = new RegExp(value, "i");
        const results = this.states
            .filter(state => match.test(state))
            .sort((a, b) => {
                if (starts.test(a.name) && !starts.test(b.name)) return -1;
                if (!starts.test(a.name) && starts.test(b.name)) return 1;
                return a.name < b.name ? -1 : 1;
            });
        console.log(results);
        for (const state of results) {
            const item = document.createElement("li");
            const matchedText = match.exec(state)[0];
            item.innerHTML = value == ".*" ? state :
                state.replace(
                    matchedText,
                    "<strong>" + matchedText + "</strong>"
                );
            this.matches.appendChild(item);
        }
    },
    clearResults: function() {
        while (this.matches.firstChild) {
            this.matches.removeChild(this.matches.firstChild);
        }
    },
};

typeahead.init();