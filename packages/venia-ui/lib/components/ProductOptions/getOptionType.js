const customAttributes = {
    fashion_color: 'swatch',
    color: 'swatch',
    
};

export default ({ attribute_code: code } = {}) => customAttributes[code];
