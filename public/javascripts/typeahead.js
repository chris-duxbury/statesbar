const typeahead = {
    selectedIndex: -1,
    init: function() {
        this.input = document.getElementById("statesbar");
        if (!this.input) return;
        this.input.addEventListener("input", this.handleInput.bind(this));
        this.input.addEventListener("keydown", this.handleKeyDown.bind(this));
        this.matches = document.getElementById("matches");
        fetch("/states")
            .then(response => response.json())
            .then(data => {
                this.states = data.states;
            });
    },
    handleInput: function() {
        this.clearResults();
        let { value } = this.input;
        // if no text or a state has been exactly entered
        if (value.length < 1 || this.states.includes(value)) {
            value = ".*";
            this.matches.style.display = "none";
        } else {
            this.matches.style.display = "block";
        };
        // states that begins the same as text
        const starts = new RegExp("^" + value, "i");
        // states that includes text
        const match = new RegExp(value, "i");
        // filter states by above match
        const results = this.states
            .filter(state => match.test(state))
            .sort((a, b) => {
                if (starts.test(a.name) && !starts.test(b.name)) return -1;
                if (!starts.test(a.name) && starts.test(b.name)) return 1;
                return a.name < b.name ? -1 : 1;
            });
        // no matches
        if (results.length === 0) {
            this.matches.style.display = "none";
        }
        for (const state of results) {
            const item = document.createElement("li");
            const matchedText = match.exec(state)[0];
            item.innerHTML = value == ".*" ? state :
                // bold matched part of state
                state.replace(
                    matchedText,
                    "<strong>" + matchedText + "</strong>"
                );
            this.matches.appendChild(item);
            item.addEventListener("click", () => {
                this.input.value = state;
                this.handleInput();
            });
        }
    },
    handleKeyDown: function(event) {
        const { keyCode } = event;
        const results = this.matches.children;
        // down key
        if (keyCode === 40 && this.selectedIndex < results.length - 1) {
            this.selectedIndex++;
        // up key
        } else if (keyCode === 38 && this.selectedIndex >= 0) {
            this.selectedIndex--;
        // enter key
        } else if (keyCode === 13 && results[this.selectedIndex]) {
            event.preventDefault();
            const strong = new RegExp("<\/?strong>", "g");

            // change search text to entered state
            this.input.value = results[this.selectedIndex].innerHTML.replace(strong, '');
            this.handleInput();
        }
        // find selected state from drop down
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const selectedClass = "selected";
            if (i === this.selectedIndex) {
                result.classList.add(selectedClass);
            } else if (result.classList.contains(selectedClass)) {
                result.classList.remove(selectedClass);
            }
        }
    },
    clearResults: function() {
        this.selectedIndex = -1;
        while (this.matches.firstChild) {
            this.matches.removeChild(this.matches.firstChild);
        }
    },
};

typeahead.init();