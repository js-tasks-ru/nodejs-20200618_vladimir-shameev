function sum(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new TypeError('wrong arguments');
    }

    return a + b;
}

module.exports = sum;
