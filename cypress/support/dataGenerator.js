export function getRandomNumberLength(length) {
    var string = '';
    var i;
    var numbers = '123456789';
    for (i = 0; i < length; i++) {
        string += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return string;
};

export function getRandomCharLength(length) {
    var char = '';
    var i;
    var numbers = 'abcdefghijklmnopqrstuvwxyz';
    for (i = 0; i < length; i++) {
        char += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return char;
};