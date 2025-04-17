export default function productOptionsByName (name) {
    // Split the name by "-" to extract size and color
    const parts = name.split('-');
    if (parts.length < 3) return [];

    const size = parts[parts.length - 2];
    const color = parts[parts.length - 1];

    return [
        {
            option_label: "Color",
            value_label: color,
            __typename: "SelectedConfigurableOption"
        },
        {
            option_label: "Size",
            value_label: size,
            __typename: "SelectedConfigurableOption"
        }
    ];
}   