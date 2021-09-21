const layersOrder = [
    { name: 'BG_400', number: 11 },
    { name: 'Head_400', number: 11 },
    { name: 'Eyes_400', number: 10 },
    { name: 'Mouth_400', number: 10 },
    { name: 'Nose_400', number: 10 },
];

const format = {
    width: 400,
    height: 400
};

const rarity = [
    { key: "", val: "original" },
    { key: "_r", val: "rare" },
    { key: "_sr", val: "super rare" },
];

const defaultEdition = 1000;

module.exports = { layersOrder, format, rarity, defaultEdition };