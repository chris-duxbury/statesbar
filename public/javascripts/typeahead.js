const typeahead = {
    init: function() {
        this.input = document.getElementById("statesbar");
        if (!this.input) return;
        this.input.addEventListener("input", this.handleInput.bind(this));
    },
    handleInput: function() {
        return;
    }
};

typeahead.init();