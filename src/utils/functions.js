module.exports = {
    async createCards() {
        const limitCards = 5;
        var finalCards = { cpu: [], player: [] };
        for (const final in finalCards) {
            for (let i = 0; i < limitCards; i++) {
                finalCards[final].push(Math.floor(Math.random() * (13 - 1 + 1)) + 1);
            }
        }
        return finalCards
    }
}